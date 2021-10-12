<script lang="ts">
  import storage from '../../core/storage'
  import Warning from './warning.svelte'
  import Header from './header.svelte'
  import Radio from '@smui/radio'
  import Switch from '@smui/switch'
  import FormField from '@smui/form-field'
  import Chip, { Set, Text, LeadingIcon } from '@smui/chips'
  import MD_PLUGINS from '../../config/md-plugins'
  import i18n from '../i18n'

  let language = chrome.i18n.getUILanguage()
  let local = i18n(language)

  const modes = ['light', 'dark']
  const languages = Object.keys(i18n.localMap)
  let isAllowViewFile = true
  let enable = true
  let refresh = true
  let pageTheme = 'light'
  let selectedMdPlugins = []

  chrome.extension.isAllowedFileSchemeAccess((isAllow) => {
    isAllowViewFile = !!isAllow
  })
  storage.get().then((data) => {
    enable = data.enable === undefined || data.enable
    refresh = data.refresh === undefined || data.refresh
    pageTheme = data.pageTheme || pageTheme
    language = data.language || language
    selectedMdPlugins = data.mdPlugins || [...MD_PLUGINS]
    changeLang(language)
  })

  function changeMode(key, value) {
    setTimeout(() => {
      chrome.runtime.sendMessage({
        value: {
          key,
          value,
        },
        type: 'storage',
      })
    }, 0)
  }
  function changeLang(language) {
    local = i18n(language)
  }
</script>

<main>
  <Header
    href={'https://chrome.google.com/webstore/detail/md-reader/medapdbncneneejhbgcjceippjlfkmkg'}
  />

  {#if !isAllowViewFile} <Warning /> {/if}

  <div class="form-item inline">
    <span class="label-item">{local('label_enable')}:</span>
    <FormField align="end">
      <Switch
        bind:checked={enable}
        color="primary"
        on:change={() => changeMode('enable', enable)}
      />
    </FormField>
  </div>

  <div class="form-item inline">
    <span class="label-item">{local('label_auto-refresh')}:</span>
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
    <div class="label-item">{local('label_md-plugins')}:</div>
    <Set chips={MD_PLUGINS} let:chip bind:selected={selectedMdPlugins} filter>
      <Chip
        {chip}
        title={chip}
        on:click={() => changeMode('mdPlugins', selectedMdPlugins)}
      >
        <LeadingIcon class="material-icons">block</LeadingIcon>
        <Text>{local(chip)}</Text>
      </Chip>
    </Set>
  </div>

  <div class="form-item">
    <div class="label-item">{local('label_theme')}:</div>
    {#each modes as mode}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {local(mode)} </span>
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
    <div class="label-item">{local('label_language')}:</div>
    {#each languages as lang}
      <FormField style="margin-right: 1em;">
        <span slot="label"> {local(lang)} </span>
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
</main>

<style>
  main {
    overflow: auto;
    width: 266px;
    padding: 20px 27px 12px;
    border: 1px solid #24315870;
    border-radius: 1px;
    max-height: 520px;
  }
  .form-item {
    margin-bottom: 6px;
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
