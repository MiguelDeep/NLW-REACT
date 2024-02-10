import React from 'react'


type ButtonsProps = {
  children:React.ReactNode
}

export default function Button({ children }:ButtonsProps) {
  return (
    <button className="w-full bg-slate-800 py-4 text-center outline-none text-sm group">
      {children}
     </button>

  )
}
