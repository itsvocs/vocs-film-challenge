import HeroVideo from "./components/HeroVideo";
import { MyFilms } from "./components/MyFilms";
import Rating from "./components/Rating";
import { RecentlyAdded } from "./components/RecentlyAdded";
import { WatchList } from "./components/WatchList";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-dot-white/[0.03] relative overflow-hidden flex-col pb-24">
      <div className="absolute pointer-events-none  inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
      <HeroVideo />
      <h3
        id="myfilms"
        className="sm:text-3xl px-4 mx-auto my-8 text-xl text-green-600 font-semibold">
        Von mir erstellt
      </h3>
      <MyFilms />
      <h3 id="mylist" className="sm:text-3xl px-4 mx-auto my-8 text-xl">
        Meine Watchlist
      </h3>
      <WatchList />
      <h3 className="sm:text-3xl px-4 mx-auto my-8 text-xl">
        kürzlich hinzugefügt
      </h3>
      <RecentlyAdded />
    </div>
  );
}
