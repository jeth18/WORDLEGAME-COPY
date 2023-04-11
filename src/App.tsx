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
  const GRID_INITIAL_VALUE = Array.from({ length: 6 }, () => Array(lengthw).fill(INITIAL_VALUE))
  const [grid, setGrid] = useState<ILetter[][]>(GRID_INITIAL_VALUE)
  const [position, setPosition] = useState({ x: 0, y: 0})
  const [open, toggle] = useOpen(false)
  const [openSurrender, toggleSurrender] = useOpen(false)
  const [win, setWin] = useState(false)
  const [keyboardFind, setKeyBoardFind] = useState<ILetter[]>([])

  useEffect(() => {
    setGrid(GRID_INITIAL_VALUE)
    setPosition({ x: 0, y: 0})
  }, [lengthw])


  const handleKeyPress = (event: unknown): void => {
    const evt = event as KeyboardEvent
    evt.preventDefault()

    if (position.y > 6) return

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
    if(position.y > 5) return
    
    const gridCopy = [...grid]
    gridCopy[position.y][position.x] = { letter: l.toUpperCase(), color: 'none' }
    setGrid(gridCopy)
    
    if (position.x < lengthw - 1) setPosition({ x: position.x + 1, y: position.y }) 
  }

  const deleteLetter = () => {
    if (position.x === 0) return

    const gridCopy = [...grid]
    const currentLetter = gridCopy[position.y][position.x].letter

    if (currentLetter !== '') {
      gridCopy[position.y][position.x].letter = ''
    } else {
      setPosition((prev) => ({ ...prev, x: prev.x - 1 }))
      gridCopy[position.y][position.x - 1].letter = ''
    }

    setGrid(gridCopy)
  }
  
  const newGame = (e: unknown) => {
    const evt = e as Event
    evt.preventDefault()

    setGrid(GRID_INITIAL_VALUE)
    setPosition({ x: 0, y: 0})
    setKeyBoardFind([])
    searchWord()
    open && toggle()
  }

  const enter = () => {

    if(position.y > 5) return

    const gridRowWord = grid[position.y].map(el => el.letter).join('')
    const copyGrid = [...grid]

    if (gridRowWord.length < lengthw) {
      alert('Error la palabra es muy corta')
      return
    }

    //correct word
    if (word.normalize('NFD').replace(/[\u0300-\u036f]/g,'') === gridRowWord) {
      for (let i = 0; i < lengthw; i++) {
        copyGrid[position.y][i] = { letter: copyGrid[position.y][i].letter, color: 'green' }
      }
      setGrid(copyGrid)
      setPosition({ x: position.x, y: 6})
      toggle()
      confetti()
      setWin(true)
      return
    }

    //verificar letters
    word.split('').forEach((el, index) => {
      el = el.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      if (el === copyGrid[position.y][index].letter) {
        copyGrid[position.y][index] = { letter: el, color: 'green' }
        addLetterKeyBoard(copyGrid[position.y][index].letter, 'green')
      } else if (copyGrid[position.y].some(l => l.letter === el)) {
        const posX = copyGrid[position.y].findIndex(element => element.letter === el)
        if (copyGrid[position.y][posX].color !== 'green') {
          copyGrid[position.y][posX] = { letter: el, color: 'yellow' }
          addLetterKeyBoard(copyGrid[position.y][index].letter, 'yellow')
        }
      } else {
        addLetterKeyBoard(copyGrid[position.y][index].letter, 'red')
      }
    })

    setPosition({ x: 0, y: position.y + 1 })

    if(position.y === 5 && !win) toggleSurrender()
    
  }

  const addLetterKeyBoard = (letter: string, color: string) => {
    if(!keyboardFind.some(el => el.letter === letter)) {
      setKeyBoardFind((prev) => [
        ...prev,
        {letter: letter, color: color}
      ])
    }
  }

  const surrender = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPosition({x: position.x, y: 6})
    toggleSurrender()
  }

  useEventListener({position, handleKeyPress})

  return (
    <div className='container'>
      <section className='container-header'>
        <button onClick={(e) => newGame(e)}>Nuevo juego</button>
        {position.y > 0 && <button onClick={(e) => surrender(e)}>Rendirse</button>}
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
