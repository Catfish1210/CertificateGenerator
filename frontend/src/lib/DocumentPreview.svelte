<script>
    import { onDestroy } from "svelte";
    import { generatedPDF } from "../store";

    let base64PDF = '';
    const unsubscribe = generatedPDF.subscribe((pdf) => {
        base64PDF = pdf;
    });

    onDestroy(unsubscribe);
</script>

{#if base64PDF}
    <iframe
        src="data:application/pdf;base64,{base64PDF}"
        style="width: 100%; height: 100%; border: none;"
        title="Certificate Preview"
    ></iframe>
{:else}
    <div class="container">
        <p>No document</p>
    </div>
{/if}

<style>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container p {
        margin: 0;
        user-select: none;
        font-size: xx-large;
        font-weight: 500;
    }
</style>
