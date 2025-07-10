import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';
import { cn } from '../../utils/cn';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle' | 'away' | 'offline';
  cursor?: { x: number; y: number };
  color?: string;
}

interface PresenceIndicatorProps {
  users: User[];
  showCursors?: boolean;
  showAvatars?: boolean;
  className?: string;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  users,
  showCursors = true,
  showAvatars = true,
  className
}) => {
  const activeUsers = users.filter(u => u.status !== 'offline');
  
  return (
    <div className={cn('relative', className)}>
      {/* User avatars bar */}
      {showAvatars && (
        <div className="flex items-center gap-2 p-2 bg-white border-b">
          <span className="text-sm text-gray-500">Active:</span>
          <div className="flex -space-x-2">
            <AnimatePresence>
              {activeUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar
                    name={user.name}
                    src={user.avatar}
                    size="sm"
                    status={user.status}
                    statusIndicator
                    className="ring-2 ring-white"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <span className="text-sm text-gray-500 ml-2">
            {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      {/* Live cursors */}
      {showCursors && (
        <AnimatePresence>
          {activeUsers.map((user) => 
            user.cursor ? (
              <Cursor
                key={user.id}
                user={user}
                x={user.cursor.x}
                y={user.cursor.y}
              />
            ) : null
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

// Individual cursor component
interface CursorProps {
  user: User;
  x: number;
  y: number;
}

const Cursor: React.FC<CursorProps> = ({ user, x, y }) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x,
        y
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ 
        type: "spring",
        damping: 30,
        stiffness: 200
      }}
    >
      {/* Cursor pointer */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        <path
          d="M5.5 3.5L16.5 10L10.5 12L7.5 18L5.5 3.5Z"
          fill={user.color || '#3b82f6'}
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      
      {/* User label */}
      <div
        className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: user.color || '#3b82f6' }}
      >
        {user.name}
      </div>
    </motion.div>
  );
};

// Typing indicator component
interface TypingIndicatorProps {
  users: User[];
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  users, 
  className 
}) => {
  const typingUsers = users.filter(u => u.status === 'active');
  
  if (typingUsers.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600',
        className
      )}
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
      <span>
        {typingUsers.length === 1
          ? `${typingUsers[0].name} is typing`
          : `${typingUsers.length} people are typing`}
      </span>
    </motion.div>
  );
};