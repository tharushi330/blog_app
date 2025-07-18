interface PostCardProps {
    post: {
      id: string;
      description: string;
      image_url: string;
    };
  }
  
  export default function PostCard({ post }: PostCardProps) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <img
          src={post.image_url}
          alt="Post image"
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <p className="text-gray-700">{post.description}</p>
        </div>
      </div>
    );
  }
  