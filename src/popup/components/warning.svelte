<script lang="ts">
  export let localize: (field: string) => string
</script>

<div class="warning">
  <p>{localize('warning_message')}</p>
</div>

<style>
  .warning {
    font-size: 12px;
    padding: 10px 12px;
    border: 1px solid currentColor;
    border-radius: 4px;
    margin: -5px 0px 15px;
    background: #fff1f0;
    color: #ff493c;
  }
  .warning p {
    margin: 0;
  }
</style>
