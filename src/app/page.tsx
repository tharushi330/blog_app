'use client';

import { useEffect, useState } from 'react';
import PostCard from './components/PostCard';
import { supabase } from '../app/lib/supabaseClient';

interface Post {
  id: string;
  description: string;
  image_url: string;
  user_id: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('posts').select('*').order('id', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">Welcome to BlogPub</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Discover amazing content from talented writers. Join our community of readers and creators.
          </p>
        </header>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">No posts found.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
