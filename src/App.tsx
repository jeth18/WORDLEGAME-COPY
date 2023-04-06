import { useState, type KeyboardEvent, useEffect } from 'react'
import './App.css'
import { ILetter } from './interfaces'
import { Grid } from './components/Grid'
import { Keyboard } from './components/Keyboard'
import { useEventListener } from './hooks/useEventListener'
import { useWord } from './hooks/useWord'

const INITIAL_VALUE: ILetter = {
  letter: '',
  color: 'none'
}

function App() {

  const { word, lengthw, searchWord, updateLengthWord } = useWord()

  const GRID_INITIAL_VALUE: ILetter[][] = [
    Array(lengthw).fill(INITIAL_VALUE),
    Array(lengthw).fill(INITIAL_VALUE),
    Array(lengthw).fill(INITIAL_VALUE),
    Array(lengthw).fill(INITIAL_VALUE),
    Array(lengthw).fill(INITIAL_VALUE),
    Array(lengthw).fill(INITIAL_VALUE),
  ]

  const [grid, setGrid] = useState<ILetter[][]>(GRID_INITIAL_VALUE)
  const [positionX, setPoisitionX] = useState(0)
  const [positionY, setPoisitionY] = useState(0)
  const [isValidate, setIsValidate] = useState(false)

  useEffect(() => {
    setGrid(GRID_INITIAL_VALUE)
    setPoisitionX(0)
    setPoisitionY(0)
    setIsValidate(false)
  }, [lengthw])


  const handleKeyPress = (event: unknown): void => {
    
    const evt = event as KeyboardEvent
    evt.preventDefault()

    if (positionY > 6) return

    if (evt.key === 'Enter') {
      enter()
    }

    if (evt.key === 'Backspace') {
      deleteLetter()
    }

    if (evt.keyCode >= 65 && evt.keyCode <= 90) {
      setLetter(evt.key)
    }
  }

  const setLetter = (l: string):void => {

    if(positionY > 5) return
    
    const gridCopy = [...grid]
    gridCopy[positionY][positionX] = { letter: l.toUpperCase(), color: 'none' }
    setGrid(gridCopy)
    
    if(positionX < lengthw - 1)  setPoisitionX(prev => prev + 1) 
  }

  const deleteLetter = () => {

    if(positionX === 0) return
    const gridCopy = [...grid]
    
    if(grid[positionY][positionX].letter !== '') {
      gridCopy[positionY][positionX].letter = ''
      setGrid(gridCopy)
    } else {
      setPoisitionX(prev => prev - 1)
      gridCopy[positionY][positionX - 1].letter = ''
      setGrid(gridCopy)
    }

  }
  
  const newGame = (e: unknown) => {
    const evt = e as Event
    evt.preventDefault()

    setGrid(GRID_INITIAL_VALUE)
    setPoisitionX(0)
    setPoisitionY(0)
    setIsValidate(false)
    searchWord()
  }

  const enter = () => {
    const gridRowWord = grid[positionY].map(el => el.letter).join('')
    const copyGrid = [...grid]

    if (gridRowWord.length < lengthw) {
      alert('Error la palabra es muy corta')
      return
    }

    //correct word
    if (word === gridRowWord) {
      for (let i = 0; i < lengthw; i++) {
        copyGrid[positionY][i] = { letter: copyGrid[positionY][i].letter, color: 'green' }
      }
      setGrid(copyGrid)
      setPoisitionY(6)
      setIsValidate(false)
      return
    }

    //verificar letters
    word.split('').forEach((el, index) => {
      if (el === copyGrid[positionY][index].letter) {
        copyGrid[positionY][index] = { letter: el, color: 'green' }
      } else if (copyGrid[positionY].some(l => l.letter === el)) {
        const posX = copyGrid[positionY].findIndex(element => element.letter === el)
        if (copyGrid[positionY][posX].color !== 'green') {
          copyGrid[positionY][posX] = { letter: el, color: 'yellow' }
        }
      }
    })

    setPoisitionX(0)
    setPoisitionY(prev => prev + 1)
    setIsValidate(true)
  }

  useEventListener({positionX, positionY, isValidate, handleKeyPress})

  return (
    <div className='container'>
      <section className='container-header'>
        <button onClick={(e) => newGame(e)}>Nuevo juego</button>
        <select value={lengthw} 
          onChange={(e) => {
            updateLengthWord(Number(e.target.value))
          }
        }>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </section>
      <Grid grid={grid}/>
      <Keyboard setLetter={setLetter} deleteB={deleteLetter} enter={enter}/>
    </div>
  )
}

export default App
