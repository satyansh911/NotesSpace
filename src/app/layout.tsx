import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NotesSpace Workspace",
  description: "Collaborative AI Notes Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        {/* Prevent flash of wrong theme — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('notesspace-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${ebGaramond.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
