# Collaboration Patterns

Core patterns that enable real-time collaboration in the xText Design System.

## Presence System

### User Presence
Shows who's currently active in the workspace.

```tsx
interface PresenceIndicator {
  userId: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle' | 'away';
  cursor?: { x: number; y: number };
  selection?: SelectionRange;
  lastActivity: Date;
}
```

### Presence States
- **Active**: Currently interacting (green)
- **Idle**: No activity for 2+ minutes (yellow)
- **Away**: No activity for 10+ minutes (gray)

## Collaborative Editing

### Real-Time Cursors
Multiple users can edit simultaneously with visible cursors.

```tsx
<CollaborativeEditor>
  <CursorLayer users={activeUsers} />
  <SelectionLayer selections={userSelections} />
  <ContentLayer content={document} />
</CollaborativeEditor>
```

### Conflict Resolution
Operational Transformation (OT) or CRDT-based conflict resolution:

1. **Last Write Wins**: Simple conflicts resolved by timestamp
2. **Merge Strategy**: Complex conflicts presented to users
3. **Version History**: All changes tracked for rollback

## Communication Patterns

### Inline Comments
Comments attached to specific elements:

```tsx
<CommentThread
  elementId="component-123"
  position="relative"
  resolved={false}
>
  <Comment author={user} timestamp={date}>
    Should we consider a different approach here?
  </Comment>
  <Reply author={user2} timestamp={date2}>
    Let's discuss in the next sync.
  </Reply>
</CommentThread>
```

### Live Annotations
Temporary annotations that disappear after resolution:

```tsx
<Annotation
  type="suggestion"
  author={user}
  expires="5m"
>
  Consider using a memo here for performance
</Annotation>
```

## Activity Streams

### Project Activity
Real-time feed of project changes:

```tsx
<ActivityFeed
  filter={['commits', 'comments', 'edits']}
  timeRange="24h"
  groupBy="user"
/>
```

### User Actions
Broadcast user actions to team:

```tsx
const broadcastAction = (action: UserAction) => {
  socket.emit('user-action', {
    userId: currentUser.id,
    action: action.type,
    target: action.target,
    timestamp: Date.now()
  });
};
```

## Collaboration Modes

### 1. Pair Programming Mode
Two users sharing control:

```tsx
<PairProgramming
  driver={user1}
  navigator={user2}
  switchInterval="15m"
  allowSwitch={true}
/>
```

### 2. Review Mode
Structured code review workflow:

```tsx
<ReviewMode
  reviewer={user1}
  author={user2}
  changes={diffSet}
  comments={reviewComments}
/>
```

### 3. Presentation Mode
One user presents to many:

```tsx
<PresentationMode
  presenter={user1}
  viewers={[user2, user3, user4]}
  allowQuestions={true}
  recordSession={true}
/>
```

## Notification Patterns

### Smart Notifications
Context-aware notification system:

```tsx
interface NotificationRule {
  trigger: 'mention' | 'change' | 'comment' | 'review';
  scope: 'owned' | 'watching' | 'participating';
  delivery: 'instant' | 'batched' | 'digest';
}
```

### Notification States
- **Instant**: Critical updates (mentions, blockers)
- **Batched**: Non-critical updates (every 5 min)
- **Digest**: Summary updates (daily/weekly)

## Data Synchronization

### Optimistic Updates
Immediate UI updates with background sync:

```tsx
const updateComponent = async (id: string, changes: Changes) => {
  // Update UI immediately
  setLocalState(changes);
  
  // Sync in background
  try {
    await api.updateComponent(id, changes);
  } catch (error) {
    // Rollback on failure
    rollbackChanges(id);
    showConflictResolution(error);
  }
};
```

### Offline Support
Queue changes when offline:

```tsx
const offlineQueue = new ChangeQueue();

const syncChanges = async () => {
  if (navigator.onLine) {
    await offlineQueue.flush();
  } else {
    offlineQueue.add(changes);
  }
};
```

## Best Practices

1. **Always show presence**: Users should know who else is active
2. **Minimize conflicts**: Use locking for critical sections
3. **Provide feedback**: Show what others are doing
4. **Respect focus**: Don't interrupt deep work unnecessarily
5. **Enable async collaboration**: Not everyone is online simultaneously

## Implementation Examples

See [examples/collaboration](../docs/examples/collaboration) for full implementations.