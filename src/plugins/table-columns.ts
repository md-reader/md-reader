import throttle from 'lodash.throttle'

// Shrinks the columns of a table that overflows its box: each cell's minimum
// width becomes the smaller of the theme's 10rem and the column's one-line
// width, so short columns stop padding out to 10rem. Tables that fit keep
// the theme's layout.
function fitTables(content: HTMLElement) {
  content.querySelectorAll('table').forEach(table => {
    const cells = [...table.querySelectorAll('td, th')] as HTMLElement[]
    cells.forEach(cell => (cell.style.minWidth = ''))
    if (table.scrollWidth <= table.clientWidth) return
    const rows = [...table.rows]
    cells.forEach(cell => (cell.style.minWidth = '0'))
    table.style.whiteSpace = 'nowrap'
    const widths = rows.map(row =>
      [...row.cells].map(cell => cell.getBoundingClientRect().width),
    )
    table.style.whiteSpace = ''
    rows.forEach(row =>
      [...row.cells].forEach((cell, i) => {
        const natural = Math.max(...widths.map(w => w[i] ?? 0))
        cell.style.minWidth = `min(10rem, ${Math.ceil(natural)}px)`
      }),
    )
  })
}

export default function TableColumnsPlugin({ event }) {
  let content: HTMLElement
  event.on('contentRendered', (rendered: HTMLElement) => {
    content = rendered
    // The content is attached to the document and laid out after this event.
    requestAnimationFrame(() => fitTables(content))
  })
  window.addEventListener(
    'resize',
    throttle(() => content && fitTables(content), 100),
  )
}
