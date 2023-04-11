import { createPortal } from 'react-dom'
import { IModal } from '../interfaces'

export const WinnerModal = ({ open, word, closeToggle, newGame } : Required<IModal>) => {

  const show = open ? 'display-modal' : 'display-none'

  return createPortal((
    <div className={`modal ${show}`}>
      <section className='modal-main'>
        <section className='modal-header'>
          <h1>GANADOR</h1>
          <button className='button-close' onClick={closeToggle}>X</button>
        </section>
        <p>{word}</p>
        <button className='button-winner' onClick={(e) => newGame(e)}>Nuevo juego</button>
      </section>
    </div>
  ), document.getElementById('modal') as HTMLDivElement)
}
