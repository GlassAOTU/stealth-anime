"use client"

import Home from "../page"
import { Silkscreen } from "next/font/google"

export const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '400'],
})


export default function SyntheticV0PageForDeployment() {
  return <Home />
}