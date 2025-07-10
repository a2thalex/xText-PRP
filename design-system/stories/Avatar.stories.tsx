import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from '../components/collaboration/Avatar';

const meta = {
  title: 'Collaboration/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: ['active', 'idle', 'away', 'offline'],
    },
    showStatus: {
      control: 'boolean',
    },
    statusIndicator: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
    size: 'md',
  },
};

export const WithImage: Story = {
  args: {
    name: 'Jane Smith',
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    size: 'md',
  },
};

export const WithStatus: Story = {
  args: {
    name: 'Sarah Johnson',
    status: 'active',
    statusIndicator: true,
    size: 'md',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-end">
      <Avatar name="John Doe" size="xs" />
      <Avatar name="John Doe" size="sm" />
      <Avatar name="John Doe" size="md" />
      <Avatar name="John Doe" size="lg" />
      <Avatar name="John Doe" size="xl" />
    </div>
  ),
};

export const StatusStates: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar name="Active User" status="active" statusIndicator />
      <Avatar name="Idle User" status="idle" statusIndicator />
      <Avatar name="Away User" status="away" statusIndicator />
      <Avatar name="Offline User" status="offline" statusIndicator />
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="space-y-4">
      <AvatarGroup>
        <Avatar name="John Doe" />
        <Avatar name="Jane Smith" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
        <Avatar name="Sarah Johnson" />
        <Avatar name="Mike Wilson" />
        <Avatar name="Emily Brown" />
        <Avatar name="David Lee" />
      </AvatarGroup>
      
      <AvatarGroup max={3}>
        <Avatar name="John Doe" size="sm" />
        <Avatar name="Jane Smith" size="sm" />
        <Avatar name="Sarah Johnson" size="sm" />
        <Avatar name="Mike Wilson" size="sm" />
        <Avatar name="Emily Brown" size="sm" />
      </AvatarGroup>
    </div>
  ),
};

export const CollaborationColors: Story = {
  render: () => {
    const users = [
      'Alice Cooper',
      'Bob Dylan',
      'Charlie Parker',
      'Diana Ross',
      'Elvis Presley',
      'Frank Sinatra',
      'George Harrison',
      'Helen Mirren',
    ];
    
    return (
      <div className="grid grid-cols-4 gap-4">
        {users.map((name) => (
          <div key={name} className="flex items-center gap-2">
            <Avatar name={name} size="md" />
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </div>
    );
  },
};