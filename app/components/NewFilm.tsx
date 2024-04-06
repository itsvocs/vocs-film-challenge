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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewFilm({ uid }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchemaFilm>>({
    resolver: zodResolver(FormSchemaFilm),
  });

  async function onSubmit(data: z.infer<typeof FormSchemaFilm>) {
    setLoading(true);
    const userData = { ...data, uid };
    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        router.push("/");
        toast.success("Der Film wurde erfolgreich hinzufügt");
        setLoading(false);
      } else {
        console.error("Ein Fehler ist vorgekommen:", response.statusText);
        toast.error("Der Film konnte nicht hinzugefügt werden");
      }
    } catch (error) {
      console.error("Ein Fehler ist vorgekommen:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pt-8">
        <div className="grid w-full max-w-lg gap-4 bg-black border p-6 shadow-lg  sm:rounded-lg">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Einen neuen Film hinzufügen
            </h3>
            <p className="text-sm text-muted-foreground">
              Füllen Sie die Daten aus, um einen neuen Film zu erstellen.
            </p>
          </div>

          <div className="flex flex-col w-full gap-4 py-4">
            <div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="name">Title des Films</Label>
                      <FormControl>
                        <Input id="name" {...field} type="text" />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="imageString"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="category">Die URL des Bildes</Label>
                      <FormControl>
                        <Input
                          id="category"
                          {...field}
                          placeholder=""
                          type="text"
                        />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-x-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="age">Mindestalter</Label>
                      <FormControl>
                        <Input
                          id="age"
                          {...field}
                          min={0}
                          max={18}
                          type="number"
                        />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="duration">Dauer des Films</Label>
                      <FormControl>
                        <Input id="duration" {...field} type="text" />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="category">Kategorie</Label>
                      <FormControl>
                        <Input id="category" {...field} type="text" />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="description">Beschreibung</Label>
                      <FormControl>
                        <Textarea
                          id="description"
                          className="resize-none bg-black"
                          {...field}
                        />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="videoSource"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="videoSource">Die URL des Videos</Label>
                      <FormControl>
                        <Input id="videoSource" {...field} type="text" />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="youtubeString"
                render={({ field }) => (
                  <FormItem>
                    <LabelInputContainer>
                      <Label htmlFor="youtubeString">Die YouTube Url</Label>
                      <FormControl>
                        <Input id="youtubeString" {...field} type="text" />
                      </FormControl>
                    </LabelInputContainer>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Erstellen</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
