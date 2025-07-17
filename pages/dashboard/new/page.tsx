import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import NewPostForm from './NewPostForm';

export default async function NewPostPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <NewPostForm userId={user.id} />;
}