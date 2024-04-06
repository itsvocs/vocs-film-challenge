"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchemaFilm } from "@/src/schema/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LabelInputContainer } from "@/components/SignupComponent";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import NewFilm from "../components/NewFilm";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/client/config";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // setLoading(true);
      if (!user) {
        router.push("/auth/signIn");
      } else {
        setUser(user);
        setLoading(false);
      }
    });
  }, [router]);
  return (
    <div className="bg-black min-h-screen w-full bg-dot-white/[0.03] relative overflow-hidden flex-col pb-24 flex justify-center items-center">
      <div className="absolute pointer-events-none -z-10 inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
      <NewFilm uid={user?.uid} />
    </div>
  );
}
