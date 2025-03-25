export default function Greet() {
  function greet(name: string): string {
    const hour = new Date().getHours();
    let greeting: string;

    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    return `${greeting}, ${name}!`;
  }
  greet("add");

  return <div>Greet</div>;
}
