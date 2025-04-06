import { useRouter } from "next/navigation";

export default function ErrorSetter({ error }: { error: string }) {
  const router = useRouter();
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-center">
      <p>Error: {error}</p>
      <button
        onClick={router.refresh}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}
