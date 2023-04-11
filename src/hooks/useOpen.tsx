import { useState } from 'react'

export const useOpen = (INITIAL_VALUE: boolean) => {
  const [open, setOpen] = useState(INITIAL_VALUE)
  const toggle = () => setOpen(!open)
  return [open, toggle] as const
}
