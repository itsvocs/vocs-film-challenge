/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { HiMiniBars2, HiMiniBars3BottomLeft } from "react-icons/hi2";
import { PiFilmReelBold } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
import { BiSolidHome, BiSolidTv } from "react-icons/bi";
import { TbDeviceTvOld } from "react-icons/tb";
import Link from "next/link";
import { TiPlus } from "react-icons/ti";
import { usePathname, useRouter } from "next/navigation";
import { signOut, User } from "firebase/auth";
import { auth } from "@/firebase/client/config";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import NewFilm from "./NewFilm";

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const nav = [
    {
      name: "Home",
      path: "/",
      icon: BiSolidHome,
    },
    {
      name: "Filmen",
      path: "/#filmen",
      icon: PiFilmReelBold,
    },
    {
      name: "Serien",
      path: "/#serien",
      icon: TbDeviceTvOld,
    },
    {
      name: "Meine Wachliste",
      path: "/#mylist",
      icon: FaPlus,
    },
    {
      name: "Film hinzufügen",
      path: "/create",
      icon: AiOutlineVideoCameraAdd,
    },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(true);
      if (!user) {
        router.push("/auth/signIn");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
  }, [router]);

  return (
    <header className={`w-full ${pathname === "/auth/signIn" ? "hidden" : ""}`}>
      <nav
        className={`mx-auto  ${
          pathname === "/" ? "fixed top-0 z-50" : "relative"
        }  w-full flex max-w-full items-center justify-between p-8 px-2 lg:px-8`}
        aria-label="Global">
        <div className="flex">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <BiSolidTv className="h-6 w-6 mb-1" />
            <span className="text-2xl font-medium tracking-wide">FILM</span>
            <TiPlus className="h-5 w-5 text-indigo-500" />
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-10 ml-6">
          {nav.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className="flex items-center">
              <item.icon className="h-5 w-5 mr-2" />
              <span className="text-xl font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <img
                  className="w-10 h-10"
                  src={`https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${user?.email}&radius=10&mouth=smile&eyes=squint,surprised,wink,default`}
                  alt="profilImage"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/#myfilms")}>
                  <span>Meine Filmen</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/#mylist")}>
                  <span>Watchlist</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  setLoading(true);
                  await signOut(auth);
                  setLoading(false);
                  router.push("/auth/signIn");
                }}>
                {" "}
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-transparent p-0 -mt-2">
                <HiMiniBars2 className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="inline-flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button>
                      <img
                        className="w-10 h-10"
                        src={`https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${user?.email}&radius=10&mouth=smile&eyes=squint,surprised,wink,default`}
                        alt="profilImage"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Meine Filmen</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span>Watchlist</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      {" "}
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SheetHeader>
              <div className="flex w-full flex-col space-y-8 my-8">
                {nav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="flex items-center">
                    <item.icon className="h-5 w-5 mr-2" />
                    <span className="text-xl font-medium tracking-wide">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
