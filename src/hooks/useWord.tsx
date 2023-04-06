import { useEffect, useState } from 'react'
import { words } from '../constants.d'
import { IUseWord } from '../interfaces'

const getWord = (length: number): string => {
  const wordsFilter = words.filter((el) => el.length === length)
  const randomIndex = Math.floor(Math.random() * wordsFilter.length)
  return wordsFilter[randomIndex]
}

export const useWord = (lenghtWord = 5) => {
  const [word, setWord] = useState(getWord(lenghtWord).toUpperCase())
  const [lengthw, setLengthWord] = useState(lenghtWord)

  const searchWord = ():void => {
    const w = getWord(lengthw)
    setWord(w.toUpperCase())
  }

  const updateLengthWord = (n: number) => {
    if (lengthw !== n) {
      setLengthWord(n)   
    }
  }

  useEffect(() => {
    searchWord()
  }, [lengthw])

  return { word, lengthw, searchWord, updateLengthWord} as IUseWord
}
