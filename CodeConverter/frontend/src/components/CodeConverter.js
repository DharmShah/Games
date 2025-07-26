import React, { useState } from "react";
import { convertCode } from "./convertcode"; // adjust the import path if needed

const CodeConverter = () => {
  const [fromLang, setFromLang] = useState("Python");
  const [toLang, setToLang] = useState("JavaScript");
  const [code, setCode] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    setConvertedCode("");

    const result = await convertCode(fromLang, toLang, code);
    setConvertedCode(result || "❌ Conversion failed. Check console.");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">🧠 Code Converter</h2>

      <form onSubmit={handleConvert} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block font-medium">From Language</label>
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>Java</option>
              <option>C++</option>
              {/* Add more if needed */}
            </select>
          </div>

          <div className="flex-1">
            <label className="block font-medium">To Language</label>
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              {/* Add more if needed */}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium">Input Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="6"
            className="w-full border rounded px-2 py-1 font-mono"
            placeholder='e.g. print("Hello, world!")'
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Converting..." : "Convert Code"}
        </button>
      </form>

      {convertedCode && (
        <div className="mt-6">
          <label className="block font-medium mb-1">🪄 Converted Code</label>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap font-mono">
            {convertedCode}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeConverter;
