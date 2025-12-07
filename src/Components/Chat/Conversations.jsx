import { useEffect, useState, useCallback, useRef } from 'react';
import { current, Fetch } from '../../utils';
import PropTypes from 'prop-types';
import useAuthStore from '../../Store/AuthStore';
import { MessageCircle, User, CheckCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Conversations = ({ setChatId, showModal }) => {
  const ConvoRef = useRef(null);

  const identity = useAuthStore((state) => state.data);
  const [conversations, setConversations] = useState([]);

  const fetchConversations = useCallback(async () => {
    try {
      const { data, error } = await Fetch({
        url: `${current}users/chats`,
        method: 'GET',
      });

      if (error) {
        throw error;
      }
      setConversations(data.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations. Please try again later.');
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations, conversations]);

  const getLastMessage = (conversation) => {
    if (!conversation || conversation.length === 0) return null;
    return conversation[conversation.length - 1];
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 24 hours
    if (diff < 86400000) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }

    // Less than 7 days
    if (diff < 604800000) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }

    // Older
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getUnreadCount = (conversation) => {
    if (!conversation) return 0;
    return conversation.filter(
      (msg) => msg.sender_id !== identity?.id && msg.status !== 'read',
    ).length;
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <section
      ref={ConvoRef}
      className="flex flex-col rounded-t-3xl fixed bg-white bottom-0 right-0 w-[30%] z-50 shadow-2xl max-h-[80vh]"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#9f3247] to-[#b83d56] text-white rounded-t-3xl font-bold p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <span className="flex gap-2 items-center text-lg">
          <MessageCircle size={22} />
          <span>Conversations</span>
        </span>
        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
          {conversations.length}
        </span>
      </div>

      {/* Conversations List */}
      <div className="overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gray-100 rounded-full p-6 mb-4">
              <MessageCircle size={48} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-500">
              Close an auction deal to see your conversations here
            </p>
          </div>
        ) : (
          conversations.map((convo) => {
            const lastMsg = getLastMessage(convo.conversation);
            const unreadCount = getUnreadCount(convo.conversation);
            const isFromCurrentUser = lastMsg?.sender_id === identity?.id;

            return (
              <div
                key={convo.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                onClick={() => {
                  setChatId(convo.id);
                  showModal('chat');
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9f3247] to-[#b83d56] flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-shadow">
                      <User size={24} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">
                        Auction #{convo.auctions_id.slice(0, 8)}
                      </h4>
                      {lastMsg && (
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTimestamp(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>

                    {lastMsg ? (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                          {isFromCurrentUser && (
                            <CheckCheck
                              size={14}
                              className="text-blue-500 flex-shrink-0"
                            />
                          )}
                          <span
                            className={
                              unreadCount > 0 && !isFromCurrentUser
                                ? 'font-semibold text-gray-900'
                                : ''
                            }
                          >
                            {truncateMessage(lastMsg.message)}
                          </span>
                        </p>
                        {unreadCount > 0 && (
                          <span className="bg-[#9f3247] text-white text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 min-w-[20px] text-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No messages yet
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          lastMsg?.sender_type === 'seller'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {lastMsg?.sender_type || 'No activity'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MessageCircle size={12} />
                        {convo.conversation?.length || 0} messages
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

Conversations.propTypes = {
  setChatId: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
};

export default Conversations;
