import React from 'react';

export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}> = ({ width = '100%', height = '20px', borderRadius = '6px', style }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#EAE2D7',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
};
