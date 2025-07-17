'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardContent({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', userId)
        .single();

      setPosts(postsData || []);
      setIsPremium(profileData?.is_premium || false);
      setLoading(false);
    };

    fetchData();
  }, [userId, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/dashboard/new">Create New Post</Link>
          </Button>
          {!isPremium && (
            <Button onClick={() => router.push('/subscribe')}>
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Subscription Status</h2>
        <p>
          {isPremium ? (
            <span className="text-green-600">Premium Member</span>
          ) : (
            <span className="text-gray-600">Free Member</span>
          )}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
        {posts.length === 0 ? (
          <p>You haven't created any posts yet.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.visibility === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {post.visibility}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/edit/${post.id}`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={async () => {
                      await supabase.from('posts').delete().eq('id', post.id);
                      setPosts(posts.filter(p => p.id !== post.id));
                    }}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}