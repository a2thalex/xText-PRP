import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useCollaboration } from '../hooks/useCollaboration';
import { PresenceIndicator } from '../components/collaboration/PresenceIndicator';
import { CommentThread } from '../components/collaboration/CommentThread';
import { Button } from '../components/foundation/Button';

function CollaborativeDesignSystem() {
  const { user } = useAuth();
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  const {
    connected,
    activeUsers,
    cursors,
    addComment,
    addReaction,
    updateComponent,
    lockComponent,
    unlockComponent
  } = useCollaboration({
    designSystemId: 'your-design-system-id',
    onComponentUpdate: (componentId, changes) => {
      console.log('Component updated:', componentId, changes);
      // Update local state
    },
    onCommentAdded: (comment) => {
      setComments(prev => [...prev, comment]);
    }
  });

  // Track mouse movement for cursor sharing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Send cursor position to other users
      // In real implementation, you'd send relative positions
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleComponentEdit = async (component: any) => {
    // Lock component for editing
    await lockComponent(component.id);
    setSelectedComponent(component);
  };

  const handleComponentSave = async (changes: any) => {
    if (!selectedComponent) return;

    // Update component
    await updateComponent(selectedComponent.id, changes);
    
    // Unlock component
    await unlockComponent(selectedComponent.id);
    setSelectedComponent(null);
  };

  const handleAddComment = async (content: string) => {
    if (!selectedComponent) return;

    await addComment('component', selectedComponent.id, content);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Connection status */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-sm ${
          connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Active users */}
      <PresenceIndicator
        users={activeUsers.map(u => ({
          ...u,
          cursor: cursors.find(c => c.userId === u.id)
        }))}
        showCursors={true}
        showAvatars={true}
        className="fixed top-0 left-0 right-0 z-40"
      />

      <div className="container mx-auto px-4 pt-20">
        <h1 className="text-3xl font-bold mb-8">Collaborative Design System</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Component list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Components</h2>
              
              {/* Component grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Example components */}
                <ComponentCard
                  name="Button"
                  category="Foundation"
                  onClick={() => handleComponentEdit({ id: '1', name: 'Button' })}
                  isLocked={false}
                />
                <ComponentCard
                  name="Input"
                  category="Foundation"
                  onClick={() => handleComponentEdit({ id: '2', name: 'Input' })}
                  isLocked={true}
                  lockedBy="John Doe"
                />
                {/* Add more components */}
              </div>
            </div>
          </div>

          {/* Comments sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              
              {selectedComponent && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <span className="text-sm text-gray-600">
                    Discussing: {selectedComponent.name}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {comments
                  .filter(c => !selectedComponent || c.resourceId === selectedComponent.id)
                  .map(comment => (
                    <CommentThread
                      key={comment.id}
                      comment={comment}
                      onReply={(content, parentId) => addComment('component', comment.resourceId, content, parentId)}
                      onReact={(emoji, commentId) => addReaction(commentId, emoji)}
                      currentUserId={user?.id || ''}
                    />
                  ))}
              </div>

              {selectedComponent && (
                <div className="mt-4">
                  <textarea
                    className="w-full p-3 border rounded-md"
                    placeholder="Add a comment..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Component editor modal */}
      {selectedComponent && (
        <ComponentEditor
          component={selectedComponent}
          onSave={handleComponentSave}
          onCancel={() => {
            unlockComponent(selectedComponent.id);
            setSelectedComponent(null);
          }}
        />
      )}
    </div>
  );
}

// Component card
function ComponentCard({ 
  name, 
  category, 
  onClick, 
  isLocked, 
  lockedBy 
}: {
  name: string;
  category: string;
  onClick: () => void;
  isLocked: boolean;
  lockedBy?: string;
}) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isLocked 
          ? 'border-yellow-400 bg-yellow-50' 
          : 'border-gray-200 hover:border-primary-500'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      <h3 className="font-medium">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      {isLocked && (
        <p className="text-xs text-yellow-600 mt-2">
          🔒 Being edited by {lockedBy}
        </p>
      )}
    </div>
  );
}

// Component editor
function ComponentEditor({ 
  component, 
  onSave, 
  onCancel 
}: {
  component: any;
  onSave: (changes: any) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(component.code || '');
  const [documentation, setDocumentation] = useState(component.documentation || '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Edit {component.name}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Code</label>
            <textarea
              className="w-full h-64 p-3 border rounded-md font-mono text-sm"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Documentation</label>
            <textarea
              className="w-full h-32 p-3 border rounded-md"
              value={documentation}
              onChange={(e) => setDocumentation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave({ code, documentation })}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Wrap with auth provider
export default function App() {
  return (
    <AuthProvider>
      <CollaborativeDesignSystem />
    </AuthProvider>
  );
}