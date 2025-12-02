import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  ChevronDown,
  ChevronUp,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useAuthStore from '../../Store/AuthStore';
import Bubble from './Bubble';
import { quickActionOptions, getStatusIcon } from './util';
import { toast } from 'react-toastify';

const ChatSection = ({ chatId, showState, showFunc, profileImage }) => {
  const token = JSON.parse(sessionStorage.getItem('websocket-allowance'));
  const identity = useAuthStore((s) => s.data);

  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [quickActions, setQuickActions] = useState(false);
  const [meta, setMeta] = useState({
    buyerId: '',
    sellerId: '',
    auctionId: '',
  });
  const [showMsgInfo, setShowMsgInfo] = useState(null);
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'

  const messagesEndRef = useRef(null);
  const chatSectionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (identity.id === meta.buyerId) {
      setUserType('buyer');
    } else if (identity.id === meta.sellerId) {
      setUserType('seller');
    }
  }, [meta, identity]);

  /** WebSocket Setup */
  useEffect(() => {
    if (!showState || !token) return;

    const ws = new WebSocket(`ws://localhost:8000/api/chats/ws/${chatId}`, [
      'auth',
      token,
    ]);
    setSocket(ws);

    ws.onopen = () => setOnline(true);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'new_message') {
          setMessages((p) => [...p, data.payload]);
        } else if (data.type === 'chat') {
          setMessages(data.payload.conversation);
          setMeta({
            buyerId: data.payload.buyer_id,
            sellerId: data.payload.seller_id,
            auctionId: data.payload.auction_id,
          });
        }
      } catch {
        toast.error('Error parsing server message');
      }
    };

    ws.onerror = () => toast.error('WebSocket error');
    ws.onclose = () => setOnline(false);

    return () => ws.close();
  }, [showState, chatId, token]);

  /** Send Message */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('Not connected');
      return;
    }

    const newMsg = {
      type: 'send_message',
      payload: {
        chat_id: chatId,
        sender_id: identity.id,
        message: inputMessage.trim(),
        timestamp: new Date().toISOString(),
        status: 'sending',
        sender_type: userType,
      },
    };

    socket.send(JSON.stringify(newMsg));
    setMessages((p) => [...p, newMsg.payload]);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <section
      ref={chatSectionRef}
      className="flex flex-col rounded-t-3xl fixed bg-[#9f3247] bottom-0 right-0 w-[30%] pt-3 z-50 shadow-xl"
    >
      <div
        className="bg-[#9f3247] text-white rounded-t-3xl font-bold p-3 flex justify-between items-center cursor-pointer"
        onClick={() => showFunc(!showState)}
      >
        <span className="flex gap-2 items-center px-3">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={profileImage || 'https://via.placeholder.com/32'}
          />
          Chat
          {online && <span className="w-2 h-2 bg-green-400 rounded-full" />}
        </span>

        {showState ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </div>

      <div
        className={`bg-white flex flex-col transition-all duration-300 overflow-hidden ${
          showState ? 'h-[400px]' : 'h-0'
        }`}
      >
        {showMsgInfo && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Message Details
              </h3>
              <button
                onClick={() => setShowMsgInfo(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-500 min-w-[70px]">
                  Sender:
                </span>
                <span className="text-xs text-gray-700 font-mono bg-white px-2 py-1 rounded border border-gray-200 break-all flex-1">
                  {showMsgInfo.sender_id}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-500 min-w-[70px]">
                  Time:
                </span>
                <span className="text-xs text-gray-700">
                  {new Date(showMsgInfo.timestamp).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-500 min-w-[70px]">
                  Status:
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                    showMsgInfo.status === 'read'
                      ? 'bg-blue-100 text-blue-700'
                      : showMsgInfo.status === 'delivered'
                      ? 'bg-green-100 text-green-700'
                      : showMsgInfo.status === 'sending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {getStatusIcon(showMsgInfo.status)}
                  {showMsgInfo.status.charAt(0).toUpperCase() +
                    showMsgInfo.status.slice(1)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-500 min-w-[70px]">
                  Type:
                </span>
                <span className="text-xs text-gray-700 capitalize">
                  {showMsgInfo.sender_type}
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No messages yet
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={`${msg.timestamp}-${i}`}
                className={`flex ${
                  msg.sender_id === identity.id
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <Bubble
                  msg={msg}
                  isOwnMessage={msg.sender_id === identity.id}
                  socket={socket}
                  showMsgInfoFunc={setShowMsgInfo}
                />
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          className="border-t border-gray-200 p-3 flex gap-2 items-center relative"
          onSubmit={sendMessage}
        >
          {quickActions ? (
            <div
              className={`absolute top-0 left-0 px-3 flex gap-3 items-center bg-white z-[60] h-full transition-all ${
                quickActions ? 'w-full' : 'w-0'
              }`}
              onClick={() => setQuickActions(!quickActions)}
            >
              <ChevronLeft size={18} className="text-gray-600" />
              <div className="flex gap-2 items-center justify-between ">
                {(quickActionOptions[userType] || []).map((opt, index) => (
                  <button
                    key={index}
                    className="px-3 py-2 rounded-full shadow-md text-[12px] bg-[#9f3247] text-white"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div onClick={() => setQuickActions(!quickActions)}>
              <ChevronRight size={18} className="text-gray-600" />
            </div>
          )}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={online ? 'Type a message...' : 'Connecting...'}
            disabled={!online}
            className="flex-1 px-4 py-2 border rounded-full text-[13px] font-extralight focus:ring-2 focus:ring-[#9f3247] outline-none"
          />

          <button
            disabled={!online || !inputMessage.trim()}
            className="text-[#9f3247] px-2 disabled:text-gray-300"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </section>
  );
};

ChatSection.propTypes = {
  chatId: PropTypes.string.isRequired,
  showState: PropTypes.bool.isRequired,
  showFunc: PropTypes.func.isRequired,
  profileImage: PropTypes.string,
};

export default ChatSection;
