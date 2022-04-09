<script>
  import logo from '../../images/logo.svg'
  export let href
</script>

<h1>
  <a {href} target="__blank">
    <svg id="md-reader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
      {@html logo.content}
    </svg>
    MD-READER
  </a>
</h1>

<style>
  h1 {
    display: flex;
    align-items: center;
    padding: 0 0 22px;
    margin: 0;
    font-size: 18px;
  }
  h1 a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    color: #35363a;
  }
  h1 a:hover {
    text-decoration: underline;
  }
  h1 svg {
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 6px;
    fill: #35363a;
  }
</style>
