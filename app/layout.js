import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from './contexts/CartContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nitroster-App",
  description: "Nitroster-App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
