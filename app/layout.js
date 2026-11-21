export const metadata = {
  title: 'RCP Agent',
  description: 'Aplicație mobilă pentru agenți',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  )
}
