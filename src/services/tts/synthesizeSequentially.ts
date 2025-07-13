export async function synthesizeSequentially(
  texts: string[],
  voice: string = "alloy"
): Promise<string[]> {
  const urls: string[] = [];

  for (const text of texts) {
    // 1) POST to your Next.js TTS route
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice }),
    });

    if (!res.ok) {
      throw new Error(`TTS failed for "${text}"`);
    }

    // 2) turn response into a Blob URL
    const buffer = await res.arrayBuffer();
    const blob = new Blob([buffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);

    urls.push(url);
  }

  return urls;
}
