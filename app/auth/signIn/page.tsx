import { SignupFormDemo } from "@/components/SignupComponent";
import { Spotlight } from "@/components/ui/Spotlight";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center  w-full bg-dot-white/[0.1] relative overflow-hidden">
      <Spotlight className="-top-20 left-0 md:left-60" fill="white" />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
      <div className="max-w-md mx-auto p-8 rounded-md shadow-lg">
        <SignupFormDemo />
      </div>
    </div>
  );
}
