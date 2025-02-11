<script>
    import Templates from './lib/Templates.svelte';
</script>

<main>
  <h1 class="glow title">Certificate Generator</h1>

  <div class="section-container">
    <div id="template-section" class="section">
      <Templates />
    </div>
    <div class="section">
      
    </div>
    <div class="section">
      
    </div>
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
