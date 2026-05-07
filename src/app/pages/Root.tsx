import { Outlet, ScrollRestoration } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function Root() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
