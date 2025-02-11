<script>
    import { onMount } from "svelte";
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

    onMount(loadTemplates);

    selectedTemplateId.subscribe(value => $selectedTemplateId = value);
    const selectTemplate = (id) => {
        selectedTemplateId.update(currentId => (currentId === id ? null : id));
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
        {#each $templates as template}
            <label class="template-box { $selectedTemplateId === template.id ? 'selected' : '' }"
                on:click={() => selectTemplate(template.id)}>
                {template.name}
            </label>
        {/each}
    </div>
{/if}