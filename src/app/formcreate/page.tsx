'use client';

import { Suspense } from 'react';
import FormCreateClient from './FormCreateClient';

export const dynamic = 'force-dynamic';

export default function FormCreatePage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-500">Loading form...</div>}>
      <FormCreateClient />
    </Suspense>
  );
}
