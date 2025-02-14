<script>
    import { onMount } from "svelte";
	import { fly } from "svelte/transition";
	import ActiveForm from "./lib/ActiveForm.svelte";
    import DocumentPreview from "./lib/DocumentPreview.svelte";
	import DocumentHistory from "./lib/DocumentHistory.svelte";
	import { CertificateTemplateId, showDocumentHistory, updateDocumentHistory } from "./store";
	
	let error = {};
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
		await updateDocumentHistory();
    });
</script>

<main>
	<h1 class="glow title">Certificate Generator</h1>
	<div class="section-container">
		<div id="form-section" class="section">
			<div>
				<h3 class="section-header">Form</h3>
				<ActiveForm />
			</div>
		</div>
		<div id="document-preview-section" class="section">
			<DocumentPreview />
		</div>
		{#if $showDocumentHistory}
		<div id="document-history-section" class="section" transition:fly={{x: -200, duration: 300}}>
			<h3 class="section-header">Document History</h3>
			<div class="document-history">
				<DocumentHistory />
			</div>
		</div>
		{/if}
	</div>
</main>

<style>
	.document-history {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	#document-history-section {
		height: 75vh;
		width: 58vh;
		min-width: 290px;
	}

	#form-section {
		display: flex;
		justify-content: center;
		width: 58vh;
		min-width: 410px;
	}

	.section {
		height: 75vh;
		width: 90%;
		background-color: rgba(185, 185, 185, 0.163);
		border: 2px solid whitesmoke;
		border-radius: 9px;
		overflow: scroll;
	}

	.section-header {
		margin: 0;
		margin-top:0.5rem;
		margin-left: 0.5rem;
		user-select: none;
	}

	.section-container {
		display: flex;
		gap: 2vh;
		justify-content: start;
		padding-left: 1.5vh;
		padding-right: 1.5vh;
		align-items: center;
		overflow: hidden;
		height: 80vh;
		min-width: 130vh;
		max-width: 90%;
		background-color: rgba(185, 185, 185, 0.163);
		margin: 2vh;
		margin-top: 0;
		border: 3px solid whitesmoke;
		border-radius: 12px;
	}

	.title {
		text-wrap-mode: nowrap;
		margin: 0;
		margin-top: 2vh;
	}
	
	.glow {
		user-select: none;
		will-change: filter;
		transition: filter 300ms;
	}

	.glow:hover {
		filter: drop-shadow(0 0 0.8em #212bede1);
	}
</style>
