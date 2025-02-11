<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { templates, selectedTemplateId } from "../store.js";
    let error = null;

    const loadTemplates = async () => {
        try {
            const response = await fetch("/api/templates");
            if (!response.ok) throw new Error("Failed to fetch templates");
            const data = await response.json();
            templates.set(data.response);
        } catch (err) {
            error = err.message;
        }
    };

    const getTemplateForm = async (id) => {
        try {
            const response = await fetch(`/api/templates/form/${id}`);
            if (!response.ok) throw new Error("Failed to fetch template form");
            return await response.json();
        } catch (err) {
            console.error("Error fetching template form:", err);
            error = err.message;
            return null;
        }
    };

    onMount(loadTemplates);

    selectedTemplateId.subscribe(value => $selectedTemplateId = value);
    const selectTemplate = async (id) => {
        let currentTemplates = get(templates);
        let currentSelected = get(selectedTemplateId);
        if (currentSelected === id) {
            selectedTemplateId.set(null);
            return;
        }
        let template = currentTemplates.find(t => t.id === id);
        if (!template) return;

        if (!template.formData) {
            const formFields = await getTemplateForm(id);
            if (formFields) {
                templates.update(templatesList => {
                    return templatesList.map(t => (t.id === id ? { ...t, ...formFields } : t));
                });
            }
        }

        selectedTemplateId.set(id);
    };
</script>

<style>
    .template-container {
        display: flex;
        gap: 20px;
        flex-direction: column;
        margin-top: 2vh;
        width: 20vh;
    }

    .template-box {
        border: 2px solid #ddd;
        padding: 5px;
        text-align: center;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.3s ease-in-out;
        background: rgba(255, 255, 255, 0.068);
        font-weight: bold;
        position: relative;
    }

    .template-box:hover {
        border-color: #942bf0;
        transform: scale(1.05);
    }

    .selected {
        border-color: #942bf0;
        background: #5208b1db;
        color: white;
    }
</style>

{#if error}
    <p style="color: red;">Error: {error}</p>
{:else}
    <div class="template-container">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        {#each $templates as template}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <label class="template-box { $selectedTemplateId === template.id ? 'selected' : '' }"
                on:click={() => selectTemplate(template.id)}>
                {template.name}
            </label>
        {/each}
    </div>
{/if}