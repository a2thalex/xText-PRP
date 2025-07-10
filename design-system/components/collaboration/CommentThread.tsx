import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';
import { Button } from '../foundation/Button';
import { cn } from '../../utils/cn';
import { formatRelativeTime } from '../../utils/time';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  edited?: boolean;
  reactions?: Reaction[];
  replies?: Comment[];
  resolved?: boolean;
}

interface Reaction {
  emoji: string;
  users: string[];
}

interface CommentThreadProps {
  comment: Comment;
  onReply?: (content: string, parentId: string) => void;
  onReact?: (emoji: string, commentId: string) => void;
  onResolve?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId: string;
  depth?: number;
  className?: string;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  onReply,
  onReact,
  onResolve,
  onEdit,
  onDelete,
  currentUserId,
  depth = 0,
  className
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReactions, setShowReactions] = useState(false);
  
  const isAuthor = comment.author.id === currentUserId;
  const canModify = isAuthor || depth === 0; // Allow thread starter to resolve
  
  const handleReply = () => {
    if (replyContent.trim() && onReply) {
      onReply(replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
    }
  };
  
  const handleEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };
  
  const defaultReactions = ['👍', '❤️', '🎉', '🤔', '👎'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'group',
        depth > 0 && 'ml-12 mt-3',
        comment.resolved && 'opacity-60',
        className
      )}
    >
      {/* Comment header */}
      <div className="flex items-start gap-3">
        <Avatar
          name={comment.author.name}
          src={comment.author.avatar}
          size="sm"
          userId={comment.author.id}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(comment.timestamp)}
            </span>
            {comment.edited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
            {comment.resolved && (
              <span className="px-2 py-0.5 text-xs bg-success-light/20 text-success-dark rounded">
                Resolved
              </span>
            )}
          </div>
          
          {/* Comment content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>Save</Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
          
          {/* Reactions */}
          {comment.reactions && comment.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {comment.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={() => onReact?.(reaction.emoji, comment.id)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border',
                    reaction.users.includes(currentUserId)
                      ? 'bg-primary-50 border-primary-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.users.length}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!comment.resolved && (
              <>
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Reply
                </button>
                
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  React
                </button>
                
                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(comment.id)}
                      className="text-xs text-error-main hover:text-error-dark"
                    >
                      Delete
                    </button>
                  </>
                )}
                
                {canModify && onResolve && (
                  <button
                    onClick={() => onResolve(comment.id)}
                    className="text-xs text-success-main hover:text-success-dark"
                  >
                    Resolve
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* Reaction picker */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-1 mt-2 p-2 bg-white border rounded-lg shadow-sm"
              >
                {defaultReactions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReact?.(emoji, comment.id);
                      setShowReactions(false);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Reply form */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className="flex gap-2">
                  <Avatar
                    name="You"
                    size="sm"
                    userId={currentUserId}
                  />
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={handleReply}>Reply</Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          setIsReplying(false);
                          setReplyContent('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onReact={onReact}
              onResolve={onResolve}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};