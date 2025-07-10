import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status?: 'active' | 'idle' | 'away' | 'offline';
}

interface Cursor {
  userId: string;
  x: number;
  y: number;
  elementId?: string;
}

interface UseCollaborationOptions {
  designSystemId: string;
  onComponentUpdate?: (componentId: string, changes: any) => void;
  onTokenUpdate?: (tokenId: string, changes: any) => void;
  onCommentAdded?: (comment: any) => void;
}

export function useCollaboration({
  designSystemId,
  onComponentUpdate,
  onTokenUpdate,
  onCommentAdded
}: UseCollaborationOptions) {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Map<string, Set<string>>>(new Map());
  const cursorTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;

    const socketInstance = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001', {
      auth: { token }
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      socketInstance.emit('join-design-system', { designSystemId });
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    // Presence events
    socketInstance.on('user-joined', ({ userId }) => {
      console.log(`User ${userId} joined`);
    });

    socketInstance.on('user-left', ({ userId }) => {
      setActiveUsers(prev => prev.filter(u => u.id !== userId));
      setCursors(prev => {
        const next = new Map(prev);
        next.delete(userId);
        return next;
      });
    });

    socketInstance.on('presence-update', ({ users }) => {
      setActiveUsers(users.map((p: any) => ({
        ...p.user,
        status: p.status
      })));
    });

    // Cursor events
    socketInstance.on('cursor-update', ({ userId, cursor }) => {
      setCursors(prev => new Map(prev).set(userId, { userId, ...cursor }));
    });

    // Component updates
    socketInstance.on('component-changed', ({ componentId, changes, userId }) => {
      if (onComponentUpdate) {
        onComponentUpdate(componentId, changes);
      }
    });

    // Token updates
    socketInstance.on('token-changed', ({ tokenId, changes, userId }) => {
      if (onTokenUpdate) {
        onTokenUpdate(tokenId, changes);
      }
    });

    // Comments
    socketInstance.on('comment-added', ({ comment }) => {
      if (onCommentAdded) {
        onCommentAdded(comment);
      }
    });

    // Typing indicators
    socketInstance.on('typing-users', ({ resourceId, userId, typing }) => {
      setTypingUsers(prev => {
        const next = new Map(prev);
        const users = next.get(resourceId) || new Set();
        
        if (typing) {
          users.add(userId);
        } else {
          users.delete(userId);
        }
        
        next.set(resourceId, users);
        return next;
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.emit('leave-design-system', { designSystemId });
      socketInstance.disconnect();
    };
  }, [token, designSystemId, onComponentUpdate, onTokenUpdate, onCommentAdded]);

  // Send cursor position
  const sendCursorPosition = useCallback((x: number, y: number, elementId?: string) => {
    if (!socket || !connected) return;

    // Throttle cursor updates
    if (cursorTimeoutRef.current) {
      clearTimeout(cursorTimeoutRef.current);
    }

    cursorTimeoutRef.current = setTimeout(() => {
      socket.emit('cursor-move', { x, y, elementId });
    }, 50);
  }, [socket, connected]);

  // Send selection
  const sendSelection = useCallback((componentId: string, selection: any) => {
    if (!socket || !connected) return;
    socket.emit('selection-change', { componentId, selection });
  }, [socket, connected]);

  // Lock/unlock component
  const lockComponent = useCallback((componentId: string) => {
    if (!socket || !connected) return;
    socket.emit('component-edit-start', { componentId });
  }, [socket, connected]);

  const unlockComponent = useCallback((componentId: string) => {
    if (!socket || !connected) return;
    socket.emit('component-edit-end', { componentId });
  }, [socket, connected]);

  // Update component
  const updateComponent = useCallback((componentId: string, changes: any) => {
    if (!socket || !connected) return;
    socket.emit('component-update', { componentId, changes });
  }, [socket, connected]);

  // Update token
  const updateToken = useCallback((tokenId: string, changes: any) => {
    if (!socket || !connected) return;
    socket.emit('token-update', { tokenId, changes });
  }, [socket, connected]);

  // Comments
  const addComment = useCallback((resourceType: string, resourceId: string, content: string, parentId?: string) => {
    if (!socket || !connected) return;
    socket.emit('comment-create', { resourceType, resourceId, content, parentId });
  }, [socket, connected]);

  const addReaction = useCallback((commentId: string, emoji: string) => {
    if (!socket || !connected) return;
    socket.emit('reaction-add', { commentId, emoji });
  }, [socket, connected]);

  // Typing indicators
  const startTyping = useCallback((resourceId: string, resourceType: string) => {
    if (!socket || !connected) return;
    socket.emit('typing-start', { resourceId, resourceType });
  }, [socket, connected]);

  const stopTyping = useCallback((resourceId: string, resourceType: string) => {
    if (!socket || !connected) return;
    socket.emit('typing-stop', { resourceId, resourceType });
  }, [socket, connected]);

  return {
    connected,
    activeUsers,
    cursors: Array.from(cursors.values()),
    typingUsers,
    
    // Actions
    sendCursorPosition,
    sendSelection,
    lockComponent,
    unlockComponent,
    updateComponent,
    updateToken,
    addComment,
    addReaction,
    startTyping,
    stopTyping
  };
}