import "./globals.css";
import AppProvider from "@/components/AppProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export const metadata = {
  title: {
    default: "ShopHub - Your one-stop shop",
    template: "%s | ShopHub",
  },
  description: "Your one-stop shop for everything you need.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        />
      </head>
      <body>
        <AppProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
