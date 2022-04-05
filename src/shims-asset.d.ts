declare module '*.svg' {
  const content: {
    attributes: { [attr: string]: string }
    content: string
  }
  export default content
}
