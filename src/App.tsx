import { useEffect, useState, type KeyboardEvent } from 'react'
import './App.css'

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

    if(positionY === 6) return
    
    const gridCopy = [...grid]
    gridCopy[positionY][positionX].letter = l.toUpperCase()
    setGrid(gridCopy)
    
    if(positionX < 4) setPoisitionX(prev => prev + 1)

    if(positionX === 4 && isValidate) {
      setPoisitionX(0)
      setPoisitionY(prev => prev + 1)
      setIsValidate(false)
    }
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
      {
        grid.map((el, i) => {
          return (
            <div key={i} className='container-letters' >
              {el.map((l, index) => 
                <div key={index} className='letters'>{l.letter}</div>
              )}
            </div>
          )
        })
      }

      <section>
        <button onClick={() => setLetter('A')}>A</button>
      </section>
    </div>
  )
}

export default App
