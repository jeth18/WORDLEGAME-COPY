import { createPortal } from 'react-dom'
import { IModal } from '../interfaces'

export const SurrenderModal = ({ open, word, closeToggle }: IModal) => {
  const show = open ? 'display-modal' : 'display-none'
  return createPortal((
    <div className={`modal ${show}`}>
      <section className='modal-main'>
        <section className='modal-header'>
          <h1>¡PERDISTE!</h1>
          <button className='button-close' onClick={closeToggle}>X</button>
        </section>
        <p>{word}</p>
      </section>
    </div>
  ), document.getElementById('modal') as HTMLDivElement)
}
