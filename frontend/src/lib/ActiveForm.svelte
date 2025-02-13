<script>
	// @ts-nocheck
	import Switch from "./Switch.svelte";
	import { selectedTemplateId, generatedPDF, formData, CertificateTemplateID } from "../store";
	import { get } from "svelte/store";
	import { isValidDate, isValidImageURL, isString, fieldConfig, triggerDownload } from "../utils/formUtils";
    import { tick } from "svelte";

	// Auto refresh feature variables
	let isSwitchOn = false;
	let lastUpdateTimestamp = 0;
	const autoUpdateInterval = 5000; // ms
	let previousFormSubmission = { ...$formData };

	const handleSubmit = async (event, type) => {
		const isDownload = type === 'download';
		event.preventDefault();
		// Check image before request
		const isImageValid = await isValidImageURL(get(formData).image);
		if (!isImageValid) {
			formValidity.image = false;
			await tick();
			console.error("Invalid image URL (jpg, jpeg, png): not making request.");
			return;
		}

		const formDataFields = { date: $formData.date, image: $formData.image, signature_name: $formData.signature_name, student_name: $formData.student_name, subject: $formData.subject };
		const updateDocumentPreview = async () => {
        try {
			const response = await fetch("api/documents/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json"},
				body: JSON.stringify({
					templateId: $CertificateTemplateID,
					formData: {...formDataFields},
					isDownload: isDownload
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to generate PDF");
			}

			const json = await response.json();
			const base64PDF = json.pdf;
        	generatedPDF.set(base64PDF);

			if (type === 'download') {
				triggerDownload(base64PDF, 'certificate');
			}

			previousFormSubmission = { ...$formData };
		} catch (error) {
			console.error(error);
		}
		};
		await updateDocumentPreview();
	};

	const autoUpdatePreview = () => {
		if (isSwitchOn && Object.values(formValidity).every((valid) => valid) && 
		Date.now() - lastUpdateTimestamp >= autoUpdateInterval &&
		JSON.stringify(formData) !== JSON.stringify(previousFormSubmission)
		) {
			document.querySelector("button[type='submit']").click();
			lastUpdateTimestamp = Date.now();
		}
	}

	const handleInputChange = async (fieldName, value) => {
		$formData[fieldName] = value;
	};

	// Reactive field checks
	$: formValidity = {
		image: $formData.image !== null ? $formData.image.length > 0 : true,
		date: $formData.date !== null ? isValidDate($formData.date) : true,
		signature_name: $formData.signature_name !== null ? isString($formData.signature_name) && $formData.signature_name.length > 0 : true,
		student_name: $formData.student_name !== null ? isString($formData.student_name) && $formData.student_name.length > 0 : true,
		subject: $formData.subject !== null ? isString($formData.subject) && $formData.subject.length > 0 : true
	};

	setInterval(autoUpdatePreview, autoUpdateInterval);
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
							class:valid={formValidity[fieldName]}
							class:invalid={!formValidity[fieldName]}
							on:input={(e) => handleInputChange(fieldName, e.currentTarget.value)}
						/>
						{#if !formValidity[fieldName]}
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
			<Switch bind:checked={isSwitchOn} label="Enable auto refresh" objScale="0.3"/>
		</div>
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
		padding: 0.5rem;
		display: flex;
		flex-direction: row;
		margin-bottom: 1rem;
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
		margin-top: 0.5rem;
	}

	input {
		background-color: #16161673;
		width: 25vh;
		padding: 0.5rem;
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
