import { Skeleton } from "@mui/material";
import { Suspense } from "react";

export default function Greet({ name }: { name: string }) {
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

    return name ? `${greeting}, ${name}!` : `${greeting}`;
  }

  return (
    <Suspense fallback={<Skeleton variant="text" sx={{ fontSize: "22px" }} />}>
      <div>{greet(name)}</div>
    </Suspense>
  );
}
