import {useRef, useEffect} from 'react'

export default function useEventListener(
  eventName: string,
  handler: (event: any) => void,
  element: any = window
) {
  const savedHandler = useRef<(event: any) => void>()

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: any) => {
      if (savedHandler.current) {
        savedHandler.current(event)
      }
    }

    element.addEventListener(eventName, eventListener)
    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}