import { useState, useEffect, useCallback } from 'react';
import { Rss, PlusCircle, Trash2, Edit3, Eye } from 'lucide-react';
import { current } from '../../../utils';
import Loader from '../../../assets/loaderWhite';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

const BlogAdmin = () => {
  const tabs = [
    { label: 'Add', icon: PlusCircle },
    { label: 'List', icon: Rss },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [bannerImage, setBannerImage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(4); // you can change default size
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // -------------------------------
  // Fetch blogs (with pagination)
  // -------------------------------
  const fetchBlogs = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${current}blogs?page=${pageNum}&limit=${pageSize}`,
        );
        const json = await res.json();

        if (json.success) {
          setBlogs(json.data);
          // handle pagination if provided by API
          setTotalCount(json.count);
          setTotalPages(json.total);
        } else {
          setError(json.message || 'Failed to load blogs');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch blogs.');
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    if (activeTab.label === 'List') fetchBlogs(page);
  }, [activeTab, page, fetchBlogs]);

  // -------------------------------
  // Handle image upload
  // -------------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setBannerImage(file);
  };

  // -------------------------------
  // Handle blog deletion
  // -------------------------------
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await fetch(`${current}blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (json.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        alert('Blog deleted successfully');
      } else alert('Delete failed');
    } catch (err) {
      console.error(err);
      alert('Error deleting blog');
    }
  };

  // -------------------------------
  // Handle preview select
  // -------------------------------
  const handlePreview = (blog) => setSelectedBlog(blog);

  // -------------------------------
  // Add Blog (placeholder)
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('main_image', bannerImage);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('estimated_reading_time', readTime);

    try {
      const resp = await fetch(`${current}blogs`, {
        credentials: 'include',
        method: 'POST',
        body: formData,
      });

      const json = await resp.json();
      if (!json.success)
        throw new Error(json.message || 'Failed to create blog');

      alert('Blog created successfully');
      setTitle('');
      setContent('');
      setReadTime('');
      setBannerImage(null);
    } catch (error) {
      console.error(error);
      alert('Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Pagination Controls
  // -------------------------------
  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  //--------------------------------
  // Read time estimation helper
  //--------------------------------
  const estimateReadTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil((words / wordsPerMinute) * 60); // in seconds
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab.label === tab.label
                ? 'bg-[#9f3248] text-white'
                : 'bg-white border text-gray-600 hover:bg-blue-50'
            }`}
            onClick={() => {
              setActiveTab(tab);
              setSelectedBlog(null);
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ADD BLOG */}
      {activeTab.label === 'Add' && (
        <section className="w-full bg-white shadow-xl rounded-lg p-6">
          {/* Banner Upload */}
          <div className="mb-6">
            {bannerImage ? (
              <div className="relative group w-full h-40">
                <img
                  src={URL.createObjectURL(bannerImage)}
                  alt="Banner"
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition">
                  <label
                    htmlFor="mainImage"
                    className="flex flex-col items-center cursor-pointer text-white"
                  >
                    <PlusCircle size={24} />
                    <span>Change Image</span>
                  </label>
                  <input
                    id="mainImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            ) : (
              <label
                htmlFor="mainImage"
                className="w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-200 transition"
              >
                <input
                  id="mainImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <PlusCircle className="text-gray-400" size={30} />
                <span className="text-gray-500 mt-2">Upload Banner Image</span>
              </label>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 mb-8"
          >
            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1">Title</label>
              <input
                type="text"
                className="border rounded-md px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1">
                Estimated Reading Time (seconds)
              </label>
              <input
                type="number"
                className="border rounded-md px-3 py-2 w-40"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-medium text-sm mb-1">
                Content (Markdown)
              </label>
              <textarea
                rows={8}
                className="border rounded-md p-3 font-mono"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setReadTime(estimateReadTime(e.target.value));
                }}
                placeholder="Write your markdown content..."
              />
            </div>

            <button
              type="submit"
              className="bg-[#9f3248] text-white py-2 px-4 rounded-md hover:bg-[#9f3248d3] self-start"
            >
              {loading ? <Loader /> : 'Publish Blog'}
            </button>
          </form>

          {/* Markdown Preview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Preview</h3>
            <div className="prose max-w-none border p-4 rounded-md bg-gray-50">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
              >
                {content || 'Start writing to see preview...'}
              </ReactMarkdown>
            </div>
          </div>
        </section>
      )}

      {/* LIST BLOGS */}
      {activeTab.label === 'List' && (
        <section className="bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Blog List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : blogs.length === 0 ? (
            <p>No blogs found.</p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="border rounded-md overflow-hidden bg-gray-50 shadow hover:shadow-md transition"
                  >
                    <img
                      src={blog.main_image}
                      alt={blog.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {blog.author?.first_name} •{' '}
                        {blog.estimated_reading_time}s
                      </p>
                      <div className="flex gap-3">
                        <button
                          className="flex items-center gap-1 text-blue-600"
                          onClick={() => handlePreview(blog)}
                        >
                          <Eye size={16} /> View
                        </button>
                        <button className="flex items-center gap-1 text-green-600">
                          <Edit3 size={16} /> Edit
                        </button>
                        <button
                          className="flex items-center gap-1 text-red-600"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md border ${
                    page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>

                <p className="text-sm text-gray-600">
                  Page {page} of {totalPages} ({totalCount} blogs)
                </p>

                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-md border ${
                    page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Preview Selected Blog */}
          {selectedBlog && (
            <div className="mt-10 border-t pt-6">
              <h3 className="text-xl font-semibold mb-3">
                {selectedBlog.title}
              </h3>
              <div className="prose max-w-auto">
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                >
                  {selectedBlog.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BlogAdmin;
