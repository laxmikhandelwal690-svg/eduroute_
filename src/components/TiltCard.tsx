import { type HTMLAttributes, type PropsWithChildren, useState } from 'react';
import { cn } from '../utils/cn';

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  glowClassName?: string;
  intensity?: number;
}

export const TiltCard = ({
  children,
  className,
  glowClassName,
  intensity = 10,
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: PropsWithChildren<TiltCardProps>) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div
      className={cn('group relative transform-gpu perspective-[1600px]', className)}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

        setTilt({ x: -(offsetY * intensity), y: offsetX * intensity });
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        setTilt({ x: 0, y: 0 });
        onMouseLeave?.(event);
      }}
      style={{
        ...style,
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
      }}
      {...props}
    >
      <div className={cn('pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 blur-2xl transition duration-500 group-hover:opacity-70', glowClassName)} />
      {children}
    </div>
  );
};
