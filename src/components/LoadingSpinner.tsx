import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} rounded-full animate-spin border-transparent border-opacity-20`}
          style={{ 
            borderTopColor: '#3B82F6', 
            borderRightColor: '#8B5CF6',
            borderBottomColor: 'rgba(59, 130, 246, 0.2)',
            borderLeftColor: 'rgba(139, 92, 246, 0.2)'
          }}
        ></div>
        <div 
          className={`${sizeClasses[size]} rounded-full absolute top-0 left-0 animate-pulse opacity-30`}
          style={{ 
            borderTopColor: 'rgba(59, 130, 246, 0.3)', 
            borderRightColor: 'rgba(139, 92, 246, 0.3)',
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent'
          }}
        ></div>
      </div>
      {text && (
        <p className="mt-3 text-gray-600 dark:text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner; 