<script>
  export let svg
  let className
  export { className as class }
</script>

<svg {...svg.attributes} class={className}>
  {@html svg.content}
</svg>

<style>
  svg {
    display: inline-block;
    fill: currentColor;
  }
</style>
