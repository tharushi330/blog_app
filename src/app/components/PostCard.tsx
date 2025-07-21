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
  is_premium: boolean;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

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

  const handleDelete = async () => {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      alert('Failed to delete the post: ' + error.message);
    } else {
      alert('Post deleted successfully!');
      setIsDeleted(true); 
    }
  };

  if (isDeleted) return null;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <img
        src={post.image_url || '/placeholder.jpg'}
        alt="Post image"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-1">
        {post.is_premium && (
          <span className="inline-block mb-2 px-2 py-1 bg-yellow-300 text-yellow-900 text-xs font-semibold rounded">
            Premium
          </span>
        )}
        <p className="text-gray-700">{post.description}</p>
      </div>

      {isOwner && (
        <div className="px-4 pb-4 flex gap-2">
          <Link href={`/formcreate?id=${post.id}`}>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
          </Link>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
