import React, { useEffect, useRef } from 'react';

export interface MenuItem {
  id: string;
  label?: string; // Optional for separator items
  shortcut?: string; // Keyboard shortcut, e.g., "Alt+L"
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean; // If true, renders as a separator line
  danger?: boolean; // If true, uses danger color (red)
  ellipsis?: boolean; // If true, adds "..." to the label
}

export interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  minWidth?: number;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  items,
  onClose,
  minWidth = 200
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Use setTimeout to avoid immediate closure on right-click
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  // Position menu to stay within viewport
  useEffect(() => {
    if (!visible || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let finalX = x;
    let finalY = y;

    // Adjust horizontal position if menu would overflow right edge
    if (x + rect.width > viewportWidth) {
      finalX = viewportWidth - rect.width - 5;
    }

    // Adjust vertical position if menu would overflow bottom edge
    if (y + rect.height > viewportHeight) {
      finalY = viewportHeight - rect.height - 5;
    }

    // Ensure menu doesn't go off left/top edge
    finalX = Math.max(5, finalX);
    finalY = Math.max(5, finalY);

    menu.style.left = `${finalX}px`;
    menu.style.top = `${finalY}px`;
  }, [visible, x, y]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        position: 'fixed',
        left: x,
        top: y,
        minWidth: `${minWidth}px`,
      }}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return <div key={`separator-${index}`} className="context-menu-separator" />;
        }

        return (
          <div
            key={item.id}
            className={`context-menu-item ${item.disabled ? 'disabled' : ''} ${item.danger ? 'danger' : ''}`}
            onClick={() => {
              if (!item.disabled && item.onClick) {
                item.onClick();
                onClose();
              }
            }}
          >
            <span className="context-menu-label">
              {item.ellipsis && !item.label.endsWith('...') ? `${item.label}...` : item.label}
            </span>
            {item.shortcut && (
              <span className="context-menu-shortcut">{item.shortcut}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ContextMenu);

