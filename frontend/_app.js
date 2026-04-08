import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { SupabaseAuthProvider } from '../contexts/SupabaseAuthContext';
import { SupabaseCartProvider } from '../contexts/SupabaseCartContext';

function MyApp({ Component, pageProps }) {
  return (
    <SupabaseAuthProvider>
      <SupabaseCartProvider>
        <Component {...pageProps} />
      </SupabaseCartProvider>
    </SupabaseAuthProvider>
  );
}

export default MyApp;
