<script>
	import ActiveForm from "./lib/ActiveForm.svelte";
    import DocumentPreview from "./lib/DocumentPreview.svelte";
	import Templates from "./lib/Templates.svelte";
	import { generatedPDF, selectedTemplateId } from "./store";
</script>

<main>
	<h1 class="glow title">Certificate Generator</h1>

	<div class="section-container">
		<div id="template-section" class="section">
			<div>
				<h3 style="margin-top:0.5rem; margin-left: 0.5rem; user-select: none;"> Templates </h3>
				<Templates />
			</div>
		</div>
		{#if $selectedTemplateId !== null}
			<div id="form-section" class="section">
				<div>
					<h3 style="margin: 0; margin-top:0.5rem; margin-left: 0.5rem; user-select: none;">Form</h3>
					<ActiveForm />
				</div>
			</div>
		{/if}
		{#if $selectedTemplateId !== null && $generatedPDF !== null }
			<div id="document-preview-section" class="section">
				<DocumentPreview />
			</div>
		{/if}
	</div>
</main>

<style>
	#template-section {
		display: flex;
		justify-content: center;
		width: 50vh;
	}

	.section {
		height: 75vh;
		width: 90%;
		background-color: rgba(185, 185, 185, 0.163);
		border: 2px solid whitesmoke;
		border-radius: 9px;
		overflow: scroll;
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
