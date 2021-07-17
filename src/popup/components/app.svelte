<script>
  import storage from '../../core/storage'
  import Warning from './warning.svelte'
  import Header from './header.svelte'
  import Radio from '@smui/radio'
  import Switch from '@smui/switch'
  import FormField from '@smui/form-field'
  import i18n from '../i18n'

  let language = chrome.i18n.getUILanguage()
  let getLocal = i18n(language)

  const modes = ['light', 'dark']
  const languages = Object.keys(i18n.localMap)
  let isAllowViewFile = true
  let enable = true
  let refresh = true
  let pageTheme = 'light'

  chrome.extension.isAllowedFileSchemeAccess((isAllow) => {
    isAllowViewFile = !!isAllow
  })
  storage.get().then((data) => {
    enable = data.enable === undefined || data.enable
    refresh = data.refresh === undefined || data.refresh
    pageTheme = data.pageTheme || pageTheme
    language = data.language || language
    changeLang(language)
  })

  function changeMode(key, value) {
    chrome.runtime.sendMessage({
      value: {
        key,
        value,
      },
      type: 'storage',
    })
  }
  function changeLang(language) {
    getLocal = i18n(language)
  }
</script>

<main>
  <Header
    href={'https://chrome.google.com/webstore/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg'}
  />

  <div class="form-item inline">
    <span class="label-item">{getLocal('label_enable')}:</span>
    <FormField align="end">
      <Switch
        bind:checked={enable}
        color="primary"
        on:change={() => changeMode('enable', enable)}
      />
    </FormField>
  </div>

  <div class="form-item inline">
    <span class="label-item">{getLocal('label_auto-refresh')}:</span>
    <FormField align="end">
      <Switch
        disabled={!enable}
        bind:checked={refresh}
        color="primary"
        on:change={() => changeMode('refresh', refresh)}
      />
    </FormField>
  </div>

  <div class="form-item">
    <div class="label-item">{getLocal('label_theme')}:</div>
    {#each modes as mode}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {getLocal(mode)} </span>
        <Radio
          disabled={!enable}
          bind:group={pageTheme}
          bind:value={mode}
          on:change={() => changeMode('pageTheme', mode)}
        />
      </FormField>
    {/each}
  </div>

  <div class="form-item">
    <div class="label-item">{getLocal('label_language')}:</div>
    {#each languages as lang}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {getLocal(lang)} </span>
        <Radio
          disabled={!enable}
          bind:group={language}
          bind:value={lang}
          on:change={() => (
            changeMode('language', language), changeLang(language)
          )}
        />
      </FormField>
    {/each}
  </div>

  {#if !isAllowViewFile} <Warning /> {/if}
</main>

<style>
  main {
    padding: 20px 27px 12px;
    border: 1px solid #24315870;
    border-radius: 1px;
  }
  .form-item {
    margin-bottom: 6px;
    white-space: nowrap;
  }
  .form-item.inline {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .label-item {
    font-weight: bolder;
    font-size: 13px;
    color: #243158e3;
  }
</style>
