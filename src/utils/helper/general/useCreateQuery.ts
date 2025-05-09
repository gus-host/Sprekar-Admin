import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function useCreateQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return { createQueryString, pathname };
}

export default useCreateQuery;
