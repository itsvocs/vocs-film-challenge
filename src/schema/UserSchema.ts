import { z } from "zod";
import {
  lowercaseRegex,
  minLengthRegex,
  numberRegex,
  specialCharRegex,
  uppercaseRegex,
} from "../lib/passwordSchema";

export const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Der Nachname muss mindestens 2 Zeichen lang sein",
  }),
  lastname: z.string().min(2, {
    message: "Der Vorname muss mindestens 2 Zeichen lang sein",
  }),
  email: z
    .string({
      required_error: "Bitte geben Sie eine E-Mail-Adresse ein",
    })
    .email({ message: "Bitte geben Sie eine gültige Email-Adresse ein" })
    .trim(),
  password: z
    .string({
      required_error: "Bitte geben Sie ein Passwort ein",
    })
    .regex(minLengthRegex, {
      message: "Der Passwort muss mindestens 8 Zeichen lang sein",
    })
    .regex(uppercaseRegex, {
      message: "Der Passwort muss mindestens eine Buchstabe enthalten",
    })
    .regex(lowercaseRegex, {
      message: "Der Passwort muss mindestens eine Kleinbuchstabe enthalten",
    })
    .regex(numberRegex, {
      message: "Der Passwort muss mindestens eine Zahl enthalten",
    })
    .regex(specialCharRegex, {
      message: "Der Passwort muss mindestens ein Sonderzeichen enthalten",
    }),
});

export const FormSchemaFilm = z.object({
  title: z.string().min(2, {
    message: "Der title muss mindestens 3 Zeichen lang sein",
  }),
  age: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number()),
  duration: z.string().min(2, {
    message: "Der Laufzeit muss mindestens 2 Zeichen lang sein",
  }),
  description: z.string().min(10, {
    message: "Der Beschreibung muss mindestens 10 Zeichen lang sein",
  }),
  imageString: z.string().url({
    message: "Bitte geben Sie eine gültige URL ein",
  }),
  videoSource: z.string().url({
    message: "Bitte geben Sie eine gültige URL ein",
  }),
  category: z.string().min(2, {
    message: "Der Kategorie muss mindestens 2 Zeichen lang sein",
  }),
  youtubeString: z.string().url({
    message: "Bitte geben Sie eine gültige URL ein",
  }),
});

export const FormSchemaSignIn = z.object({
  emailLogin: z
    .string({
      required_error: "Bitte geben Sie eine E-Mail-Adresse ein",
    })
    .email({ message: "Bitte geben Sie eine gültige Email-Adresse ein" })
    .trim(),
  passwordLogin: z.string({
    required_error: "Bitte geben Sie ein Passwort ein",
  }),
});
