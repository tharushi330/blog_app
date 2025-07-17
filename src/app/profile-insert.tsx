'use client';

import { useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

export default function ProfileInsertOnLogin() {
  useEffect(() => {
    const insertProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
        });
      }
    };

    insertProfile();
  }, []);

  return null;
}
