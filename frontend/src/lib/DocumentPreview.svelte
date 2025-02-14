<script>
    import { onDestroy } from "svelte";
    import { generatedPdf } from "../store";

    let base64Pdf = '';
    const unsubscribe = generatedPdf.subscribe((pdf) => {
        base64Pdf = pdf;
    });

    onDestroy(unsubscribe);
</script>

{#if base64Pdf}
    <iframe
        src="data:application/pdf;base64,{base64Pdf}"
        title="Certificate Preview"
    ></iframe>
{:else}
    <div class="container">
        <p>No document</p>
    </div>
{/if}

<style>
    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
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
