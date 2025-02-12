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

	let formData = null;
	let template = null;
	let isSwitchOn = false;
	// Checks if the template is valid and matches provided template_certificate.json
	let isValidPrototype = true;

	$: {
		const selectedId = $selectedTemplateId;
		const currentTemplates = get(templates);
		template = currentTemplates ? currentTemplates.find((t) => t.id === selectedId) : null;
		formData = template ? { ...template.formData } : {};
		isValidPrototype = isPrototypeSpecificTemplate(formData);
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
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

	const handleInputChange = (fieldName, value) => {
		console.log(`${fieldName} updated to : ${value}`);
		if (value.length === 0) {
			touchedFields[fieldName] = false;
		}
		template.formData[fieldName] = value;
	};

	let touchedFields = {
		image: false,
		date: false,
		signature_name: false,
		student_name: false,
		subject: false,
	};

	const handleFocus = (field) => {
		touchedFields[field] = true;
	};

	const handleBlur = (field) => {
		if (formValidity[field] === false) {
			return;
		}
		touchedFields[field] = false;
	};
	// Reactive field checks
	$: formValidity = {
		image: touchedFields.image ? isValidImageURL(formData.image) : true,
		date: touchedFields.date ? isValidDate(formData.date) : true,
		signature_name: touchedFields.signature_name ? isString(formData.signature_name) : true,
		student_name: touchedFields.student_name ? isString(formData.student_name) : true,
		subject: touchedFields.subject ? isString(formData.subject) : true,
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
							on:focus={() => handleFocus(fieldName)}
							on:input={(e) => handleInputChange(fieldName, e.currentTarget.value)}
							on:blur={() => handleBlur(fieldName)}
						/>
						{#if touchedFields[fieldName] && !formValidity[fieldName]}
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
