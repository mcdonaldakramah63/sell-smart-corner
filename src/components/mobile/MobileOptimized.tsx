import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export const MobileOptimized = ({ 
  children, 
  className, 
  mobileClassName, 
  desktopClassName 
}: MobileOptimizedProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      className,
      isMobile ? mobileClassName : desktopClassName
    )}>
      {children}
    </div>
  );
};

interface TouchFriendlyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const TouchFriendlyButton = ({ 
  children, 
  onClick, 
  className, 
  disabled 
}: TouchFriendlyButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "transition-all duration-200 active:scale-95",
        isMobile && "min-h-[44px] min-w-[44px]", // iOS HIG minimum touch target
        className
      )}
    >
      {children}
    </button>
  );
};