<script>
    export let checked = false;
    export let label = "Toggle"
    let width = "200px";
    let height = "100px";
    export let objScale = 0.6;
</script>

<div style="display: flex; flex-direction: column; align-items: center; width: fit-content;">
    <input type="checkbox" id="switch" bind:checked />
    <label for="switch" style="width: {width}; height: {height}; transform: scale({objScale});">{label}</label>
    <p style="user-select: none; margin: 0; text-align: center;">Auto refresh: {checked ? "ON" : "OFF"}</p>
</div>

<style>
    input[type=checkbox] {
      height: 0;
      width: 0;
      visibility: hidden;
      transform: translate(2rem, 2rem);
    }
  
    label {
        border: 4px solid #942bf0;
        cursor: pointer;
        text-indent: -9999px;
        background: #6c18e2;
        display: block;
        border-radius: 100px;
        position: relative;
    }
  
    label:after {
        content: '';
        position: absolute;
        top: 5px;
        left: 5px;
        width: 90px;
        height: 90px;
        background: #fff;
        border-radius: 90px;
        transition: 0.3s;
    }
  
    input:checked + label {
        background: #942bf0;
    }
  
    input:checked + label:after {
        left: calc(100% - 5px);
        transform: translateX(-100%);
    }
  
    label:active:after {
        width: 130px;
    }
</style>