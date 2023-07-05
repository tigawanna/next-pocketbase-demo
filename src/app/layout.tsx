import './globals.css'
import { Inter } from 'next/font/google'
import { AppWrapper } from './root/AppWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "PB",
  description: "Pocketbase Next13 Auth demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  )
}
