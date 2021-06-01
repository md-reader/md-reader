<script>
  import Radio from '@smui/radio'
  import Switch from '@smui/switch'
  import Button from '@smui/button'
  import FormField from '@smui/form-field'

  let enable = true
  let pageTheme = 'Light'
  let codeTheme = 'Dark'
  const modes = ['Light', 'Dark']

</script>

<div>
  <div class="form-item">
    <span class="label-item">Enable:</span>
    <FormField align="end">
      <Switch bind:checked={enable} color="primary" />
    </FormField>
  </div>

  <div class="form-item">
    <div class="label-item">Theme:</div>
    {#each modes as mode}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {mode} </span>
        <Radio bind:group={pageTheme} bind:value={mode} />
      </FormField>
    {/each}
  </div>

  <div class="form-item">
    <div class="label-item">Code theme:</div>
    {#each modes as mode}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {mode} </span>
        <Radio bind:group={codeTheme} bind:value={mode} />
      </FormField>
    {/each}
  </div>

  <div class="form-item">
    <FormField>
      <Button color="primary" variant="unelevated">Done</Button>
    </FormField>
  </div>
</div>

<style>
  .form-item {
    margin-top: 15px;
  }
  .label-item {
    font-weight: bolder;
    font-size: 13px;
    color: #243158e3;
  }

</style>
