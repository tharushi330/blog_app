'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export default function FomeCreate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [user, setUser] = useState<User | null>(null);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  useEffect(() => {
    if (postId) {
      supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()
        .then(({ data }) => {
          if (data) {
            setDescription(data.description);
            setExistingImage(data.image_url);
            setImagePreview(data.image_url);
            setIsPremium(data.is_premium ?? false);
          }
        });
    }
  }, [postId]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let image_url = existingImage;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('postimage')
          .upload(fileName, imageFile);

        if (uploadError) throw new Error('Image upload failed.');

        const { data: publicData } = supabase.storage
          .from('postimage')
          .getPublicUrl(fileName);

        image_url = publicData?.publicUrl || null;
      }

      if (postId) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ description, image_url, is_premium: isPremium })
          .eq('id', postId);

        if (updateError) {
          console.error('Update Error:', updateError);
          throw new Error('Update failed.');
        }

        alert('Post updated successfully!');
      } else {
        if (!user) throw new Error('User not found');

        const { error: insertError } = await supabase.from('posts').insert([
          {
            user_id: user.id,
            description,
            image_url,
            is_premium: isPremium,
          },
        ]);

        if (insertError) {
          console.error('Insert Error:', insertError); 
          throw new Error('Post creation failed.');
        }

        alert('Post created successfully!');
      }

      
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      setExistingImage(null);
      setIsPremium(false);

      
      router.push('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          {postId ? 'Edit Post' : 'Create a Post'}
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
            {postId ? 'Replace image (optional)' : 'Upload an image (required)'}
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-gray-700 file:border file:border-gray-300 file:rounded file:px-3 file:py-2 file:text-sm file:cursor-pointer file:bg-white file:hover:bg-blue-50 transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="premium"
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="premium" className="text-sm text-gray-700">
            Mark as Premium Post
          </label>
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
          {loading
            ? postId
              ? 'Updating...'
              : 'Posting...'
            : postId
            ? 'Update Post'
            : 'Post'}
        </button>
      </form>
    </div>
  );
}
