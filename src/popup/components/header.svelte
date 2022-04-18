<script>
  import Icon from './icon.svelte'
  import logoIcon from '../../images/logo.svg'
  export let homepage
</script>

<h1>
  <Icon class="icon-logo" svg={logoIcon} />
  <a href={homepage} target="__blank">MD-READER</a>
</h1>

<style>
  h1 {
    display: flex;
    align-items: center;
    padding: 0 0 22px;
    margin: 0;
    font-size: 18px;
    color: #35363a;
  }
  h1 a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    color: currentColor;
  }
  h1 a:hover {
    text-decoration: underline;
  }
  h1 :global(.icon-logo) {
    width: 22px;
    height: 22px;
    margin-right: 6px;
  }
</style>
