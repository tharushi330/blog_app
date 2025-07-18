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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (search = '') => {
    setLoading(true);
    let query = supabase.from('posts').select('*').order('id', { ascending: false });

    if (search.trim() !== '') {
      query = query.ilike('description', `%${search}%`); // search in description column
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPosts(searchTerm);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">Welcome to BlogApp</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Discover amazing content from talented writers. Join our community of readers and creators.
          </p>
        </header>

        {/* Search box */}
        <form onSubmit={handleSearch} className="mb-8 flex justify-center max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search posts by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

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
