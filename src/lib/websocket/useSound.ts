export default function useSound(url: string) {
  const playSound = () => {
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.error("Sound play failed:", err);
    });
  };

  return { playSound };
}
