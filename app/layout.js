'use client' // ক্লায়েন্ট সাইড হুক ব্যবহারের জন্য এটি প্রয়োজন
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ReduxProvider } from '@/redux/Providers' 
import Navbar from '@/components/common/Navbar'
import CyberBackground from '@/components/common/CyberBackground'
import './globals.css'

export default function RootLayout({ children }) {
  const pathname = usePathname()

  
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visitors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: pathname })
        })
      } catch (err) {
        console.warn("Analytics signal lost...")
      }
    }
    trackVisitor()
  }, [pathname]) 

  return (
    <html lang="en">
     <head>
        <title>Kawsar | Cyber Security Analyst</title>
        <meta name="description" content="Portfolio of MD. KAWSAR HOSSAIN - Penetration Tester" />
        
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="bg-[#0b0f14]">
        <ReduxProvider>
          <CyberBackground />
          <Navbar />
          <main>
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  )
}