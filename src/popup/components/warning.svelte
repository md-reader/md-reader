<script lang="ts">
  export let locale = {}
  const messageList = Object.keys(locale)
    .map((l) => locale[l].warning_message)
    .filter(Boolean)
</script>

<div class="warning">
  {#each messageList as msg}
    <p>{msg}</p>
  {/each}
</div>

<style>
  .warning {
    font-size: 12px;
    padding: 12px 14px 8px;
    border: 1px solid currentColor;
    border-radius: 4px;
    margin: -5px 0px 15px;
    background: #fff1f0;
    color: #ff493c;
  }
  .warning p {
    margin: 0 0 6px;
    padding: 0;
  }
</style>
