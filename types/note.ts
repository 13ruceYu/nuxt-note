export interface Note {
  id: number
  title: string
  text: string
  updatedAt: Date
  createdAt: Date
  userId: number
}

export interface ExtendedNote extends Note {
  updatedDate: string
}