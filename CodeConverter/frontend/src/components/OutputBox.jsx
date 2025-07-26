import React from 'react'

const OutputBox = ({ output }) => {
  return (
    <div className="w-full h-[300px] p-4 border border-gray-200 rounded-md bg-[#FDFEFF] text-sm font-mono overflow-auto shadow-inner">
      {output}
    </div>
  )
}

export default OutputBox
