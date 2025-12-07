import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ClipboardCopy,
  Trash2,
  Flag,
  Info,
  FlagTriangleRight,
} from 'lucide-react';
import { formatTime, getStatusIcon, clipboardCopy } from './util';

const Bubble = ({ msg, isOwnMessage, socket, showMsgInfoFunc }) => {
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
    if (socket.readyState === WebSocket.OPEN) {
      if (msg.status !== 'read' && !isOwnMessage) {
        const newMsg = {
          type: 'read_message',
          payload: {
            chat_number: msg.chat_number,
          },
        };

        socket.send(JSON.stringify(newMsg));
        msg.status = 'read';
      }
    }
  }, [msg, socket, isOwnMessage]);

  useEffect(() => {
    if (!menuVisible) return;

    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setMenuVisible(false);
        showMsgInfoFunc(null);
      }
    };

    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [menuVisible, showMsgInfoFunc]);

  return (
    <>
      <div
        ref={bubbleRef}
        onContextMenu={openMenu}
        className={`relative max-w-[75%] rounded-xl px-4 py-2 ${
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
          <button
            onClick={() => {
              clipboardCopy(msg.message);
              setMenuVisible(false);
            }}
            className="w-full flex justify-between px-3 py-2 text-sm hover:bg-gray-100"
          >
            Copy
            <ClipboardCopy size={15} />
          </button>
          <button className="flex justify-between w-full px-3 py-2 text-sm hover:bg-gray-100">
            Delete
            <Trash2 size={15} />
          </button>
          <button
            onClick={() => showMsgInfoFunc(msg)}
            className="flex justify-between w-full px-3 py-2 text-sm hover:bg-gray-100"
          >
            Info
            <Info size={15} />
          </button>
          <hr className="my-2 shadow-sm" />
          <button className="flex justify-between w-full px-3 py-2 text-sm hover:bg-gray-100">
            Report
            <Flag size={15} />
          </button>
          <button className="flex justify-between w-full px-3 py-2 text-sm hover:bg-gray-100">
            Flag Chat
            <FlagTriangleRight size={15} />
          </button>
        </div>
      )}
    </>
  );
};

Bubble.propTypes = {
  msg: PropTypes.object.isRequired,
  isOwnMessage: PropTypes.bool.isRequired,
  socket: PropTypes.object.isRequired,
  showMsgInfoFunc: PropTypes.func,
};

export default Bubble;
