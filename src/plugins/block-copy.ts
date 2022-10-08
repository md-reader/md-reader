import { writeText } from '@/shared'
import className from '@/config/class-name'

export default function BlockCopyPlugin({ event }) {
  // code block copy button event
  event.on('click', async (target: HTMLElement) => {
    if (target.classList.contains(className.COPY_BTN)) {
      const codeEle = target.parentNode.querySelector('code.hljs')
      if (codeEle && !target.classList.contains('copied')) {
        await writeText(codeEle.textContent)
        target.classList.add('copied')
        setTimeout(() => target.classList.remove('copied'), 1000)
      }
    }
  })
}
