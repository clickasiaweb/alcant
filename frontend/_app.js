import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthContext';
import { SupabaseCartProvider } from '../contexts/SupabaseCartContext';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { SearchProvider } from '../contexts/SearchContext';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1a365d" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>
      <SupabaseAuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <SupabaseCartProvider>
                <Component {...pageProps} />
              </SupabaseCartProvider>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </SupabaseAuthProvider>
    </>
  );
}

export default MyApp;
