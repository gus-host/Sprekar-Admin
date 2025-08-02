// app/[lng]/[...slug]/page.tsx
import { notFound } from "next/navigation";

export default function CatchAll() {
  // This tells Next to render the nearest not-found.tsx
  notFound();
}
