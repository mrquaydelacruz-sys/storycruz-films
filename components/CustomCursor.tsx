'use client'
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Camera Icon Cursor */}
      <div
        className="custom-cursor-camera"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isClicking
            ? 'translate(-50%, -50%) scale(0.8)'
            : isHovering
            ? 'translate(-50%, -50%) scale(1.3)'
            : 'translate(-50%, -50%) scale(1)',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z"
            stroke="#d4a574"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle
            cx="12"
            cy="13"
            r="4"
            stroke="#d4a574"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Click Effect Ripple */}
      {isClicking && (
        <div
          className="click-ripple"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      )}

      {/* Outer Ring */}
      <div
        className="custom-cursor-ring"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isClicking
            ? 'translate(-50%, -50%) scale(0.7)'
            : isHovering
            ? 'translate(-50%, -50%) scale(1.5)'
            : 'translate(-50%, -50%) scale(1)',
        }}
      />

      <style jsx>{`
        .custom-cursor-camera {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 8px rgba(212, 165, 116, 0.3));
        }

        .custom-cursor-ring {
          position: fixed;
          width: 40px;
          height: 40px;
          border: 2px solid rgba(212, 165, 116, 0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .click-ripple {
          position: fixed;
          width: 60px;
          height: 60px;
          border: 3px solid #d4a574;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9997;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple-animation 0.6s ease-out;
        }

        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        :global(body) {
          cursor: none !important;
        }

        :global(a, button, input, textarea, select) {
          cursor: none !important;
        }

        /* Hide custom cursor on touch devices */
        @media (hover: none) and (pointer: coarse) {
          .custom-cursor-camera,
          .custom-cursor-ring,
          .click-ripple {
            display: none !important;
          }

          :global(body),
          :global(a, button, input, textarea, select) {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}
