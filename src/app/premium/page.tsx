import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function PremiumPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('users')
    .select('is_premium')
    .eq('id', user?.id)
    .single();

  if (!profile?.is_premium) {
    return <div>You must purchase Premium to view this page.</div>;
  }

  return (
    <div>
      <h1>🎉 Welcome to Premium Content</h1>
      <p>Here is your exclusive premium content!</p>
    </div>
  );
}
