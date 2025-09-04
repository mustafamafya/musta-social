import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [formData, setFormData] = useState({ subject: '', content: '', image: null });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
const res = await fetch(`http://localhost:8000/api/v1/posts/?page=${page}`);     
const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...data.results]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom) fetchPosts();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.content) return;

    setSubmitting(true);
    const payload = new FormData();
    payload.append('subject', formData.subject);
    payload.append('content', formData.content);
    if (formData.image) payload.append('image', formData.image);

    try {
      const res = await fetch('http://localhost:8000/api/v1/posts/', {
        method: 'POST',
        body: payload,
      });
      const data = await res.json();
      setPosts(prev => [data, ...prev]);
      setFormData({ subject: '', content: '', image: null });
      setPreview(null);
    } catch (err) {
      console.error('Post creation failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn px-6 py-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
      {/* 📝 Post Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-purple-300 rounded-xl shadow-md p-6 mb-10 max-w-2xl mx-auto transition-all hover:shadow-xl"
      >
        <h2 className="text-3xl font-bold text-musta-purple mb-6 text-center">
          ✨ What do you wanna share with the world?
        </h2>

        <input
          type="text"
          name="subject"
          placeholder="Give your post a catchy subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <textarea
          name="content"
          placeholder="Write something inspiring, funny, or bold..."
          value={formData.content}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 h-32 resize-none"
        />

        <label className="block mb-4 text-sm font-medium text-purple-700">
          📸 Add an image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
          />
        </label>

        {preview && (
          <div className="mb-4 text-center">
            <img src={preview} alt="Preview" className="rounded-lg shadow-md max-h-64 mx-auto mb-2" />
            <button
              type="button"
              onClick={clearImage}
              className="text-sm text-red-500 hover:underline"
            >
              ❌ Remove image
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {submitting ? 'Sharing...' : 'Share with the world 🌍'}
        </button>
      </form>

      {/* 📰 Post Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-purple-200 rounded-xl shadow-lg p-6 transition-transform hover:scale-[1.02] hover:shadow-xl hover:border-purple-400"
          >
            <h3 className="text-xl font-bold text-purple-700 mb-1">{post.subject}</h3>
            <p className="text-sm text-gray-600 mb-2">By <span className="font-semibold">{post.author}</span></p>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>

            {post.image && (
              <img
                src={`http://localhost:8000${post.image}`}
                alt="Post"
                className="rounded-md mb-3 max-h-48 w-full object-cover"
              />
            )}

            <div className="text-sm text-gray-500 mb-2">
              ❤️ {post.total_likes} {post.total_likes === 1 ? 'like' : 'likes'}
            </div>

            <div className="mt-4 space-y-2">
              {post.comments.map((comment) => (
                <div key={comment.id} className="border-t pt-2 text-sm text-gray-800">
                  <strong>{comment.user}</strong>: {comment.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-6 text-purple-500 animate-pulse">
          🔄 Loading more posts...
        </div>
      )}

      {!hasMore && (
        <div className="text-center py-6 text-gray-400">
          🎉 You’ve reached the end of the feed.
        </div>
      )}
    </div>
  );
}