import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PLG',
  description: 'Find your next game to play!',
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
