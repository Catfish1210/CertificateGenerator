<script>
	// @ts-nocheck
	import Switch from "./Switch.svelte";
	import { selectedTemplateId, generatedPdf, formData, CertificateTemplateId, showDocumentHistory, updateDocumentHistory } from "../store";
	import { get } from "svelte/store";
	import { isValidDate, isValidImageURL, isString, fieldConfig, triggerDownload } from "../utils/formUtils";
    import { tick } from "svelte";

	// Auto refresh feature variables
	let isSwitchOn = false;
	let lastUpdateTimestamp = 0;
	const autoUpdateFrequencyMs = 5000;
	let previousFormSubmission = { ...$formData };

	const handleSubmit = async (event, type) => {
		event.preventDefault();
		const isDownload = type === 'download';

		// Check image before request
		const isImageValid = await isValidImageURL(get(formData).image);
		if (!isImageValid) {
			formValidity.image = false;
			await tick();
			console.error("Invalid image URL (jpg, jpeg, png): not making request.");
			return;
		} else {
			formValidity.image = true;
		}

		// Check form validity
		const isFormValid = Object.values(formValidity).every(value => value === true);
		if (!isFormValid) {
			console.error("Invalid form or missing fields");
			return;
		}

		const formDataFields = {
			date: $formData.date,
			image: $formData.image,
			signature_name: $formData.signature_name,
			student_name: $formData.student_name,
			subject: $formData.subject
		};
		const updateDocumentPreview = async () => {
        try {
			const response = await fetch("api/documents/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json"},
				body: JSON.stringify({
					templateId: $CertificateTemplateId,
					formData: {...formDataFields},
					isDownload: isDownload
				}),
			});

			const json = await response.json();
			const base64Pdf = json.pdf;
        	generatedPdf.set(base64Pdf);

			previousFormSubmission = { ...$formData };
		} catch (error) {
			console.error(error);
		}
		};
		await updateDocumentPreview();

		if (type === 'download') {
			let pdf = get(generatedPdf);
			triggerDownload(pdf, 'certificate');
			updateDocumentHistory()
		}
	};

	const autoUpdatePreview = () => {
		if (isSwitchOn && Date.now() - lastUpdateTimestamp >= autoUpdateFrequencyMs &&
		JSON.stringify(formData) !== JSON.stringify(previousFormSubmission)
		) {
			document.querySelector("button[type='submit']").click();
			lastUpdateTimestamp = Date.now();
		}
	}

	const handleInputChange = async (fieldName, value) => {
		$formData[fieldName] = value;
		modifiedFields[fieldName] = true;
	};

	let modifiedFields = {
		image: false,
		date: false,
		signature_name: false,
		student_name: false,
		subject: false
	};

	// Reactive field checks
	$: formValidity = {
		image: $formData.image ? $formData.image.length > 0 : false,
		date: $formData.date ? isValidDate($formData.date) : false,
		signature_name: $formData.signature_name ? isString($formData.signature_name) && $formData.signature_name.length > 0 : false,
		student_name: $formData.student_name ? isString($formData.student_name) && $formData.student_name.length > 0 : false,
		subject: $formData.subject ? isString($formData.subject) && $formData.subject.length > 0 : false
	};

	setInterval(autoUpdatePreview, autoUpdateFrequencyMs);
</script>

{#if $formData}
	<div class="form-container">
		<form on:submit={(e) => handleSubmit(e, 'preview')}>
			{#each Object.keys($formData) as fieldName}
				<div class="form-group">
					<label for={fieldName}>{fieldConfig[fieldName]?.placeholder ||fieldName}</label>
					<div class="input-wrapper">
						<input
							type={fieldConfig[fieldName]?.type || "text"}
							id={fieldName}
							bind:value={$formData[fieldName]}
							placeholder={fieldConfig[fieldName]?.placeholder || fieldName}
							required
							class:valid={modifiedFields[fieldName] && formValidity[fieldName]}
							class:invalid={modifiedFields[fieldName] && !formValidity[fieldName]}
							on:input={(e) => handleInputChange(fieldName, e.currentTarget.value)}
						/>
						{#if modifiedFields[fieldName] && !formValidity[fieldName]}
							<p class="error-message">{fieldConfig[fieldName]?.errorMessage || "Invalid input."}</p>
						{/if}
					</div>
				</div>
			{/each}
			<div class="btn-container">
				<button type="submit" on:click={(e) => handleSubmit(e, 'preview')}>Preview document</button>
				<button class="download-btn" type="button" on:click={(e) => handleSubmit(e, 'download')}>Download document</button>
			</div>
		</form>
		<div class="toggle-container">
			<Switch id="auto-refresh" bind:checked={isSwitchOn} label="Enable auto refresh" statusText="Auto refresh (5s)" objScale="0.3"/>
		</div>
	</div>
	<div class="toggle-container">
		<Switch id="show-history" bind:checked={$showDocumentHistory} label="Show document history" statusText="Show document History" objScale="0.3"/>
	</div>
{/if}

<style>
	.toggle-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		overflow: none;
	}

	.form-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		transition: opacity 0.1s ease;
	}

	.input-wrapper {
		margin-left: 1rem;
		display: flex;
		flex-direction: column;
		align-items: end;
		position: relative;
		width: 100%;
	}

	.form-group {
		border-top: 2px solid #ffffff;
		padding: 0.3rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		overflow: scroll;
	}

	.error-message {
		color: red;
		font-weight: 500;
		letter-spacing: 0.08rem;
		text-align: center;
		margin: 0;
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
		font-size: 0.875rem;
		user-select: none;
	}

	label {
		margin-top: 0.4rem;
		font-weight: 500;
	}

	input {
		background-color: #16161673;
		width: 25vh;
		padding: 0.4rem;
		font-size: 1rem;
		border-radius: 4px;
		border: 2px solid #6c18e2;
		transition: border 0.3s ease;
	}

	input.valid {
		border-color: #6c18e2;
	}

	input.invalid {
		border-color: red;
	}

	button {
		padding: 0.7rem;
		background-color: #363636;
		color: white;
		border: 3px solid #6c18e2;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.25s ease;
	}

	button:hover {
		background-color: #484848;
		border-color: #942bf0;
	}
	
	button:active {
		background-color: #505050;
	}

	.download-btn {
		border-color: #1dc71d;
	}

	.download-btn:hover {
		border-color: #4ec14e;
	}

	.btn-container {
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 5%;
	}
</style>
