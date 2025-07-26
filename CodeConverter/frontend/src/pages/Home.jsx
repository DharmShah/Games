import React, { useState } from 'react'

const languages = ['Python', 'JavaScript', 'C++', 'Java', 'Go', 'Rust']

const fileNames = {
  Python: 'main.py',
  JavaScript: 'script.js',
  'C++': 'main.cpp',
  Java: 'Main.java',
  Go: 'main.go',
  Rust: 'main.rs',
}

const Home = () => {
  const [fromLang, setFromLang] = useState('Python')
  const [toLang, setToLang] = useState('JavaScript')
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')

  const handleConvert = async () => {
  if (!code.trim()) {
    alert("⚠️ Please enter some code to convert.");
    console.log("Sending request to backend...")
    console.log({
      from_lang: fromLang,
      to_lang: toLang,
      code: code
    })

    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from_lang: fromLang,
        to_lang: toLang,
        code: code
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${error}`);
    }

    const data = await response.json();
    setOutput(data.converted_code);
  } catch (error) {
    console.error("❌ Conversion failed:", error.message);
    setOutput(`// ❌ Error: ${error.message}`);
  }
};


  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text)
    alert(`${message} copied to clipboard ✅`)
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#f1fffc] via-[#d6fff4] to-[#baf7e7] font-sans text-[#0e4038] flex flex-col">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-4 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#e6f9f3] mx-6 mt-2 mb-1">
        <div className="text-xl font-bold tracking-wide text-[#15544a]">🌱 Code Converter</div>
      </nav>

      {/* CONVERT BUTTON */}
      <div className="mb-2 mt-1 flex justify-center">
        <button
          onClick={handleConvert}
          className="bg-gradient-to-r from-[#baf7e7] via-[#83e8cf] to-[#5cd6bb] hover:brightness-110 text-[#013c2e] px-6 py-2 rounded-full font-bold text-base shadow-md transition-transform transform hover:scale-105"
        >
          🔁 Convert Code
        </button>
      </div>

      {/* BODY */}
      <div className="flex-grow flex items-center justify-center px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl h-full">

          {/* INPUT CARD */}
          <div className="bg-white/30 backdrop-blur-2xl border border-[#e3fdf6] p-4 rounded-3xl shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1 flex-wrap">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setFromLang(lang)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                      fromLang === lang
                        ? 'bg-[#9ef3dc] text-[#013c2e]'
                        : 'bg-white/40 hover:bg-[#ecfefa] text-[#14403c]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleCopy(code, 'Input code')}
                className="bg-[#d4fef1] hover:bg-[#baf7e7] text-[#025041] px-3 py-1 rounded-full font-semibold shadow-sm transition-all hover:scale-105"
              >
                📋
              </button>
            </div>

            {/* Header like a code tab */}
            <div className="flex items-center justify-between px-3 py-1 bg-white/40 rounded-t-lg border border-b-0 border-[#c7f2e6] text-sm text-[#0d3d35] font-semibold">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>{fileNames[fromLang]}</span>
              </div>
              <span className="text-xs text-[#3a665b] font-light">Insert your code</span>
            </div>

            <textarea
              className="w-full h-[250px] p-3 bg-white/60 text-black rounded-b-xl border border-[#bff4e5] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#a0f5de] resize-none"
              placeholder='print("Hello Dharm!")'
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          {/* OUTPUT CARD */}
          <div className="bg-white/30 backdrop-blur-2xl border border-[#e3fdf6] p-4 rounded-3xl shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-1 flex-wrap">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setToLang(lang)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                      toLang === lang
                        ? 'bg-[#9ef3dc] text-[#013c2e]'
                        : 'bg-white/40 hover:bg-[#ecfefa] text-[#14403c]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleCopy(output, 'Converted code')}
                className="bg-[#d4fef1] hover:bg-[#baf7e7] text-[#025041] px-3 py-1 rounded-full font-semibold shadow-sm transition-all hover:scale-105"
              >
                📋
              </button>
            </div>

            <div className="w-full h-[300px] p-3 bg-white/60 text-black rounded-xl border border-[#bff4e5] font-mono text-sm overflow-auto">
              {output || '// Your converted code will appear here...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
