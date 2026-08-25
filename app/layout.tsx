import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golden Wheel Motorbike Shop",
  description: "Shop premium street, adventure, classic and sport motorcycles in Okinawa.",
  openGraph: {
    title: "Golden Wheel Motorbike Shop",
    description: "Premium Motorcycles · Okinawa",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Wheel Motorbike Shop",
    description: "Premium Motorcycles · Okinawa",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
