import type { Note } from "@prisma/client";

export interface ExtendedNote extends Note {
  updatedDate: string
}