import '../styles/globals.css'


export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body className="bg-gradient-to-br from-blue-600 via-cyan-400 to-sky-300 w-screen h-screen">
        {children}
      </body>
    </html>
  )
}
