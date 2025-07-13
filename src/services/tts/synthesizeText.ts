export async function synthesizeText(text: string) {
  if (!text.trim()) return;

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // match the default in the route:
    body: JSON.stringify({ text, voice: "alloy" }),
  });

  if (!res.ok) {
    console.error("TTS error", await res.json());
    return;
  }
  const buf = await res.arrayBuffer();
  const blob = new Blob([buf], { type: "audio/wav" });

  return URL.createObjectURL(blob);
}

export default synthesizeText;
