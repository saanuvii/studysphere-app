import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Defer the initial state update to avoid synchronous state changes during render
    const timeoutId = setTimeout(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }, 0)

    mql.addEventListener("change", onChange)
    return () => {
      clearTimeout(timeoutId)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
