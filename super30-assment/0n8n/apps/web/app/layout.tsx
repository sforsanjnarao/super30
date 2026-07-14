import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://workfloww.bitshitfalse.com"),
  title: "Workfloww — Node Based Automation",
  description:
    "Build complex workflows in minutes",
  keywords: [
    "automation",
    "workflow",
    "node-based",
    "productivity",
    "integration",
    "Workfloww",
  ],
  authors: [{ name: "Sanjana Kumari", url: "https://github.com/sforsanjnarao" }],
  creator: "Sanjana Kumari",
  openGraph: {
    title: "Workfloww — Build, Automate, Scale",
    description:
      "Your go-to node-based automation platform. Connect your apps, automate your workflows, and scale your productivity with ease.",
    siteName: "Workfloww",
    type: "website",
    url: "https://workfloww.bitshitfalse.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Workfloww — Node Based Automation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bitshitfalse",
    creator: "@bitshitfalse",
    title: "Workfloww — Node Based Automation",
    description: "Connect your apps, automate your workflows, and scale your productivity with ease.",
    images: ["/og-image.png"],
  },
  other: {
    "theme-color": "#030303",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics/>
      </body>
    </html>
  );
}
