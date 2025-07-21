'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleCheckout = async () => {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const data = await res.json();
    if (data?.url) {
      router.push(data.url); 
    }
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-black-600">Blog App</Link>
      <div className="space-x-4">
        <Link href="/" className={pathname === '/' ? 'text-black-600 font-semibold' : 'text-gray-700'}>Home</Link>
        <Link href="/login" className={pathname === '/login' ? 'text-blue-600 font-semibold' : 'text-gray-700'}>Login</Link>
        <Link href="/register" className={pathname === '/register' ? 'text-blue-600 font-semibold' : 'text-gray-700'}>Register</Link>
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          subscribe
        </button>
      </div>
    </nav>
  );
}
