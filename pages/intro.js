import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Intro() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 5000); // Wait 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <video
        src="https://res.cloudinary.com/dijp53vwi/video/upload/v1744082802/IKhxRdN2UkQ_ejkwbs.mp4"
        autoPlay
        playsInline
        muted={false}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
