<script>
  import storage from '../core/storage'
  import { onMount } from 'svelte'
  import Radio from '@smui/radio'
  import Switch from '@smui/switch'
  import FormField from '@smui/form-field'
  import logo from '../images/icon48.png'

  const modes = ['Light', 'Dark']
  let isAllowFile = true
  let enable = false
  let pageTheme = 'Light'
  let codeTheme = 'Dark'

  onMount(() => {
    chrome.extension.isAllowedFileSchemeAccess((isAllow) => {
      isAllowFile = !!isAllow
    })
    storage.get().then((data) => {
      enable = data.enable === undefined || data.enable
      pageTheme = data.pageTheme || pageTheme
      codeTheme = data.codeTheme || codeTheme
    })
  })

  function changeMode(type, mode) {
    console.log(type, mode)
    chrome.runtime.sendMessage({
      type,
      value: mode,
    })
  }

</script>

<main>
  <h1>
    <a
      href="https://chrome.google.com/webstore/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg"
      target="__blank"
    >
      <img src={logo} alt="" />
      MD-READER
    </a>
  </h1>
  <div class="form-item">
    <span class="label-item">Enable:</span>
    <FormField align="end">
      <Switch
        bind:checked={enable}
        color="primary"
        on:change={() => changeMode('enable', enable)}
      />
    </FormField>
  </div>

  <div class="form-item">
    <div class="label-item">Theme:</div>
    {#each modes as mode}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {mode} </span>
        <Radio
          bind:group={pageTheme}
          bind:value={mode}
          on:change={() => changeMode('pageTheme', mode)}
        />
      </FormField>
    {/each}
  </div>

  <div class="form-item">
    <div class="label-item">Code theme:</div>
    {#each modes as mode}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {mode} </span>
        <Radio
          bind:group={codeTheme}
          bind:value={mode}
          on:change={() => changeMode('codeTheme', mode)}
        />
      </FormField>
    {/each}
  </div>

  {#if !isAllowFile}
    <p class="tip">
      请在 ”扩展程序“ -> “md-reader” -> “详细信息” 中开启 “允许访问文件网址”
      权限。
      <br />
      Open details page of "md-reader" extension, open "allow access to file URLs"
      option.
    </p>
  {/if}
</main>

<style>
  main {
    padding: 10px 26px 15px;
    border: 1px solid #24315870;
    border-radius: 1px;
  }
  h1 {
    padding: 8px 0 5px;
    margin: 0;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
  h1 a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #243158e3;
  }
  h1 a:hover {
    text-decoration: underline;
  }
  h1 img {
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-right: 5px;
  }
  .form-item {
    margin-top: 15px;
    white-space: nowrap;
  }
  .label-item {
    font-weight: bolder;
    font-size: 13px;
    color: #243158e3;
  }
  .tip {
    font-size: 12px;
    padding-top: 12px;
    border-top: 1px solid #e3e3e3;
    color: #ff3324;
  }

</style>
