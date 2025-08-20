import localFont from "next/font/local";
import { Inter as FontSans, Urbanist } from "next/font/google";
import { Concert_One, Amaranth } from "next/font/google";

export const fontSans = Amaranth({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans",
})

export const fontUrban = Urbanist({
  subsets: ["latin"],
  variable: "--font-urban",
})

export const fontHeading = Concert_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-heading",
})

export const fontGeist = localFont({
  src: "./GeistVF.woff2",
  variable: "--font-geist",
})
