"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";

export default function Page() {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    constraints: {
      video: {
        facingMode: { ideal: "environment" },
      },
      audio: false,
    },

    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  return (
    <>
      <video
        ref={(instance) => {
          (ref as React.MutableRefObject<HTMLVideoElement | null>).current =
            instance;
        }}
      />
      <p>
        <span>Last result:</span>
        <span>{result}</span>
      </p>
    </>
  );
}
