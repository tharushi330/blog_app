import PostCard from './components/PostCard';
import Image from 'next/image';

export default function HomePage() {
  const post = {
    id: '1',
    title: 'Welcome to My Blog',
    description: 'This is your first post. Excited to start writing!',
    imageUrl: 'https://via.placeholder.com/600x300',
  };

  const features = [
    {
      title: 'Free Content',
      description: 'Access a wide variety of free blog posts on technology, development, and more.',
      icon: '📖',
    },
    {
      title: 'Premium Articles',
      description: 'Unlock exclusive premium content with in-depth tutorials and advanced topics.',
      icon: '👑',
    },
    {
      title: 'Content Creation',
      description: 'Create and publish your own blog posts with our easy-to-use editor.',
      icon: '✍️',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-gray-800">Welcome to BlogPub</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Discover amazing content from talented writers. Join our community of readers and creators.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">Explore Blog</button>
            <button className="border px-6 py-2 rounded-md hover:bg-gray-100">Get Started</button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="border rounded-xl p-6 text-center shadow-sm hover:shadow-md bg-gray-50">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </section>

        <section>
          <PostCard post={post} />
        </section>
      </div>
    </main>
  );
}
