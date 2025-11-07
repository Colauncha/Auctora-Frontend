import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imageOne from '../assets/images/blog images/blog 1.png';
import imageTwo from '../assets/images/blog images/blog 2.png';
import { current } from '../utils';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

const ROOT = current;

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { name: 'All', count: 0, active: true },
    { name: 'Auction Strategy', count: 0 },
    { name: 'Best Practices', count: 0 },
    { name: 'Platform Updates', count: 0 },
    { name: 'Case Studies', count: 0 },
  ];

  const fallbackPosts = useMemo(() => {
    [
      {
        id: 1,
        title: 'Bidding Strategies for 2025',
        category: 'Auction Strategy',
        date: 'Oct 15, 2025',
        readTime: '8 min read',
        description:
          'Discover the latest techniques and strategies to maximize your success in online auctions. Learn from industry experts and real-world case studies.',
        image: imageTwo,
        content: 'Full content here...',
      },
      {
        id: 2,
        title: 'Mastering Bid Timing for Success',
        category: 'Best Practices',
        date: 'Oct 20, 2025',
        readTime: '6 min read',
        description:
          "Timing your bids perfectly can make a big difference in auctions. Here's how to plan your strategy for maximum efficiency.",
        image: imageTwo,
        content: 'Full content here...',
      },
      {
        id: 3,
        title: 'Understanding Platform Fees',
        category: 'Platform Updates',
        date: 'Oct 25, 2025',
        readTime: '5 min read',
        description:
          'Stay informed about the latest changes in auction platform fees and how to make them work to your advantage.',
        image: imageTwo,
        content: 'Full content here...',
      },
    ];
  }, []);

  const getSafePosts = () => {
    if (Array.isArray(blogs) && blogs.length > 0) {
      return blogs;
    }
    return fallbackPosts;
  };

  const getSafeFeaturedPost = () => {
    if (featuredPost) {
      return featuredPost;
    }
    const safePosts = getSafePosts();
    return safePosts[0] || fallbackPosts[0];
  };

  const getSafeDisplayPosts = () => {
    const safePosts = getSafePosts();
    if (safePosts.length <= 1) {
      return fallbackPosts.slice(0);
    }
    return safePosts.slice(0);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log('Fetching blogs from API...');

        const response = await fetch(`${ROOT}blogs`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        let blogsArray = [];

        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data && Array.isArray(data.blogs)) {
          blogsArray = data.blogs;
        } else if (data && Array.isArray(data.data)) {
          blogsArray = data.data;
        } else if (data && data.data && Array.isArray(data.data.blogs)) {
          blogsArray = data.data.blogs;
        } else {
          console.warn(
            'Unexpected API response structure, using fallback data',
          );
          blogsArray = fallbackPosts;
        }

        setBlogs(blogsArray);

        if (blogsArray.length > 0) {
          setFeaturedPost(blogsArray[blogsArray.length - 1]);
        } else {
          setFeaturedPost(fallbackPosts[0]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);

        setBlogs(fallbackPosts);
        setFeaturedPost(fallbackPosts[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [fallbackPosts]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (err) {
      console.error(err);
      return 'Invalid date';
    }
  };

  const calculateReadingTime = (content) => {
    if (!content) return '5 min read';
    try {
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length || 0;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    } catch (err) {
      console.error(err);
      return '5 min read';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F2F0F1] min-h-screen py-10 px-4 md:px-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e1a28] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  const currentFeaturedPost = getSafeFeaturedPost();
  const displayPosts = getSafeDisplayPosts();

  if (error) {
    return (
      <div className="bg-[#F2F0F1] min-h-screen py-10 px-4 md:px-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-maroon mb-4">
            Oops! Something went wrong.
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an error while fetching the blog posts.
          </p>
          <p className="text-red-500">Error: {error}</p>
          <button
            className="mt-6 px-6 py-2 bg-maroon text-white rounded hover:bg-dark-maroon"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F0F1] min-h-screen py-10 px-4 md:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-2">
          Biddius Blog
        </h1>
        <p className="text-gray-700 mb-8">
          Insights, strategies, and updates from the world of online auctions
          and bidding.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-200 mb-16">
          <div
            onClick={() =>
              navigate('/bgsection', {
                state: {
                  postId: currentFeaturedPost.id,
                  blogPosts: displayPosts,
                  blogIndex: displayPosts.length - 1,
                },
              })
            }
            className="grid md:grid-cols-2"
          >
            <div className="w-full h-full">
              <img
                src={currentFeaturedPost.main_image || imageOne}
                alt={currentFeaturedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 flex flex-col justify-center">
              <span className="bg-[#5e1a28] text-white text-xs uppercase px-3 py-1 rounded-full w-fit mb-3">
                {currentFeaturedPost.category || 'Auction Strategy'}
              </span>
              <h3 className="text-2xl font-bold text-maroon mb-3">
                {currentFeaturedPost.title}
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                >
                  {currentFeaturedPost.content?.substring(0, 50) + '...'}
                </ReactMarkdown>
              </p>

              <div className="flex items-center text-gray-500 text-sm gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(
                      currentFeaturedPost.created_at ||
                        currentFeaturedPost.date,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {calculateReadingTime(currentFeaturedPost.content)}
                  </span>
                </div>
              </div>

              <button
                className="text-maroon font-medium hover:underline w-fit"
                onClick={() =>
                  navigate('/bgsection', {
                    state: {
                      postId: currentFeaturedPost.id,
                      blogPosts: displayPosts,
                      blogIndex: displayPosts.length - 1,
                    },
                  })
                }
              >
                Read More
              </button>
            </div>
          </div>
        </div>

        <div className="w-screen bg-white py-12 px-4 md:px-20 relative left-[50%] right-[50%] -mx-[50vw]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Categories</h2>
            <div className="flex flex-wrap gap-3 mb-10">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    cat.active
                      ? 'bg-[#5e1a28] text-white border-[#5e1a28]'
                      : 'border-gray-400 text-gray-700 hover:bg-[#5e1a28] hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {displayPosts.map((post, index) => (
                <div
                  key={post.id || index}
                  onClick={() =>
                    navigate('/bgsection', {
                      state: {
                        postId: post.id,
                        blogPosts: displayPosts,
                        blogIndex: index,
                      },
                    })
                  }
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-gray-200 overflow-hidden"
                >
                  <img
                    src={post.main_image || imageTwo}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <span className="bg-[#5e1a28] text-white text-xs uppercase px-3 py-1 rounded-full w-fit mb-3 block">
                      {post.category || 'Auction Strategy'}
                    </span>
                    <h3 className="text-lg font-bold text-maroon mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        remarkPlugins={[remarkGfm]}
                      >
                        {post.content?.substring(0, 50) + '...'}
                      </ReactMarkdown>
                    </p>
                    <div className="flex items-center text-gray-500 text-sm gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at || post.date)}</span>
                      </div>{' '}
                      •{' '}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadingTime(post.content)} </span>
                      </div>{' '}
                      •{' '}
                      <div className="flex items-center gap-1">
                        {post.author?.first_name}{' '}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
