import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Vastra Villa",
  description: "Premium Ethnic Fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-alabaster text-obsidian">
        <AuthProvider>

          <Navbar />

          <main className="pt-0 min-h-screen">
            {children}
          </main>

          <Footer />

        </AuthProvider>

      </body>
    </html>
  );
}