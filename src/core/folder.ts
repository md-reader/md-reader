import className from '@/config/class-name'

const MARKDOWN_EXTENSIONS = new Set([
  'md',
  'mdx',
  'mdc',
  'mkd',
  'markdown',
  'txt',
])

export interface FolderEntry {
  name: string
  url: string
  isDirectory: boolean
  modifiedTime?: number
}

interface FetchUrlResponse {
  ok: boolean
  text?: string
  error?: string
}

interface FolderBrowserOptions {
  container: HTMLElement
  rootURL: string
  currentURL?: string
  initialHTML?: string
}

export function isLocalDirectoryPage(
  url: string = window.location.href,
  contentType: string = document.contentType,
): boolean {
  const parsed = new URL(url)
  return (
    parsed.protocol === 'file:' &&
    parsed.pathname.endsWith('/') &&
    contentType === 'text/html'
  )
}

export function getParentDirectoryURL(url: string): string {
  return new URL('./', url).href
}

export function getDirectoryName(url: string): string {
  const pathname = new URL(url).pathname.replace(/\/$/, '')
  const encodedName = pathname.split('/').pop()
  if (!encodedName) return '/'
  try {
    return decodeURIComponent(encodedName)
  } catch {
    return encodedName
  }
}

export function parseDirectoryEntries(
  html: string,
  directoryURL: string,
): FolderEntry[] {
  const base = new URL(directoryURL)
  const basePath = base.pathname.endsWith('/')
    ? base.pathname
    : `${base.pathname}/`
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const seen = new Map<string, FolderEntry>()
  const entries: FolderEntry[] = []

  const addEntry = (
    href: string,
    directoryHint?: boolean,
    nameHint?: string,
    modifiedTimeHint?: number,
  ) => {
    let target: URL
    try {
      target = new URL(href, base)
    } catch {
      return
    }

    target.hash = ''
    target.search = ''
    if (directoryHint && !target.pathname.endsWith('/')) {
      target.pathname += '/'
    }
    if (target.protocol !== 'file:' || !target.pathname.startsWith(basePath)) {
      return
    }

    const relativePath = target.pathname.slice(basePath.length)
    const isDirectory = target.pathname.endsWith('/')
    const comparablePath = isDirectory
      ? relativePath.slice(0, -1)
      : relativePath
    if (!comparablePath || comparablePath.includes('/')) return
    if (!isDirectory && !isMarkdownFile(comparablePath)) return
    const knownEntry = seen.get(target.href)
    if (knownEntry) {
      if (
        knownEntry.modifiedTime === undefined &&
        Number.isFinite(modifiedTimeHint)
      ) {
        knownEntry.modifiedTime = modifiedTimeHint
      }
      return
    }

    const name = nameHint ? decodeName(nameHint) : decodeName(comparablePath)
    if (isDirectory && (name.startsWith('.') || name === 'node_modules')) {
      return
    }

    const entry = {
      name,
      url: target.href,
      isDirectory,
      modifiedTime: Number.isFinite(modifiedTimeHint)
        ? modifiedTimeHint
        : undefined,
    }
    seen.set(target.href, entry)
    entries.push(entry)
  }

  parsed.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(anchor => {
    const cells = anchor
      .closest('tr')
      ?.querySelectorAll<HTMLTableCellElement>('td')
    const modifiedTime = Number(cells?.[2]?.dataset.value)
    addEntry(
      anchor.getAttribute('href'),
      undefined,
      undefined,
      Number.isFinite(modifiedTime) ? modifiedTime : undefined,
    )
  })

  // Chrome returns directory listings fetched in a service worker as source
  // containing addRow(...) calls. DOMParser does not execute those scripts, so
  // parse their JSON string arguments explicitly instead of evaluating script.
  const addRowPattern =
    /addRow\(("(?:\\.|[^"\\])*"),\s*("(?:\\.|[^"\\])*"),\s*([01]),\s*(?:-?\d+(?:\.\d+)?|null),\s*(?:"(?:\\.|[^"\\])*")\s*,\s*(-?\d+(?:\.\d+)?|null),\s*(?:"(?:\\.|[^"\\])*")\s*\);?/g
  for (const match of html.matchAll(addRowPattern)) {
    try {
      const modifiedTime = match[4] === 'null' ? undefined : Number(match[4])
      addEntry(
        JSON.parse(match[2]),
        match[3] === '1',
        JSON.parse(match[1]),
        Number.isFinite(modifiedTime) ? modifiedTime : undefined,
      )
    } catch {
      // Ignore malformed browser-generated rows.
    }
  }

  return entries.sort((left, right) => {
    if (left.isDirectory !== right.isDirectory) {
      return left.isDirectory ? -1 : 1
    }
    const modifiedDiff =
      (right.modifiedTime ?? Number.NEGATIVE_INFINITY) -
      (left.modifiedTime ?? Number.NEGATIVE_INFINITY)
    if (modifiedDiff) return modifiedDiff
    return right.name.localeCompare(left.name, 'zh-CN', { numeric: true })
  })
}

