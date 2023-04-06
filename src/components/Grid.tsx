import { ILetter } from '../interfaces'

interface IGrid {
  grid: ILetter[][]
}

export const Grid = ({grid}: IGrid) => {
  return (
     <section className='grid'>
        {
          grid.map((el, i) => {
            return (
              <div key={i} className='container-letters'>
                {el.map((l, index) => 
                  <div key={index} className={`letters ${l.color}`}>{l.letter}</div>
                )}
              </div>
            )
          })
        }
      </section>
  )  
}
