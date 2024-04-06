import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { TiPlus } from "react-icons/ti";

type ComponentHero = {
  title: string;
  image: string;
  video: string;
};
export default function Hero({ title, image, video }: ComponentHero) {
  return (
    <div className="h-[55vh]  lg:h-[70vh] w-full flex justify-start items-center relative">
      <video
        poster={image}
        autoPlay
        muted
        loop
        controls={false}
        className="w-full absolute top-0 left-0 h-[55vh] lg:h-[70vh] object-cover brightness-[70%] ">
        <source src={video} type="video/mp4" />
        {/* Ajoutez d'autres sources vidéo ici si nécessaire */}
      </video>

      <div className="absolute  w-full sm:w-1/2 lg:w-[40%] mx-auto px-4 bottom-6">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold">
          {title}
        </h1>
        <div className="flex space-x-3 mt-4">
          <Button className="flex items-center text-lg  sm:text-xl py-6 font-semibold">
            <FaPlay className="mr-2" />
            Abspielen
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-secondary/40 py6 rounded-full h-12 w-12 text-2xl  group">
            <TiPlus className="rotate-0 group-hover:rotate-90 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
