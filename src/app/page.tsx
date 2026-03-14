import { redirect } from 'next/navigation';

// The root page is no longer used. Instead, the middleware redirects
// to the default locale (`/en`).
export default function RootPage() {
  redirect('/en');
}
