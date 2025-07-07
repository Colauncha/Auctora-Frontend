import { MailLetter } from '../../Constants';
import Loader from '../../assets/loaderWhite';
import { useState } from 'react';
import style from './css/ContactUs.module.css';
import { current } from '../../utils/links';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    from: '',
    subject: '',
    body: '',
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = `${current}misc/contact-us`;
    let data = {
      name: formData.name,
      email: formData.from,
      subject: formData.subject,
      message: formData.body,
    };
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resp = await response.json();

      if (!response.ok) {
        setLoading(false);
        throw new Error(`Error: ${resp.message} - ${resp.detail}`);
      }
      setFormData({ name: '', from: '', subject: '', body: '' });
      toast.success(resp.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start p-6 mb-20">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden mt-3 text-center">
        <div className="hidden md:flex flex-col w-full md:w-1/2 bg-gradient-to-br from-[#7B2334] to-[#9F3247] text-white items-center justify-center p-6">
          <img
            src={MailLetter}
            alt="Mail Letter"
            className={`w-2/5 h-auto ${style.image}`}
          />
          <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
          <p className="text-sm mt-2">
            We are here to help you. Please fill out the form and we will get
            back to you as soon as possible.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="text-left">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#9F3247]"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="mt-1 block w-full text-sm rounded-md border border-red-200 shadow-sm transition-all duration-300 p-2 focus:outline-[#9f3248]"
              />
            </div>
            <div className="text-left">
              <label
                htmlFor="from"
                className="block text-sm font-medium text-[#9F3247]"
              >
                From
              </label>
              <input
                type="email"
                name="from"
                id="from"
                value={formData.from}
                onChange={handleChange}
                required
                placeholder="yourmail@example.com"
                className="mt-1 block w-full text-sm rounded-md border border-red-200 shadow-sm transition-all duration-300 p-2 focus:outline-[#9f3248]"
              />
            </div>
            <div className="text-left">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-[#9F3247]"
              >
                Subject
              </label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Subject of your message"
                className="mt-1 block w-full text-sm rounded-md border border-red-200 shadow-sm transition-all duration-300 p-2 focus:outline-[#9f3248]"
              />
            </div>
            <div className="text-left">
              <label
                htmlFor="body"
                className="block text-sm font-medium text-[#9F3247]"
              >
                Message
              </label>
              <textarea
                name="body"
                id="body"
                rows="5"
                value={formData.body}
                onChange={handleChange}
                required
                placeholder="Write your message here..."
                className="mt-1 block w-full text-sm rounded-md border border-red-200 shadow-sm transition-all duration-300 p-2 focus:outline-[#9f3248]"
              ></textarea>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="inline-flex justify-center px-6 py-2 border border-transparent transition-all duration-300 text-sm font-medium rounded-md shadow-sm text-white bg-[#9F3247] hover:bg-[#bc4b61c6] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#bc4b61c6]"
              >
                {loading ? (
                  <Loader otherStyles="w-[20px] h-[20px] border-2 text-white animate-spin" />
                ) : (
                  'Send'
                )}
              </button>
              <button
                onClick={() =>
                  setFormData({ name: '', from: '', subject: '', body: '' })
                }
                type="button"
                disabled={loading}
                className="inline-flex justify-center ml-2 px-6 py-2 border border-transparent transition-all duration-300 text-sm font-medium rounded-md shadow-sm text-white bg-[#9F3247] hover:bg-[#bc4b61c6] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#bc4b61c6]"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
