import Link from 'next/link';

export default function PostCard({ post }: any) {
  const preview = post?.content ? post.content.slice(0, 100) + '...' : 'No content available';

  return (
    <Link href={`/post/${post.id}`}>
      <div className="border p-4 rounded shadow hover:shadow-md">
        <h3 className="text-xl font-semibold">{post.title || 'Untitled'}</h3>
        <p className="text-gray-600">{preview}</p>
      </div>
    </Link>
  );
}
