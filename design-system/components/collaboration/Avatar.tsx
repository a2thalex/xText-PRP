import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { getUserColor } from '../../tokens/colors';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg'
      },
      status: {
        active: 'ring-2 ring-success-main ring-offset-2',
        idle: 'ring-2 ring-warning-main ring-offset-2',
        away: 'ring-2 ring-gray-400 ring-offset-2',
        offline: 'opacity-60'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

const statusIndicatorVariants = cva(
  'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
  {
    variants: {
      size: {
        xs: 'h-1.5 w-1.5',
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
        xl: 'h-4 w-4'
      },
      status: {
        active: 'bg-success-main',
        idle: 'bg-warning-main',
        away: 'bg-gray-400',
        offline: 'bg-gray-300'
      }
    }
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name: string;
  userId?: string;
  showStatus?: boolean;
  statusIndicator?: boolean;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className,
    size,
    status,
    src,
    alt,
    name,
    userId = name,
    showStatus = false,
    statusIndicator = true,
    ...props 
  }, ref) => {
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const backgroundColor = getUserColor(userId);
    
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, status: showStatus ? status : undefined }), className)}
        style={{ backgroundColor: src ? undefined : backgroundColor }}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-white">{initials}</span>
        )}
        {statusIndicator && status && (
          <span className={cn(statusIndicatorVariants({ size, status }))} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group Component
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  size = 'md',
  className
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;
  
  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleChildren.map((child, index) =>
        React.cloneElement(child as React.ReactElement<AvatarProps>, {
          size,
          className: 'ring-2 ring-white',
          style: { zIndex: childrenArray.length - index }
        })
      )}
      {remainingCount > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            'bg-gray-200 text-gray-600 ring-2 ring-white'
          )}
          style={{ zIndex: 0 }}
        >
          <span>+{remainingCount}</span>
        </div>
      )}
    </div>
  );
};