export async function renderFolderBrowser({
  container,
  rootURL,
  currentURL,
  initialHTML,
}: FolderBrowserOptions): Promise<void> {
  container.replaceChildren()

  const header = document.createElement('div')
  header.className = className.FOLDER_HEADER

  const rootLink = document.createElement('a')
  rootLink.href = rootURL
  rootLink.className = className.FOLDER_ROOT
  rootLink.title = rootURL
  rootLink.textContent = `📁 ${getDirectoryName(rootURL)}`

  const parentLink = document.createElement('a')
  parentLink.href = new URL('../', rootURL).href
  parentLink.className = className.FOLDER_PARENT
  parentLink.title = '打开上级文件夹'
  parentLink.textContent = '上级'

  header.append(rootLink, parentLink)

  const tree = document.createElement('ul')
  tree.className = className.FOLDER_TREE
  const status = document.createElement('div')
  status.className = className.FOLDER_STATUS
  status.textContent = '正在读取文件夹…'
  container.append(header, status, tree)

  try {
    const html = initialHTML ?? (await fetchLocalText(rootURL))
    const entries = parseDirectoryEntries(html, rootURL)
    status.remove()
    renderEntries(tree, entries, currentURL)
    if (!entries.length) {
      status.textContent = '没有 Markdown 文件'
      container.insertBefore(status, tree)
    }
  } catch (error) {
    status.classList.add(className.FOLDER_STATUS_ERROR)
    status.textContent = `目录读取失败：${error.message || error}`
  }
}

function renderEntries(
  list: HTMLUListElement,
  entries: FolderEntry[],
  currentURL?: string,
) {
  for (const entry of entries) {
    const item = document.createElement('li')

    if (entry.isDirectory) {
      const details = document.createElement('details')
      const summary = document.createElement('summary')
      summary.textContent = entry.name
      summary.title = entry.url
      const children = document.createElement('ul')
      details.append(summary, children)
      details.addEventListener(
        'toggle',
        async () => {
          if (!details.open) return
          summary.classList.add(className.FOLDER_LOADING)
          try {
            const html = await fetchLocalText(entry.url)
            const childEntries = parseDirectoryEntries(html, entry.url)
            renderEntries(children, childEntries, currentURL)
            if (!childEntries.length) {
              const empty = document.createElement('li')
              empty.className = className.FOLDER_EMPTY
              empty.textContent = '没有 Markdown 文件'
              children.append(empty)
            }
          } catch (error) {
            const failed = document.createElement('li')
            failed.className = className.FOLDER_STATUS_ERROR
            failed.textContent = '读取失败'
            children.append(failed)
          } finally {
            summary.classList.remove(className.FOLDER_LOADING)
          }
        },
        { once: true },
      )
      item.append(details)
    } else {
      const link = document.createElement('a')
      link.href = entry.url
      link.title = entry.name
      link.textContent = entry.name
      if (sameFileURL(entry.url, currentURL)) {
        link.classList.add(className.FOLDER_FILE_ACTIVE)
      }
      item.append(link)
    }

    list.append(item)
  }
}

function fetchLocalText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: 'fetchUrl', data: { url } },
      (response: FetchUrlResponse) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        if (!response?.ok) {
          reject(new Error(response?.error || '无法读取本地文件夹'))
          return
        }
        resolve(response.text || '')
      },
    )
  })
}

function isMarkdownFile(path: string): boolean {
  const extension = path.split('.').pop()?.toLowerCase()
  return MARKDOWN_EXTENSIONS.has(extension)
}

function decodeName(name: string): string {
  try {
    return decodeURIComponent(name)
  } catch {
    return name
  }
}

function sameFileURL(left: string, right?: string): boolean {
  if (!right) return false
  const normalized = (url: string) => {
    const parsed = new URL(url)
    parsed.hash = ''
    parsed.search = ''
    return parsed.href
  }
  return normalized(left) === normalized(right)
}
