import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRightCircle,
  ArrowLeftCircle,
} from 'lucide-react';
import { current } from '../utils';
import imageThree from '../assets/images/blog images/blog 3.png';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

const ROOT = current;

const BlogSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId, blogPosts, blogIndex } = location.state || {};

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch the blog post data based on postId
    const fetchPost = async () => {
      try {
        const response = await fetch(`${ROOT}blogs/${postId}`);
        const data = await response.json();
        setPost(data.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };
    if (postId) {
      fetchPost();
    }
    setLoading(false);
  }, [postId]);

  return (
    <div className="bg-white min-h-screen">
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <img
          src={post ? post.main_image : imageThree}
          alt="Bidding Strategies Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div
            onClick={() => navigate('/blog')}
            className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer text-sm text-gray-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <button>Back</button>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {post ? post.title : 'Loading...'}
          </h1>

          {/* Date & Read Time */}
          <div className="flex items-center gap-4 text-sm text-gray-200">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {post
                  ? new Date(post.created_at).toLocaleDateString()
                  : new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                {post ? `${post.estimated_reading_time / 60} min` : '0 sec'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse max-w-5xl mx-auto py-20 px-6">
          <div className="h-0.5 bg-gray-200 mb-12"></div>

          <div className="space-y-20">
            <div className="h-10 bg-gray-200 rounded-lg w-12/14 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-12/14 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-12/14 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-12/14 mx-auto"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-12/14 mx-auto"></div>
          </div>
        </div>
      ) : (
        <div className="prose prose-lg max-w-5xl mx-auto py-20 px-6">
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            remarkPlugins={[remarkGfm]}
          >
            {post ? post.content : ''}
          </ReactMarkdown>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => {
              if (blogIndex > 0 && blogPosts[blogIndex - 1]) {
                navigate('/bgsection', {
                  state: {
                    postId: blogPosts[blogIndex - 1]?.id,
                    blogPosts: blogPosts,
                    blogIndex: blogIndex - 1,
                  },
                });
              }
            }}
            className={`${
              blogIndex > 0 && blogPosts[blogIndex - 1] ? 'disabled' : ''
            } border border-gray-200 rounded-md py-4 px-5 text-left hover:bg-gray-50 transition`}
          >
            <div className="flex items-center gap-2 text-maroon mb-1 text-sm font-medium">
              <ArrowLeftCircle className="w-4 h-4" />
              <span>Previous</span>
            </div>
            <p className="font-semibold text-gray-800">
              {blogPosts[blogIndex - 1]?.title}
            </p>
          </button>

          <button
            onClick={() => {
              if (blogPosts[blogIndex + 1]) {
                navigate('/bgsection', {
                  state: {
                    postId: blogPosts[blogIndex + 1]?.id,
                    blogPosts: blogPosts,
                    blogIndex: blogIndex + 1,
                  },
                });
              }
            }}
            className={`${
              blogPosts[blogIndex + 1] ? 'disabled' : ''
            } border border-gray-200 rounded-md py-4 px-5 text-right hover:bg-gray-50 transition`}
          >
            <div className="flex items-center justify-end gap-2 text-maroon mb-1 text-sm font-medium">
              <span>Next</span>
              <ArrowRightCircle className="w-4 h-4" />
            </div>
            <p className="font-semibold text-gray-800">
              {blogPosts[blogIndex + 1]?.title}
            </p>
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 md:p-8 bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Leave a comment
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Your email address will not be published. Required fields are marked
            *
          </p>

          <form className="space-y-6">
            <textarea
              rows="5"
              placeholder="Your comment"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-maroon resize-none"
              required
            ></textarea>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name *"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-maroon"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-maroon"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Website"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-maroon"
            />

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" id="save-info" className="accent-maroon" />
              <label htmlFor="save-info">
                Save my name, email, and website in this browser for the next
                time I comment.
              </label>
            </div>

            <button
              type="submit"
              className="bg-maroon text-white px-6 py-2 rounded-md hover:bg-[#741d2a] transition"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
