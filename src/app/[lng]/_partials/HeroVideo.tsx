"use client";
import Spinner from "@/components/ui/Spinner";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => (
    <div
      className="min-[500px]:min-h-[500px] min-h-[230px]"
      style={{
        position: "relative",
        width: "100%",

        marginBottom: "20px",
        marginTop: "60px",
        backgroundColor: "#333",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner color="#fff" size={25} strokeWidth={1} />
    </div>
  ),
});

export default function HeroVideo() {
  return (
    <>
      {/* // Lazy load the YouTube player */}

      <div
        className="video-container"
        style={{
          position: "relative",
          width: "100%",
          marginTop: "60px",
          marginBottom: "20px",
          maxHeight: "580px",
        }}
      >
        <video
          src={"/videos/heroVideo.mp4"}
          muted
          loop
          autoPlay
          playsInline
          style={{ width: "100%", borderRadius: 10 }}
        />
      </div>
    </>
  );
}
