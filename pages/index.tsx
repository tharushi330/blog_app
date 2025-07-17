'use client';

import { useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

type Post = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  visibility: string;
};

export default function Home() {
  const user = useUser();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('visibility', 'free')
          .order('created_at', { ascending: false })
          .limit(3);

        if (fetchError) throw fetchError;
        setFeaturedPosts((data as Post[]) ?? []);
      } catch (err: any) {
        console.error('Fetch posts error', err);
        setError(err.message || 'Failed to load featured posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
      {/* Hero */}
      <section className="py-20 text-center px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
          Welcome to <span className="text-purple-600">BlogVerse</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
          {user ? 'Dive into personalized premium content crafted just for you.' : 'Read amazing content or sign up to explore more!'}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-purple-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full hover:bg-indigo-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">🌟 Featured Posts</h2>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white h-64 rounded-xl animate-pulse shadow-inner" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map(post => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="bg-white border border-purple-100 p-6 rounded-xl shadow hover:shadow-xl hover:border-purple-300 transition"
              >
                <h3 className="text-xl font-semibold text-purple-900 mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
                <p className="text-gray-700 text-sm line-clamp-3">{post.content.substring(0, 150)}...</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Premium */}
      {!user && (
        <section className="bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 py-16 px-4 mt-12 rounded-3xl shadow-md text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">🚀 Unlock Premium</h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Enjoy exclusive articles, tools, and a premium reading experience.
          </p>
          <Link
            href="/subscribe"
            className="bg-purple-700 text-white px-6 py-3 rounded-full hover:bg-purple-800 transition"
          >
            Learn More
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 text-center py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} BlogVerse. All rights reserved.
      </footer>
    </main>
  );
}
