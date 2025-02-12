<script>
	// @ts-nocheck
	import Switch from "./Switch.svelte";
	import { selectedTemplateId, templates, generatedPDF } from "../store";
	import { get } from "svelte/store";
	import {
		isValidDate,
		isValidImageURL,
		isString,
		fieldConfig,
		isPrototypeSpecificTemplate,
	} from "../utils/formUtils";
    import { tick } from "svelte";
	let formData = {
		image: null,
		date: null,
		signature_name: null,
		student_name: null,
		subject: null
	};

	
	let template = null;
	let isSwitchOn = false;
	// Checks if the template is valid and matches provided template_certificate.json
	let isValidPrototype = true;

	$: {
		const selectedId = $selectedTemplateId;
		const currentTemplates = get(templates);
		template = currentTemplates ? currentTemplates.find((t) => t.id === selectedId) : null;
		if (template) {
			formData = {
				date: formData.date !== null ? formData.date : (template.formData?.date || null),
				image: formData.image !== null ? formData.image : (template.formData?.image || null),
				signature_name: formData.signature_name !== null ? formData.signature_name : (template.formData?.signature_name || null),
				student_name: formData.student_name !== null ? formData.student_name : (template.formData?.student_name || null),
				subject: formData.subject !== null ? formData.subject : (template.formData?.subject || null)
			};
		}
		
		isValidPrototype = isPrototypeSpecificTemplate(formData);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		// Check image before request
		const isImageValid = await isValidImageURL(formData.image);
		if (!isImageValid) {
			formValidity.image = false;
			await tick();
			console.log("INVALID IMG URL, not making req")
			return;
		}

		const formDataFields = { date: formData.date, image: formData.image, signature_name: formData.signature_name, student_name: formData.student_name, subject: formData.subject };
		const updateDocumentPreview = async () => {
        try {
			const response = await fetch("api/documents/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json"},
				body: JSON.stringify({
					templateId: $selectedTemplateId,
					formData: {...formDataFields}
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to generate PDF");
			}

			const json = await response.json();
			const base64PDF = json.pdf;
        	generatedPDF.set(base64PDF);
			} catch (error) {
				console.error(error);
			}
		};
		await updateDocumentPreview();
		// console.log("Form submitted with data:", formData);
	};

	const handleInputChange = async (fieldName, value) => {
		console.log(`${fieldName} updated to : ${value}`);
		template.formData[fieldName] = value;
	};


	const handleBlur = (field) => {
		if (formValidity[field] === false) {
			return;
		}
	};
	// Reactive field checks
	$: formValidity = {
		image: formData.image !== null ? formData.image.length > 0 : true,
		date: formData.date !== null ? isValidDate(formData.date) : true,
		signature_name: formData.signature_name !== null ? isString(formData.signature_name) && formData.signature_name.length > 0 : true,
		student_name: formData.student_name !== null ? isString(formData.student_name) && formData.student_name.length > 0 : true,
		subject: formData.subject !== null ? isString(formData.subject) && formData.subject.length > 0 : true
	};
</script>

{#if formData}
	{#if !isValidPrototype}
		<p class="overlay-text">Invalid template: Not prototype-specific template</p>
	{/if}

	<div class="form-container {isValidPrototype ? '' : 'invalid-template'}">
		<form on:submit={handleSubmit}>
			{#each Object.keys(formData) as fieldName}
				<div class="form-group">
					<label for={fieldName}>{fieldConfig[fieldName]?.placeholder ||fieldName}</label>
					<div class="input-wrapper">
						<input
							type={fieldConfig[fieldName]?.type || "text"}
							id={fieldName}
							bind:value={formData[fieldName]}
							placeholder={fieldConfig[fieldName]?.placeholder ||fieldName}
							required
							class:valid={formValidity[fieldName]}
							class:invalid={!formValidity[fieldName]}
							on:input={(e) => handleInputChange(fieldName, e.currentTarget.value)}
							on:blur={() => handleBlur(fieldName)}
						/>
						{#if !formValidity[fieldName]}
							<p class="error-message">{fieldConfig[fieldName]?.errorMessage || "Invalid input."}</p>
						{/if}
					</div>
				</div>
			{/each}
			<button type="submit">Preview document</button>
		</form>
		<div class="toggle-container">
			{#if isValidPrototype}
				<Switch bind:checked={isSwitchOn} label="Enable auto refresh" objScale="0.3"/>
			{/if}
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

	.form-container.invalid-template {
		background: rgba(0, 0, 0, 0.2);
		pointer-events: none;
		filter: blur(5px);
		opacity: 0.4;
	}

	.overlay-text {
		color: red;
		font-size: large;
		font-weight: bold;
		user-select: none;
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
</style>
