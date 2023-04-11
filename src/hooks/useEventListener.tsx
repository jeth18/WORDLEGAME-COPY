import { useEffect, useState } from 'react'

interface IUseEventListener {
  position: object,
  isValidate?: boolean,
  handleKeyPress: (event: unknown) => void
}

export const useEventListener = ({ position, handleKeyPress }: IUseEventListener) => {
  const [event, setEvent] = useState<unknown>(null)

  useEffect(() => {

    const listener = (event: unknown) => {
      setEvent(event)
      handleKeyPress(event)
    }

    document.addEventListener('keydown', listener)

    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [position, handleKeyPress])

  return event

}
