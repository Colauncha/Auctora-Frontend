import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Mail, Check } from 'lucide-react';

const NewsLetterModal = ({
  isOpen = true,
  parentEmail,
  onClose = () => {},
}) => {
  const [email, setEmail] = useState('');
  const [all, setAll] = useState(true);
  const [campaigns, setCampaigns] = useState({
    updates: true,
    marketing: true,
    announcements: true,
    newsletters: true,
    seasonal: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (parentEmail) {
      setEmail(parentEmail);
    }
  }, [parentEmail]);

  const campaignLabels = {
    updates: 'Product Updates',
    marketing: 'Marketing & Promotions',
    announcements: 'Important Announcements',
    newsletters: 'Weekly Newsletters',
    seasonal: 'Seasonal Offers',
  };

  const handleCampaignChange = (campaign) => {
    const tempCampaigns = { ...campaigns };
    tempCampaigns[campaign] = !tempCampaigns[campaign];
    setCampaigns(tempCampaigns);

    if (Object.values(tempCampaigns).some((value) => value === false)) {
      setAll(false);
    } else {
      setAll(true);
    }
  };

  const handleAll = () => {
    const newValue = !all;
    setAll(newValue);
    if (newValue) {
      setCampaigns({
        updates: newValue,
        marketing: newValue,
        announcements: newValue,
        newsletters: newValue,
        seasonal: newValue,
      });
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://news-letter-middle-app.vercel.app/api/subscribers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-clientname': 'BIDDIUS',
          },
          body: JSON.stringify({
            email,
            campaigns,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to subscribe. Please try again.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email && Object.values(campaigns).some(Boolean);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#9f3248] to-[#de506d] py-4 px-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Stay Updated</h2>
              <p className="text-blue-100 text-sm">
                Subscribe to our newsletter
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 px-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Successfully Subscribed!
              </h3>
              <p className="text-gray-600">
                Thank you for subscribing to our newsletter.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Campaign Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to receive?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={all}
                      onChange={handleAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">All</span>
                  </label>
                  {Object.entries(campaignLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={campaigns[key]}
                        onChange={() => handleCampaignChange(key)}
                        className="w-4 h-4 text-[#de506d] border-gray-300 rounded focus:ring-[#de506d]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
                className="cursor-pointer w-full bg-gradient-to-r from-[#9f3248] to-[#de506d] text-white py-3 px-6 rounded-lg font-medium hover:from-[#de506d] hover:to-[#9f3248] focus:ring-2 focus:ring-[#9f3248] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe to Newsletter'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                You can unsubscribe at any time. We respect your privacy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NewsLetterModal.propTypes = {
  isOpen: PropTypes.bool,
  parentEmail: PropTypes.string,
  onClose: PropTypes.func,
};

export default NewsLetterModal;
