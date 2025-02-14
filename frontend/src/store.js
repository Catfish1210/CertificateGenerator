import { writable, get } from "svelte/store";

export const generatedPdf = writable(null);
export const CertificateTemplateId = writable(null);
export const selectedTemplateId = writable(null);
export const showDocumentHistory = writable(false);
export const selectedDocumentId = writable(null);
export const documentHistoryArr = writable([]);
export const formData = writable({
    date: null,
    image: null,
    signature_name: null,
    student_name: null,
    subject: null,
});

export const updateDocumentHistory = async () => {
    const templateId = get(CertificateTemplateId);
    try {
        const response = await fetch(`/api/document-history?templateId=${templateId}`);
        if (!response.ok) throw new Error("Failed to fetch document history");
        const data = await response.json();
        documentHistoryArr.set(data.documentHistory);
    } catch (err) {
        console.error(err);
    }
}