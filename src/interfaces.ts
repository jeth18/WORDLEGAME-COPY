export interface ILetter {
  letter: string,
  color: string
}

export interface IKeyboard {
  setLetter: (l: string) => void
  deleteB: () => void
  enter: () => void
}

export interface IUseWord {
  word: string,
  lengthw: number,
  searchWord: () => void
  updateLengthWord: (n: number) => void
}