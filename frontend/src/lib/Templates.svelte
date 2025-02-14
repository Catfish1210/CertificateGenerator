<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { CertificateTemplateId, selectedTemplateId } from "../store.js";
    let error = null;

    const loadTemplates = async () => {
        try {
            const response = await fetch("/api/templates");
            if (!response.ok) throw new Error("Failed to fetch templates");
            const data = await response.json();
            CertificateTemplateId.set(data.id);
        } catch (err) {
            error = err.message;
        }

    };
    onMount(async () => {
        await loadTemplates();
    });
    let id;
    $: {id = get(CertificateTemplateId)}
    const toggleSelectedTemplate = () => {
        if (get(CertificateTemplateId) === get(CertificateTemplateId)) {
            selectedTemplateId.set(null);  
        } else {
            selectedTemplateId.set(get(CertificateTemplateId));
        }
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
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="template-container">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <label class="template-box {get(selectedTemplateId) === get(CertificateTemplateId) ? 'selected' : ''}"
                on:click={toggleSelectedTemplate}>
                Certificate Example
        </label>

    </div>
{/if}