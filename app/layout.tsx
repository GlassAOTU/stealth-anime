import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PLG',
  description: 'A new way to save and discover your favorite games!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
