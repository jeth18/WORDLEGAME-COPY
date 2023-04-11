export interface ILetter {
  letter: string,
  color: string
}

export interface IKeyboard {
  setLetter: (l: string) => void
  deleteB: () => void
  enter: () => void
  keyBoardFind: ILetter[]
}

export interface IUseWord {
  word: string,
  lengthw: number,
  searchWord: () => void
  updateLengthWord: (n: number) => void
}


export interface IModal {
  open: boolean,
  word: string,
  closeToggle: () => void,
  newGame?: (e: unknown) => void
}