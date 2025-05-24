import "./globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nitroster-App",
  description: "Nitroster-App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
