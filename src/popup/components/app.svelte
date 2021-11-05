<script lang="ts">
  import storage from '../../core/storage'
  import Warning from './warning.svelte'
  import Header from './header.svelte'
  import Radio from '@smui/radio'
  import Switch from '@smui/switch'
  import FormField from '@smui/form-field'
  import Select, { Option } from '@smui/select'
  import Chip, { Set, Text, LeadingIcon } from '@smui/chips'
  import MD_PLUGINS from '../../config/md-plugins'
  import { homepage } from '../../../package.json'
  import i18n from '../i18n'

  let language
  let localize = i18n()

  const modes = ['light', 'dark']
  const languageList = Object.keys(i18n.localeJson)
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
    const lang = data.language || chrome.i18n.getUILanguage()
    language = lang in i18n.localeJson ? lang : i18n.DEFAULT_LOCALE
    selectedMdPlugins = data.mdPlugins || [...MD_PLUGINS]
    changeLang(language)
  })

  $: if (language) {
    changeMode('language', language)
    changeLang(language)
  }

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
    localize = i18n(language)
  }
</script>

<main>
  <Header href={homepage} />

  {#if !isAllowViewFile}
    <Warning {localize} />
  {/if}

  <div class="form-item inline">
    <span class="label-item">{localize('label_enable')}:</span>
    <FormField align="end">
      <Switch
        bind:checked={enable}
        color="primary"
        on:change={() => changeMode('enable', enable)}
      />
    </FormField>
  </div>

  <div class="form-item inline">
    <span class="label-item">{localize('label_auto-refresh')}:</span>
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
    <div class="label-item">{localize('label_md-plugins')}:</div>
    <Set
      let:chip
      bind:selected={selectedMdPlugins}
      chips={MD_PLUGINS}
      nonInteractive={!enable}
      filter={enable}
    >
      <Chip
        {chip}
        title={chip}
        on:click={() => enable && changeMode('mdPlugins', selectedMdPlugins)}
      >
        <LeadingIcon class="material-icons">block</LeadingIcon>
        <Text>{localize(chip)}</Text>
      </Chip>
    </Set>
  </div>

  <div class="form-item">
    <div class="label-item">{localize('label_theme')}:</div>
    {#each modes as mode}
      <FormField>
        <span slot="label"> {localize(mode)} </span>
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
    <div class="label-item">{localize('label_language')}:</div>
    <FormField style="padding-left: 10px">
      <Select disabled={!enable} bind:value={language}>
        {#each languageList as lang}
          <Option value={lang}>{localize(lang)}</Option>
        {/each}
      </Select>
    </FormField>
  </div>
</main>

<style>
  main {
    overflow: auto;
    box-sizing: border-box;
    width: 330px;
    max-height: 599px;
    padding: 22px 25px 10px;
    border: 1px solid #24315870;
    border-radius: 1px;
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
