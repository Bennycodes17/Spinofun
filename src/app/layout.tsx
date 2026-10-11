import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";

export const metadata: Metadata = {
  title: "SPINO.fun | Hold. Spin. Win ETH. • Instant Rewards",
  description:
    "Premium spin-wheel rewards protocol for $SPIN token holders. Gated by 5-minute holding duration, tiered rewards, and automatic wallet payouts.",
  icons: {
    icon: [
      { url: "/spino-logo.jpg" },
      { url: "/spino-logo.jpg", sizes: "32x32" },
      { url: "/spino-logo.jpg", sizes: "192x192" },
    ],
    apple: "/spino-logo.jpg",
    shortcut: "/spino-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#FF6B8A] selection:text-white">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
