'use client';

import Link from 'next/link';

interface PostCardProps {
    post: {
        id: string;
        description: string;
        image_url: string;
    };
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <img
                src={post.image_url}
                alt="Post image"
                className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1">
                <p className="text-gray-700">{post.description}</p>
            </div>
            <div className="px-4 pb-4">
                <Link href={`/formcreate?id=${post.id}`}>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
                        Edit
                    </button>
                </Link>

            
        </div>
    </div >
  );
}
