'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function FomeCreate() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) router.push('/login');
      else setUser(data.user);
    });
  }, [router]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!imageFile) {
      setError('Image is required');
      setLoading(false);
      return;
    }

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('postimage')
        .upload(fileName, imageFile);

      if (uploadError) throw new Error('Image upload failed: ' + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('postimage')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          description,
          image_url: publicUrl,
        });

      if (insertError) throw new Error('Failed to create post: ' + insertError.message);

      setDescription('');
      setImageFile(null);
      setError('');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-12">
      <form
        onSubmit={handlePost}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Create a Post
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded text-center font-medium">
            {error}
          </p>
        )}

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a description..."
          required
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div>
          <label
            htmlFor="imageUpload"
            className="block mb-2 font-medium text-gray-700 cursor-pointer"
          >
            Upload an image <span className="text-gray-400">(required)</span>
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            required
            className="block w-full text-gray-700 file:border file:border-gray-300 file:rounded file:px-3 file:py-2 file:text-sm file:cursor-pointer file:bg-white file:hover:bg-blue-50 transition"
          />
        </div>

        {imagePreview && (
          <div className="mt-4">
            <p className="mb-2 text-gray-600 font-medium">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Selected image preview"
              className="w-full rounded-lg shadow-sm object-cover max-h-64"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}
