import * as Dialog from "@radix-ui/react-dialog"
import { DialogClose } from "@radix-ui/themes"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { X } from "lucide-react"


type NoteCardProps = {
  note:{
    id: string,
    data: Date,
    content: string
  },
  onNoteDelete(id: string): void
}


export default function NoteCard({ note,onNoteDelete }: NoteCardProps) {

  return (
    <Dialog.Root >
      <Dialog.Trigger className="bg-slate-800 flex flex-col  rounded-md gap-3 p-5 text-justify overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm text-slate-300 font-medium">{formatDistanceToNow(note.data.toString(), { locale: ptBR, addSuffix: true })}</span>
        <p className="text-sm text-slate-400 leading-6">
          {note.content}
        </p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60 " />
        <Dialog.Content
          className="overflow-hidden fixed left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 max-w-[640px] w-full rounded-md flex flex-col bg-slate-700 h-[60vh] ">
          <div 
          className="flex flex-1 flex-col gap-3 p-5"
          >
            <DialogClose className="absolute right-0 top-0 m-3 hover:rotate-45">
              <X />
            </DialogClose>

            <span className="text-sm text-slate-300 font-medium">{formatDistanceToNow(note.data.toString())}</span>
            <p className="text-sm text-slate-400 leading-6">
              {note.content}
            </p>
          </div>
          <button
            onClick={()=>onNoteDelete(note.id)}
           className="w-full bg-slate-800 py-4 text-center outline-none text-sm group">
            Deseja <span className="font-medium text-red-500 group-hover:underline">apagar essa nota</span>?
          </button>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
