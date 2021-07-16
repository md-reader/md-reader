<script>
  import logo from '../../images/icon48.png'
  export let href
</script>

<h1>
  <a {href} target="__blank">
    <img src={logo} alt="" />
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
    color: #243158e3;
  }
  h1 a:hover {
    text-decoration: underline;
  }
  h1 img {
    display: inline-block;
    width: 21px;
    height: 21px;
    margin-right: 6px;
  }
</style>
