"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/utils/cn";
import { IconBrandGoogle, IconBrandOnlyfans } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSchema, FormSchemaSignIn } from "@/src/schema/UserSchema";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth, db } from "@/firebase/client/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export function SignupFormDemo() {
  const [optionLogin, setOptionLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const formSignin = useForm<z.infer<typeof FormSchemaSignIn>>({
    resolver: zodResolver(FormSchemaSignIn),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setLoading(true);
    // extract meine Datei
    const email = data.email;
    const password = data.password;
    try {
      let userCredential;

      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await userCredential.user.getIdToken()}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.ok) {
          //? User zu dem DatenBank hinzufügen
          const user: User = userCredential.user;
          const docRef = await setDoc(doc(db, "users", user.uid), data);
          router.push("/");
          setLoading(false);
        }
      });
    } catch (error: any) {
      console.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  async function onSubmitSignIn(data: z.infer<typeof FormSchemaSignIn>) {
    setLoading(true);
    // extract meine Datei
    const email = data.emailLogin;
    const password = data.passwordLogin;
    try {
      let userCredential;

      userCredential = await signInWithEmailAndPassword(auth, email, password);

      await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await userCredential.user.getIdToken()}`,
          "Content-Type": "application/json",
        },
      }).then(async (response) => {
        if (response.ok) {
          //? User zu dem DatenBank hinzufügen
          const user: User = userCredential.user;
          const docRef = await setDoc(doc(db, "users", user.uid), data);
          router.push("/");
          setLoading(false);
        }
      });
    } catch (error: any) {
      console.error(error.message);
      toast.error("Password oder Email falsch");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full mx-auto md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
      <h2 className="font-bold text-xl text-neutral-200">
        Willkommen bei der Moving Challenge
      </h2>
      <p className=" text-sm max-w-sm mt-2 text-muted-foreground">
        Um auf die Inhalte der Filme und Serien zugreifen zu können, müssen Sie
        eingeloggt sein.
      </p>
      {/* TODO: Signin form Component */}
      <Form {...form}>
        <form
          className={` my-8 ${optionLogin ? "" : "hidden"}`}
          onSubmit={formSignin.handleSubmit(onSubmitSignIn)}>
          <div className="mb-4">
            <FormField
              control={formSignin.control}
              name="emailLogin"
              render={({ field }) => (
                <FormItem>
                  <LabelInputContainer>
                    <Label htmlFor="emailL">Email adresse</Label>
                    <FormControl>
                      <Input
                        id="emailL"
                        {...field}
                        placeholder="email@exemple.com"
                        type="text"
                      />
                    </FormControl>
                  </LabelInputContainer>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-4">
            <FormField
              control={formSignin.control}
              name="passwordLogin"
              render={({ field }) => (
                <FormItem>
                  <LabelInputContainer>
                    <Label htmlFor="passwordL">Passwort</Label>
                    <FormControl>
                      <Input
                        id="passwordL"
                        {...field}
                        placeholder="••••••••"
                        type="password"
                      />
                    </FormControl>
                  </LabelInputContainer>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-9000 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit">
            {loading ? "Chargement" : <span>Sich anmelden &rarr;</span>}
            <BottomGradient />
          </button>

          <div className="text-sm mt-4 text-muted-foreground">
            Not yet registered?{" "}
            <Button
              variant="link"
              size="sm"
              type="button"
              className="p-0"
              onClick={() => {
                setOptionLogin(false);
              }}>
              Create an account.
            </Button>
          </div>
          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </Form>
      {/* TODO: SignUp form Component */}
      <Form {...form}>
        <form
          className={` my-8 ${!optionLogin ? "" : "hidden"}`}
          onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            {/* Nachname */}
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="name">Nachname</Label>
                      <FormControl>
                        <Input
                          id="name"
                          {...field}
                          placeholder="John"
                          type="text"
                        />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Vorname */}
            <div>
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="lastname">Vorname</Label>
                      <FormControl>
                        <Input
                          id="lastname"
                          {...field}
                          placeholder="Doe"
                          type="text"
                        />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* email */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <LabelInputContainer>
                    <Label htmlFor="email">Email adresse</Label>
                    <FormControl>
                      <Input
                        id="email"
                        {...field}
                        placeholder="email@exemple.com"
                        type="text"
                      />
                    </FormControl>
                  </LabelInputContainer>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* passwort */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <LabelInputContainer>
                    <Label htmlFor="password">Passwort</Label>
                    <FormControl>
                      <Input
                        id="password"
                        {...field}
                        placeholder="••••••••"
                        type="password"
                      />
                    </FormControl>
                  </LabelInputContainer>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <button
            className="bg-gradient-to-br relative group/btn from-zinc-900 to-zinc-9000 block bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit">
            {loading ? "Chargement" : <span>Sich registrieren &rarr;</span>}

            <BottomGradient />
          </button>

          <div className="text-sm mt-4 text-muted-foreground">
            bereits angemeldet?{" "}
            <Button
              variant="link"
              size="sm"
              className="p-0"
              type="button"
              onClick={() => {
                setOptionLogin(true);
              }}>
              anmelden
            </Button>
          </div>
          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className=" flex-col space-y-4  hidden">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-foreground rounded-md h-10 font-medium shadow-input bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] group"
              type="submit">
              <IconBrandGoogle className="h-4 w-4 text-neutral-300 group-hover:flex hidden" />
              <IconBrandOnlyfans className="h-4 w-4 text-neutral-300 group-hover:hidden flex" />
              <span className=":text-neutral-300 text-sm group-hover:hidden flex">
                OnlyFans
              </span>
              <span className=":text-neutral-300 text-sm  group-hover:flex hidden">
                I mean Google :)
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
