import { ChangeEvent, useState } from "react"
import logo from "./assets/logo-nlw-expert.svg"
import NewNoteCard from "./components/new-note-card"
import NoteCard from "./components/note-card"
import { toast } from "sonner"

interface Note {
  id: string;
  data: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const noteOnLocalStorage = localStorage.getItem('Note');

    if (noteOnLocalStorage) {
      return JSON.parse(noteOnLocalStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID().toString(),
      data: new Date(),
      content
    }
    const noteArray = [newNote, ...notes]
    setNotes(noteArray)
    localStorage.setItem('Note', JSON.stringify(noteArray))
  }
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)

  }
  function onNoteDelete(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem('Note', JSON.stringify(notesArray))
    toast.message("A sua nota foi apagada com sucesso!")
  }
  const filteredNotes = search !== '' ? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes
  return (
    <div className="mx-auto max-w-6xl my-10 space-y-6 px-5  md:px-0">
      <img src={logo} alt="logo-nlw-expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="busque em suas  notas..."
          className=" w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearch}
        />

      </form>
      <div className="h-px bg-slate-800" />
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-6 ">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((notes) => {
          return <NoteCard key={notes.id} note={notes} onNoteDelete={onNoteDelete} />
        })
        }

      </div>
    </div>
  )
}

