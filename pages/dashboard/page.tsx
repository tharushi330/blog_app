import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({
    cookies: () => cookieStore
  })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/signin')
  }

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return <div>Error loading posts</div>
  }

  return (
    <div>
      <h1 className="mb-8 font-bold text-3xl">Your Posts</h1>
      <div className="gap-6 grid">
        {posts?.map((post) => (
          <article key={post.id} className="p-6 border rounded-lg">
            <h2 className="mb-2 font-bold text-2xl">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mb-4 text-gray-600">
              {post.content.substring(0, 200)}...
            </p>
            <p className="text-gray-500 text-sm">
              Status: {post.published ? 'Published' : 'Draft'}
            </p>
          </article>
        ))}
        {(!posts || posts.length === 0) && (
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        )}
      </div>
    </div>
  )
}