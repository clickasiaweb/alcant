import React from "react";
import Head from "next/head";
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { SearchProvider } from '../contexts/SearchContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ErrorBoundary>
        <AuthProvider>
          <SearchProvider>
            <WishlistProvider>
              <CartProvider>
                <Component {...pageProps} />
              </CartProvider>
            </WishlistProvider>
          </SearchProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
