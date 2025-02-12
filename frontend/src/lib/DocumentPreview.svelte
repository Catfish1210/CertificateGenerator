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
    <p>No document</p>
{/if}

