import React from 'react'

const LanguageSelector = ({ label, selected, setSelected, options }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#4C5F77] mb-1">{label}</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-[#2E3440] shadow hover:shadow-md transition"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {options.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
