import React from 'react'

const CodeEditor = ({ code, setCode }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Paste your code here..."
      className="w-full h-[300px] p-4 border border-gray-200 rounded-md bg-[#FDFEFF] text-sm font-mono shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
    />
  )
}

export default CodeEditor
