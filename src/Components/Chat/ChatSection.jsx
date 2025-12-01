import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckCheck, Check } from 'lucide-react';

import {
  ChevronDown,
  ChevronUp,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useAuthStore from '../../Store/AuthStore';
import { toast } from 'react-toastify';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'read':
      return <CheckCheck size={14} className="text-blue-500" />;
    case 'delivered':
      return <CheckCheck size={14} className="text-gray-500" />;
    case 'sending':
      return <Check size={14} className="text-gray-400" />;
    case 'failed':
      return <span className="text-red-500 text-xs">!</span>;
    default:
      return null;
  }
};

const Bubble = ({ msg, isOwnMessage }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef(null);
  const menuRef = useRef(null);

  const openMenu = (e) => {
    e.preventDefault();

    const menuWidth = 160;
    const menuHeight = 120;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setMenuPos({ x, y });
    setMenuVisible(true);
  };

  useEffect(() => {
    if (!menuVisible) return;

    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuVisible(false);
      }
    };

    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [menuVisible]);

  return (
    <>
      <div
        ref={bubbleRef}
        onContextMenu={openMenu}
        className={`relative max-w-[75%] rounded-lg px-4 py-2 ${
          isOwnMessage ? 'bg-[#9f3247] text-white' : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm break-words">{msg.message}</p>

        <div
          className={`flex items-center gap-1 mt-1 text-[10px] ${
            isOwnMessage ? 'text-gray-200' : 'text-gray-500'
          }`}
        >
          <span>{formatTime(msg.timestamp)}</span>
          {isOwnMessage && getStatusIcon(msg.status)}
        </div>
      </div>

      {menuVisible && (
        <div
          ref={menuRef}
          className="fixed z-[500] bg-white shadow-lg rounded-lg p-2 w-40 border border-gray-200 animate-scaleIn"
          style={{ top: menuPos.y, left: menuPos.x }}
        >
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            Copy
          </button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            Delete
          </button>
          <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
            Forward
          </button>
        </div>
      )}
    </>
  );
};

Bubble.propTypes = {
  msg: PropTypes.object.isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
};

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
  const [userType, setUserType] = useState('buyer'); // 'buyer' or 'seller'

  const messagesEndRef = useRef(null);
  const chatSectionRef = useRef(null);

  const quickActionOptions = {
    buyer: ['Set Inspecting', 'Finalize', 'Request Refund'],
    seller: ['Item sent'],
  };

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
      className="flex flex-col rounded-t-xl fixed bg-[#9f3247] bottom-0 right-0 w-[30%] pt-3 z-50 shadow-xl"
    >
      <div
        className="bg-[#9f3247] text-white font-bold p-3 flex justify-between items-center cursor-pointer"
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
            className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-[#9f3247] outline-none"
          />

          <button
            disabled={!online || !inputMessage.trim()}
            className="bg-[#9f3247] text-white p-3 rounded-full disabled:bg-gray-300"
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
