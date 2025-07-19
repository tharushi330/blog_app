// components/BuyPremium.tsx
'use client';
import { useSession } from 'next-auth/react';

export default function BuyPremium() {
  const { data: session } = useSession();

  const handleClick = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ userEmail: session?.user?.email }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <button onClick={handleClick} className="bg-blue-600 text-white px-6 py-2 rounded">
      Get Premium
    </button>
  );
}
