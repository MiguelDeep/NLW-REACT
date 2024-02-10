import * as Dialog from "@radix-ui/react-dialog"
import { DialogClose } from "@radix-ui/themes"
import { X } from "lucide-react"
import { ChangeEvent, FormEvent, useState } from "react"
import {  toast } from 'sonner'


interface onNoteCreatedProps {
  onNoteCreated: (content: string) => void
}

export default function NewNoteCard({ onNoteCreated }: onNoteCreatedProps) {
  let speechRecognition: SpeechRecognition | null = null;
  const [isRecording, setRecording] = useState(false)
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState(" ");

  function hanleClick() {
    setShouldShowOnboarding(false);
  }
  function closeEdit() {
    setShouldShowOnboarding(true);

  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    let getValue: string = event.target.value
    setContent(getValue)
    if (getValue.length == 0) {
      setShouldShowOnboarding(true)
    } else {
      setShouldShowOnboarding(false)
    }
  }
  function handleSaveNote(event: FormEvent) {
    event.preventDefault();
    if (content == "")
      return
    onNoteCreated(content)
    setContent("")
    setShouldShowOnboarding(true)
    toast.success("Nota criada com sucesso.")

  }
  function handleStarRecording() {
    setRecording(true)
    const isSpeechRecognitionAPIavailable = "SpeechRecognition" in window || 'webkitSpeechRecognition' in window;
    if (!isSpeechRecognitionAPIavailable) {
      alert("Infelizmente seu navegador nao suporta API de gravação.")
      return
    }
    setRecording(true)
    setShouldShowOnboarding(false)
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI();


    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "")

      setContent(transcription)
    }
    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition.start()

  }
  function handleStopRecording() {
    setRecording(false)
   if (speechRecognition !== null) 
    speechRecognition.stop();

  }
  return (
    <Dialog.Root>
      <Dialog.Trigger className=" bg-slate-700 rounded-md space-y-6 p-6 outline-none text-justify hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm text-slate-300 font-medium">
          Adicionar nota
        </span>
        <p className="text-sm text-slate-400 leading-6">
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>

      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/60 " />
        <Dialog.Content className="overflow-hidden  fixed left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 max-w-[640px] w-full rounded-md flex flex-col bg-slate-700 h-[60vh] ">
          <DialogClose className="absolute right-0 top-0 m-3 hover:rotate-45 ">
            <X onClick={closeEdit} />
          </DialogClose>
          <form className="flex-1 flex flex-col ">
            <div className="flex flex-1 flex-col  gap-3 p-5">

              <span className="text-sm text-slate-300 font-medium">Adicionar nota </span>

              {shouldShowOnboarding ? (
                <p className="text-sm text-slate-400 leading-6">
                  Comece a <button type="button" onClick={handleStarRecording} className=" text-lime-500 font-medium hover:underline cursor-pointer">gravando uma nota</button> em aúdio ou se preferir <button type="button" onClick={hanleClick} className=" text-lime-500 font-medium hover:underline cursor-pointer">utilize apenas texto</button>.
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="leading-6 text-sm resize-none bg-transparent flex-1 outline-none"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex items-center justify-center w-full bg-slate-900 py-4 text-center text-slate-300 outline-none text-sm font-semibold hover:bg-slate-500 gap-2  ">
                <div className="size-3 bg-red-900 rounded-full animate-ping" />  Gravando! Click para interromper
              </button>
            ) : (

              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-500 py-4 text-center text-lime-950 outline-none text-sm font-semibold hover:bg-lime-600">
                Salvar nota
              </button>
            )}

          </form>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>
  )
}
