import { writable } from "svelte/store";

export const generatedPDF = writable(null);
export const CertificateTemplateID = writable(null);
export const selectedTemplateId = writable(null);
export const formData = writable({
    date: null,
    image: null,
    signature_name: null,
    student_name: null,
    subject: null,
});
