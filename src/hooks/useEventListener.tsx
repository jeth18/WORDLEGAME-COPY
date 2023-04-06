import { useEffect, useState } from 'react'

interface IUseEventListener {
  positionX: number,
  positionY: number,
  isValidate: boolean,
  handleKeyPress: (event: unknown) => void
}

export const useEventListener = ({ positionX, positionY, isValidate, handleKeyPress }: IUseEventListener) => {
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
  }, [positionX, positionY, isValidate, handleKeyPress])

  return event

}
