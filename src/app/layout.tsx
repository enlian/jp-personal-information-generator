export const metadata = {
  title: '個人情報ジェネレーター',
  description: 'Generated by https://github.com/enlian',
}

import "./common.scss"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
