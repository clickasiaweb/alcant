import React from "react";
import Head from "next/head";
import AnnouncementBar from "./AnnouncementBar";
import ΛʟcΛɴᴛHeader from "./AlcantaraHeader";
import ΛʟcΛɴᴛFooter from "./AlcantaraFooter";
import CartDrawer from "./CartDrawer";

export default function Layout({ children, title, description }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={description || "ΛʟcΛɴᴛ Accessories - Premium Products"}
        />
        <meta
          name="keywords"
          content="alcant, accessories, premium, luxury, automotive, phone cases, bags"
        />
        <title>
          {title ? `${title} - ΛʟcΛɴᴛ` : "ΛʟcΛɴᴛ Accessories"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white">
        <AnnouncementBar />
        <ΛʟcΛɴᴛHeader />
        <main className="flex-grow">{children}</main>
        <ΛʟcΛɴᴛFooter />
        <CartDrawer />
      </div>
    </>
  );
}
