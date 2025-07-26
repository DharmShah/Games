export const convertCode = async (fromLang, toLang, code) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_lang: fromLang,
        to_lang: toLang,
        code: code,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Server error: ${err}`);
    }

    const data = await response.json();
    return data.converted_code;
  } catch (error) {
    console.error("🔥 Conversion failed:", error.message);
    return null;
  }
};
