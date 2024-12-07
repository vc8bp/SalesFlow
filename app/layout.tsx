import { Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Providers } from '@/app/providers'
import './globals.css'
import StoreProvider from '@/store/StoreProvider'
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Navbar />
            <main>
              {children}
              <Toaster/>
            </main>

          </Providers>
        </body>
      </html>

    </StoreProvider>

  )
}