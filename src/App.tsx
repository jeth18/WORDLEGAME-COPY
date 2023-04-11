import { useState, type KeyboardEvent, useEffect } from 'react'
import { ILetter } from './interfaces'
import { Grid } from './components/Grid'
import { Keyboard } from './components/Keyboard'
import { useEventListener } from './hooks/useEventListener'
import { useWord } from './hooks/useWord'
import { useOpen } from './hooks/useOpen'
import { WinnerModal } from './components/WinnerModal'
import { SurrenderModal } from './components/SurrenderModal'
import confetti from 'canvas-confetti'
import './App.css'

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
  const [open, toggle] = useOpen(false)
  const [openSurrender, toggleSurrender] = useOpen(false)
  const [win, setWin] = useState(false)
  const [keyboardFind, setKeyBoardFind] = useState<ILetter[]>([])

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
    open && toggle()
  }

  const enter = () => {

    if(positionY > 5) return

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
      toggle()
      confetti()
      setWin(true)
      return
    }

    //verificar letters
    word.split('').forEach((el, index) => {
      if (el === copyGrid[positionY][index].letter) {
        copyGrid[positionY][index] = { letter: el, color: 'green' }
        addLetterKeyBoard(copyGrid[positionY][index].letter, 'green')
      } else if (copyGrid[positionY].some(l => l.letter === el)) {
        const posX = copyGrid[positionY].findIndex(element => element.letter === el)
        if (copyGrid[positionY][posX].color !== 'green') {
          copyGrid[positionY][posX] = { letter: el, color: 'yellow' }
          addLetterKeyBoard(copyGrid[positionY][index].letter, 'yellow')
        }
      } else {
        addLetterKeyBoard(copyGrid[positionY][index].letter, 'red')
      }
    })

    setPoisitionX(0)
    setPoisitionY(prev => prev + 1)
    setIsValidate(true)

    if(positionY === 5 && !win) {
      toggleSurrender()
    }
  }

  const addLetterKeyBoard = (letter: string, color: string) => {
    if(!keyboardFind.some(el => el.letter === letter)) {
      setKeyBoardFind([
        ...keyboardFind,
        {letter: letter, color: color}
      ])
    }
  }

  const surrender = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPoisitionY(6)
    toggleSurrender()
  }

  useEventListener({positionX, positionY, isValidate, handleKeyPress})

  return (
    <div className='container'>
      <section className='container-header'>
        <button onClick={(e) => newGame(e)}>Nuevo juego</button>
        {positionY > 0 && <button onClick={(e) => surrender(e)}>Rendirse</button>}
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
      <Keyboard setLetter={setLetter} deleteB={deleteLetter} enter={enter} keyBoardFind={keyboardFind}/>
      <WinnerModal open={open} word={word} closeToggle={toggle} newGame={newGame}/>
      <SurrenderModal open={openSurrender} word={word} closeToggle={toggleSurrender} />
    </div>
  )
}

export default App
