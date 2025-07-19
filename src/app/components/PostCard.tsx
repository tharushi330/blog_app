'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Post {
  id: number | string;
  description: string;
  image_url: string;
  user_id: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error('Error fetching user:', error.message);
          setUserId(null);
          return;
        }

        setUserId(user?.id ?? null);
      } catch (e) {
        console.error('Unexpected error fetching user:', e);
        setUserId(null);
      }
    }

    fetchUser();
  }, []);

  const isOwner = userId === post.user_id;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <img
        src={post.image_url || '/placeholder.jpg'}
        alt="Post image"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1">
        <p className="text-gray-700">{post.description}</p>
      </div>

      {isOwner && (
        <div className="px-4 pb-4">
          <Link href={`/formcreate?id=${post.id}`}>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
