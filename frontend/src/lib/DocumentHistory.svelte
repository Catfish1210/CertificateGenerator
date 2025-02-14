<script>
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { CertificateTemplateId, selectedDocumentId, documentHistoryArr, generatedPdf, updateDocumentHistory} from "../store.js";
    import { formatDate } from "../utils/formatDate.js";
    let error = null;
    onMount(async () => {
        await updateDocumentHistory();
    });
    
    let documentHistory;
    $: {
        documentHistory = get(documentHistoryArr)
    }

    const handleButtonClick = async (id) => {
        if ($selectedDocumentId === id) {
            selectedDocumentId.set(null);
        } else {
            selectedDocumentId.set(id);
            const selectedDocument = $documentHistoryArr.find(doc => doc.id === id);
            if (selectedDocument) {
                try {
                    const response = await fetch("api/documents/generate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json"},
                        body: JSON.stringify({
                            templateId: $CertificateTemplateId,
                            formData: {
                                date: selectedDocument.date,
                                image: selectedDocument.image,
                                signature_name: selectedDocument.signature_name,
                                student_name: selectedDocument.student_name,
                                subject: selectedDocument.subject
                            },
                            isDownload: false
                        }),
                    });
                    const json = await response.json();
                    const base64Pdf = json.pdf;
                    generatedPdf.set(base64Pdf);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Document not found with current id: ", id);
            }
        }
    };
</script>

{#if error}
    <p style="color: red;">Error: {error}</p>
{:else}
    <div class="template-container">
        {#each documentHistory as doc}
            <button class="template-box { $selectedDocumentId === doc.id ? 'selected' : '' }"
            on:click={() => handleButtonClick(doc.id)}>Doc ID: {doc.id}<br>{formatDate(doc.document_created_at)}</button>
        {/each}
    </div>
{/if}

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
