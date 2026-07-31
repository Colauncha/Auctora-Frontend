import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  ChevronDown,
  ChevronUp,
  Send,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import useAuthStore from '../../Store/AuthStore';
import Bubble from './Bubble';
import { quickActionOptions, getStatusIcon } from './util';
import { toast } from 'react-toastify';
import { charLimit, current, Fetch } from '../../utils';
import { ensureFreshToken } from '../../utils/Fetch';
import { toastError } from '../../utils/toast';
import Avatar from '../../Pages/Dashboard/Avatar';
import Loader from '../../assets/loaderWhite';

const ChatSection = ({ chatId, showState, showFunc, profileImage }) => {
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
  const [responseUser, setResponseUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const chatSectionRef = useRef(null);

  const websocketToken = useAuthStore((state) => state.websocketToken);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const runFetch = useCallback(
    async ({ data = null, method = 'GET', endpoint = endpoint }) => {
      try {
        const response = await Fetch({
          url: endpoint,
          method: method,
          requestData: data ? data : null,
        });
        if (!response.success) {
          toastError(
            response.error.message || 'An error occurred while fetching data.',
            response.error.detail || 'Please try again later.'
          );
          setLoading(false);

          throw new Error(`Unable to fetch user data: ${response.error}`);
        }
        // const resp = await response.json();
        return response.data;
      } catch (error) {
        setLoading(false);
        console.error(error);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    const fetchUserData = async (id) => {
      const data = await runFetch({
        endpoint: `${current}users/retrieve/${id}`,
        method: 'GET',
      });
      console.log('Chat user: ', data);
      setResponseUser(data.data);
    };

    if (identity.id === meta.buyerId) {
      setUserType('buyer');
      fetchUserData(meta.sellerId);
    } else if (identity.id === meta.sellerId) {
      setUserType('seller');
      fetchUserData(meta.buyerId);
    }
  }, [meta, identity, runFetch]);

  /** WebSocket Setup */
  const wsConnect = useRef(false);
  const [wsStatus, setWsStatus] = useState('idle');
  const wsRetryCounter = useRef({
    backoff: 0,
    count: 3,
  });
  const wsRetryTimer = useRef(null);

  useEffect(() => {
    if (!showState || !websocketToken || chatId === undefined) return;

    let endpoint = current.replace('http', 'ws');
    const ws = new WebSocket(`${endpoint}chats/ws/${chatId}`, [
      'auth',
      websocketToken,
    ]);
    setSocket(ws);

    ws.onopen = () => {
      setOnline(true);
      setWsStatus('connected');
    };

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
        } else if (data.type === 'read_message') {
          console.log('Message read:', data.payload);
          setMessages((prev) =>
            prev.map((m) =>
              Number(m.chat_number) === Number(data.payload.chat_number)
                ? { ...m, status: 'read' }
                : m
            )
          );
        }
      } catch {
        toast.error('Error parsing server message');
      }
    };

    ws.onerror = () => {
      toast.error('WebSocket error');
      setWsStatus('error');
      wsConnect.current = false;
    };
    ws.onclose = () => {
      setOnline(false);
      wsConnect.current = false;
    };

    return () => ws.close();
  }, [showState, chatId, wsConnect, websocketToken]);

  // websocket retry effect - runs whenever a connection attempt errors out
  useEffect(() => {
    if (wsStatus !== 'error') return;

    if (wsRetryCounter.current.count <= 0) {
      toastError('Connection failed', 'Could not connect to chat. Try again.');
      return;
    }

    wsRetryCounter.current.count -= 1;
    wsRetryCounter.current.backoff += 1;
    wsRetryTimer.current = setTimeout(
      async () => {
        await ensureFreshToken();
        wsConnect.current = true;
      },
      1000 * 2 * wsRetryCounter.current.backoff
    );

    return () => clearTimeout(wsRetryTimer.current);
  }, [wsStatus]);

  /** Send Message */
  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error('Not connected');
      return;
    }

    let newMsg = {
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
    newMsg.payload.chat_number = messages.length + 1;
    setMessages((p) => [...p, newMsg.payload]);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  if (profileImage && !meta.auctionId) {
    console.info(profileImage);
  }

  return (
    <section
      ref={chatSectionRef}
      className="flex flex-col rounded-t-3xl fixed bottom-0 right-0 w-full lg:w-[40dvw] lg:right-6 pt-3 z-50 shadow-[0_-8px_40px_-8px_rgba(0,0,0,0.35)] ring-1 ring-black/5 overflow-hidden bg-gradient-to-br from-[#9f3247] via-[#a8384f] to-[#c24a63]"
    >
      {/* Header */}
      <div
        className="text-white font-semibold px-4 py-2.5 flex justify-between items-center cursor-pointer select-none hover:bg-white/5 transition-colors"
        onClick={() => showFunc(!showState)}
      >
        <span className="flex gap-3 items-center">
          <span className="relative shrink-0">
            <Avatar
              imageUrl={
                responseUser?.image_link ? responseUser?.image_link?.link : null
              }
              username={
                responseUser?.username
                  ? responseUser?.username
                  : responseUser?.email
              }
              otherStyles={`group-hover:opacity-40 transition-opacity ring-2 ring-white/40 !text-sm`}
              size={'w-9 h-9'}
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#9f3247] transition-colors ${
                online ? 'bg-emerald-400' : 'bg-gray-400'
              }`}
            >
              {online && (
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
              )}
            </span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] flex gap-2 items-center justify-center font-semibold tracking-tight capitalize">
              {responseUser?.username
                ? responseUser?.username
                : responseUser?.email || 'Chat'}
              {loading && <Loader otherStyles={'!w-3 !h-3 !border-2'} />}
            </span>
            <span className="text-[11px] font-normal text-white/70">
              {online ? 'Online' : 'Connecting…'}
            </span>
          </span>
        </span>

        <span className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
          {showState ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </span>
      </div>

      <div
        className={`bg-gray-50 rounded-t-xl flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
          showState ? 'h-[440px]' : 'h-0'
        }`}
      >
        {showMsgInfo && (
          <div className="p-4 border-b border-gray-200 bg-white shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                Message details
              </h3>
              <button
                onClick={() => setShowMsgInfo(null)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                aria-label="Close message details"
              >
                <span className="text-base leading-none">×</span>
              </button>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-400 min-w-[60px]">
                  Sender
                </span>
                <span className="text-xs text-gray-700 font-mono bg-gray-50 px-2 py-1 rounded-md border border-gray-200 break-all flex-1">
                  {showMsgInfo.sender_id}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-400 min-w-[60px]">
                  Time
                </span>
                <span className="text-xs text-gray-700">
                  {new Date(showMsgInfo.timestamp).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-400 min-w-[60px]">
                  Status
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                    showMsgInfo.status === 'read'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                      : showMsgInfo.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : showMsgInfo.status === 'sending'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                  }`}
                >
                  {getStatusIcon(showMsgInfo.status)}
                  {showMsgInfo.status.charAt(0).toUpperCase() +
                    showMsgInfo.status.slice(1)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-gray-400 min-w-[60px]">
                  Type
                </span>
                <span className="text-xs text-gray-700 capitalize">
                  {showMsgInfo.sender_type}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5 scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <MessageCircle size={28} strokeWidth={1.5} />
              <span className="text-sm">No messages yet</span>
              <span className="text-xs text-gray-300">
                Say hello to get the conversation started
              </span>
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
                  sourceName={
                    msg.sender_id === identity.id
                      ? identity?.username || charLimit(identity?.email, 15)
                      : responseUser?.username ||
                        charLimit(responseUser?.email, 15)
                  }
                />
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        <form
          className="border-t border-gray-200 bg-white p-3 flex gap-2 items-center relative"
          onSubmit={sendMessage}
        >
          {quickActions ? (
            <div
              className="absolute top-0 left-0 px-3 flex gap-2 items-center bg-white z-[60] w-full h-full overflow-x-auto transition-all"
              onClick={() => setQuickActions(!quickActions)}
            >
              <ChevronLeft
                size={18}
                className="text-gray-400 shrink-0 hover:text-gray-600 transition-colors"
              />
              <div className="flex gap-2 items-center">
                {(quickActionOptions[userType] || []).map((opt, index) => (
                  <button
                    key={index}
                    className="px-3.5 py-2 rounded-full shadow-sm text-[12px] font-medium bg-[#9f3247] text-white whitespace-nowrap hover:bg-[#8a2b3e] active:scale-95 transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setQuickActions(!quickActions)}
              className="text-gray-400 hover:text-[#9f3247] hover:bg-gray-100 rounded-full p-1.5 transition-colors shrink-0"
              aria-label="Show quick actions"
            >
              <ChevronRight size={18} />
            </button>
          )}
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={online ? 'Type a message…' : 'Connecting…'}
            disabled={!online}
            className="flex-1 px-4 py-2.5 bg-gray-100 border border-transparent rounded-full text-[13px] font-normal placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#9f3247]/40 focus:border-[#9f3247]/30 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />

          <button
            disabled={!online || !inputMessage.trim()}
            className="bg-[#9f3247] text-white rounded-full p-2.5 shrink-0 shadow-sm hover:bg-[#8a2b3e] active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:active:scale-100 transition-all"
            aria-label="Send message"
          >
            <Send size={16} />
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
