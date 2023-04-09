import { keyboard } from '../constants.d'
import { IKeyboard } from '../interfaces'

export const Keyboard = ({ setLetter, deleteB, enter}: IKeyboard) => {
  return (
      <section className='container-alphabet'>
        {
        keyboard.map((row, index) => 
            <div key={index} className='row-alphabet'>
              { row.map((letter,i) => {

                if(letter === '<') {
                  return (
                    <button key={i}
                      className='action'
                      onClick={deleteB}
                    >
                      {letter.toUpperCase()} 
                    </button>
                  )
                }

                if(letter === 'enter') {
                  return (
                    <button key={i}
                      className='action'
                      onClick={enter}
                    >
                      {letter.toUpperCase()}
                    </button>
                  )
                }

                return (
                  <button key={i} 
                    className={(letter === 'enter' || letter === 'delete') ? 'action' : ''}
                    onClick={() => setLetter(letter.toUpperCase())}>
                      {letter.toUpperCase()}
                  </button>
                )
              })}
            </div>
          )
        }
      </section>
  )
}