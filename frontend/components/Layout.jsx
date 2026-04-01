import React from "react";
import Head from "next/head";
import AnnouncementBar from "./AnnouncementBar";
import AlcantaraHeader from "./AlcantaraHeader";
import AlcantaraFooter from "./AlcantaraFooter";
import CartDrawer from "./CartDrawer";

export default function Layout({ children, title, description }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={description || "Alcantara Accessories - Premium Products"}
        />
        <meta
          name="keywords"
          content="alcantara, accessories, premium, luxury, automotive, phone cases, bags"
        />
        <title>
          {title ? `${title} - Alcantara` : "Alcantara Accessories"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white">
        <AnnouncementBar />
        <AlcantaraHeader />
        <main className="flex-grow">{children}</main>
        <AlcantaraFooter />
        <CartDrawer />
      </div>
    </>
  );
}
