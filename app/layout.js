import './globals.css'

export const metadata = {
  title: 'Handi API - Card Lookup',
  description: 'Card Information Lookup using Handi API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
