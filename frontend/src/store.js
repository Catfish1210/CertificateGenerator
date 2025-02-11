import { writable } from "svelte/store";

export const selectedTemplateId = writable(null);
export const templates = writable(null);