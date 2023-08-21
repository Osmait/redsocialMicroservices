import NextLink from "next/link";
import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import SearchInput from "../components/search-input";
import { UserImage } from "../components/user-image";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            {/* <Navbar /> */}
            <main className="container mx-auto max-w-full pt-16 px-6 flex-grow ">
              <section className="flex justify-center">
                <div className="flex flex-col gap-5 items-start w-1/4 p-4">
                  <UserImage />
                  {siteConfig.navItems.map((item) => (
                    <>
                      <NextLink
                        key={item.href}
                        color="foreground"
                        href={item.href}
                      >
                        {item.label}
                      </NextLink>
                    </>
                  ))}
                </div>

                {children}

                <div className="w-1/4 p-4">
                  <h1>Search</h1>
                  <SearchInput />
                </div>
              </section>
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://nextui-docs-v2.vercel.app?utm_source=next-app-template"
                title="nextui.org homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">NextUI</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
