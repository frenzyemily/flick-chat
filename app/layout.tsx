import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flick Chat",
  description: "Connect. Chat. Share.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
