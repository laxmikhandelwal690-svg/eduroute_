import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type ThemeToggleProps = {
  className?: string;
  /** When true, toggle is position:fixed and can be dragged; position is persisted */
  movable?: boolean;
};

const POSITION_KEY = 'eduroute-theme-toggle-pos';

type Pos = { x: number; y: number };

function loadPos(): Pos | null {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function savePos(pos: Pos) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

function clampPos(x: number, y: number, width: number, height: number): Pos {
  const margin = 8;
  const maxX = Math.max(margin, window.innerWidth - width - margin);
  const maxY = Math.max(margin, window.innerHeight - height - margin);
  return {
    x: Math.min(maxX, Math.max(margin, x)),
    y: Math.min(maxY, Math.max(margin, y)),
  };
}

/**
 * Compact sun/moon pill toggle — same size everywhere (matches student dashboard).
 * Fixed h-8 w-14 so knob never clips even if className tries to resize.
 */
export const ThemeToggle = ({ className = '', movable = false }: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();
  const rootRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  useEffect(() => {
    if (!movable) return;
    const saved = loadPos();
    if (saved) {
      setPos(saved);
      return;
    }
    setPos({ x: Math.max(8, window.innerWidth - 72 - 20), y: 20 });
  }, [movable]);

  useEffect(() => {
    if (!movable) return;
    const onResize = () => {
      setPos((prev) => {
        if (!prev) return prev;
        const el = rootRef.current;
        const w = el?.offsetWidth || 64;
        const h = el?.offsetHeight || 32;
        const next = clampPos(prev.x, prev.y, w, h);
        savePos(next);
        return next;
      });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [movable]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!movable) return;
      const el = rootRef.current;
      if (!el) return;
      if (e.button !== 0) return;
      el.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      dragRef.current = {
        active: true,
        moved: false,
        startX: e.clientX,
        startY: e.clientY,
        originX: rect.left,
        originY: rect.top,
      };
    },
    [movable]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!movable || !drag?.active) return;
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
      const el = rootRef.current;
      const w = el?.offsetWidth || 64;
      const h = el?.offsetHeight || 32;
      setPos(clampPos(drag.originX + dx, drag.originY + dy, w, h));
    },
    [movable]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!movable || !drag) return;
      drag.active = false;
      if (drag.moved && pos) savePos(pos);
      try {
        rootRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [movable, pos]
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (dragRef.current?.moved) {
        e.preventDefault();
        e.stopPropagation();
        dragRef.current.moved = false;
        return;
      }
      toggleTheme();
    },
    [toggleTheme]
  );

  const style: React.CSSProperties | undefined = movable
    ? pos
      ? {
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          right: 'auto',
          zIndex: 90,
          touchAction: 'none',
          cursor: 'grab',
        }
      : {
          position: 'fixed',
          right: 20,
          top: 20,
          zIndex: 90,
          touchAction: 'none',
          cursor: 'grab',
        }
    : undefined;

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode${movable ? ' (drag to move)' : ''}`}
      title={movable ? 'Switch theme · Drag to move' : `Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`theme-toggle relative inline-flex shrink-0 items-center rounded-full border border-white/15 p-0.5 overflow-hidden ${className} h-8 w-14`}
      style={style}
    >
      <span className="sr-only">Toggle theme</span>

      {/* Track icons (faded) */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5 text-white/70">
        <Sun className="h-3 w-3" strokeWidth={2.25} />
        <Moon className="h-3 w-3" strokeWidth={2.25} />
      </span>

      {/* Sliding knob — fixed size so it never clips */}
      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-violet-600 shadow-md transition-transform duration-300 ease-out ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" strokeWidth={2.25} />
        ) : (
          <Sun className="h-3.5 w-3.5" strokeWidth={2.25} />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
