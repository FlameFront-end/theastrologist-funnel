declare namespace React {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined
  }
}

declare module '*.css' {
  const classes: Record<string, string>
  export default classes
}
