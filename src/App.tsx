import { useEffect, useState, type KeyboardEvent } from 'react'
import './App.css'
import { keyboardsLetters } from './constants.d'

interface ILetter {
  letter: string,
  color: string
}

const INITIAL_VALUE: ILetter = {
  letter: '',
  color: 'none'
}

function App() {

  const [word, setWord] = useState('NUEVO')
  const [grid, setGrid] = useState<ILetter[][]>(() => [
    Array(5).fill(INITIAL_VALUE),
    Array(5).fill(INITIAL_VALUE),
    Array(5).fill(INITIAL_VALUE),
    Array(5).fill(INITIAL_VALUE),
    Array(5).fill(INITIAL_VALUE),
    Array(5).fill(INITIAL_VALUE),
  ])

  const [positionX, setPoisitionX] = useState(0)
  const [positionY, setPoisitionY] = useState(0)
  const [isValidate, setIsValidate] = useState(false)

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [positionX, positionY, isValidate])

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {

    if (event.key === 'Enter') {
      //validate
      const gridRowWord = grid[positionY].map(el => el.letter).join('')
      const copyGrid = [...grid]

      if(gridRowWord.length < 4) {
        alert('Error la palabra es muy corta')
        return
      }

      //correct word
      if(word === gridRowWord) {
        for(let i = 0; i < 5; i++){
          copyGrid[positionY][i] = { letter: copyGrid[positionY][i].letter, color: 'green'}
        }
        setGrid(copyGrid)
        setPoisitionY(6)
        setIsValidate(false)
        return
      }

      //verificar letters
      word.split('').forEach((el, index) => {
        if(el === copyGrid[positionY][index].letter) {
          copyGrid[positionY][index] = { letter: el, color: 'green'}
        } else if(copyGrid[positionY].some(l => l.letter === el)) {
          const posX = copyGrid[positionY].findIndex(element => element.letter === el)
          copyGrid[positionY][posX] = { letter: el, color: 'yellow' }
        }
      })



      setPoisitionX(0)
      setPoisitionY(prev => prev + 1)
      setIsValidate(true)
    }

    if (event.key === 'Backspace') {
      deleteLetter()
    }

    if (event.keyCode >= 65 && event.keyCode <= 90) {
      setLetter(event.key)
    }
  }

  const setLetter = (l: string) => {

    if(positionY > 5) return
    
    const gridCopy = [...grid]
    gridCopy[positionY][positionX] = { letter: l.toUpperCase(), color: 'none'}
    setGrid(gridCopy)
    
    if(positionX < 4) setPoisitionX(prev => prev + 1)
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
    
  return (
    <div className='container'>
      <section className='grid'>
        {
          grid.map((el, i) => {
            return (
              <div key={i} className='container-letters' >
                {el.map((l, index) => 
                  <div key={index} className={`letters ${l.color}`}>{l.letter}</div>
                )}
              </div>
            )
          })
        }
        
      </section>
      <section className='container-alphabet'>
        {
          keyboardsLetters.map((letter, index) => 
            <button key={index} onClick={() => setLetter(letter)}>{letter}</button>
          )
        }
      </section>
    </div>
  )
}

export default App
