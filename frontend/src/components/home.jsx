import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // comment UI state
  const [activePostId, setActivePostId] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // post form state
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // 1) Fetch posts with JWT + safe-length check
  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/login');

    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/posts/?page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          return navigate('/login');
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const postsArray = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];

      if (postsArray.length === 0) {
        setHasMore(false);
      } else {
        // ensure each post has a comments array and is_liked flag
        const normalized = postsArray.map(p => ({
          ...p,
          comments: Array.isArray(p.comments) ? p.comments : [],
          is_liked: p.is_liked ?? false
        }));
        setPosts(prev => [...prev, ...normalized]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  fetchPosts(); // this runs on page load
}, []);
  // 2) Toggle like/unlike
  const handleToggleLike = async postId => {
    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/login');

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const willLike = !post.is_liked;
    const updatedCount = willLike ? post.total_likes + 1 : post.total_likes - 1;

    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, is_liked: willLike, total_likes: updatedCount }
          : p
      )
    );

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/like/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      console.error('Like toggle failed:', err);
      // rollback
      setPosts(prev =>
        prev.map(p => (p.id === postId ? post : p))
      );
    }
  };

  // 3) Toggle comment panel
  const handleToggleComments = postId => {
    if (activePostId === postId) {
      setActivePostId(null);
      setCommentInput('');
    } else {
      setActivePostId(postId);
      setCommentInput('');
    }
  };

  // 4) Submit a new comment
  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/login');

    setSubmittingComment(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/posts/${postId}/comment/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content: commentInput.trim() })
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const newComment = await res.json();
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );
      setCommentInput('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

// --- replace your old handleSubmit with this ---
const handleSubmit = async e => {
  e.preventDefault();
  if (!formData.subject.trim() || !formData.content.trim()) return;

  const token = localStorage.getItem('access_token');
  if (!token) return navigate('/login');

  setSubmitting(true);

  let res;
  try {
    if (formData.image) {
      // multipart/form-data (only when an image is chosen)
      const payload = new FormData();
      payload.append('subject', formData.subject.trim());
      payload.append('content', formData.content.trim());
      payload.append('image', formData.image);

      res = await fetch('http://127.0.0.1:8000/api/v1/posts/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
          // do NOT set Content-Type here; the browser will add the correct boundary
        },
        body: payload
      });
    } else {
      // JSON payload (no image)
      res = await fetch('http://127.0.0.1:8000/api/v1/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: formData.subject.trim(),
          content: formData.content.trim()
        })
      });
    }

    if (!res.ok) {
      // log server‐side validation errors
      const err = await res.json().catch(() => null);
      console.error('Post creation error:', err || res.status);
      return;
    }

    const newPost = await res.json();
    setPosts(prev => [
      { ...newPost, comments: [], is_liked: false },
      ...prev
    ]);
    setFormData({ subject: '', content: '', image: null });
    setPreview(null);
  } catch (err) {
    console.error('Post creation failed:', err);
  } finally {
    setSubmitting(false);
  }
};
  // Initial load + infinite scroll
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        fetchPosts();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [page, hasMore]);

  // Form handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleImageChange = e => {
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

  return (
    <div className="flex flex-col items-center px-6 py-8 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
      {/* --- Create Post Form --- */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border border-purple-200 rounded-xl shadow-md p-6 mb-10 hover:shadow-lg transition"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          ✨ Share something today
        </h2>
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full mb-3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-300"
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Your content..."
          className="w-full mb-3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-300 h-24 resize-none"
        />
        <label className="block mb-3 text-sm text-purple-700">
          Image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </label>
        {preview && (
          <div className="mb-3 text-center">
            <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded" />
            <button
              type="button"
              onClick={clearImage}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Remove Image
            </button>
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    
      {/* --- Post Feed --- */}
      
      <div className="w-full max-w-md space-y-6">
        {posts.map(post => (
            console.log(post),
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-4">
                <img
                  src={post.author.profile_img}
                  alt={`${post.author.first_name} ${post.author.last_name}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-500 shadow-sm"
                />
                <div>
                  <p className="text-sm font-semibold text-purple-700">
                    {post.author.first_name} {post.author.last_name}
                  </p>
                </div>
              </div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">
              {post.subject}
            </h3>

            {/* image (if present) */}
            {post.image && (
              <div className="mb-4">
                <img
                  src={
                    post.image.startsWith('http')
                      ? post.image
                      : `http://127.0.0.1:8000${post.image}`
                  }
                  alt={post.subject}
                  className="w-full h-48 object-contain rounded-lg"
                />
              </div>
            )}

            <p className="text-gray-700 mb-4">{post.content}</p>

            {/* likes + comment count */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <button
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center space-x-1 ${
                  post.is_liked ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <span>❤️</span>
                <span>{post.total_likes}</span>
              </button>
              <button
                onClick={() => handleToggleComments(post.id)}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                Comment ({post.comments.length})
              </button>
            </div>

            {/* comments panel */}
            {activePostId === post.id && (
              <div className="mt-4 space-y-4 border-t pt-4">
                {/* existing comments */}
                {post.comments.map(c => (
                  <div key={c.id} className="text-sm text-gray-800">
                    <span className="font-semibold">{c.user}</span>
                    : {c.content}
                  </div>
                ))}

                {/* add new comment */}
                <form onSubmit={e => handleAddComment(e, post.id)} className="flex space-x-2">
                  <input
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-300"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="bg-purple-600 text-white px-4 rounded-md hover:bg-purple-700 transition"
                  >
                    {submittingComment ? '…' : 'Post'}
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="mt-6 text-purple-600 animate-pulse">Loading more...</div>
      )}
      {!hasMore && (
        <div className="mt-6 text-gray-400">You’ve reached the end!</div>
      )}
    </div>
  );
}
const handleNewPost = post => {
  setPosts(prev => [post, ...prev]);
};