import { useCallback, useEffect, useRef, useState } from 'react';

// Lightweight animation without framer-motion dependency
const AnimatedItem = ({ children, index, onMouseEnter, onClick, visible }) => {
  return (
    <div
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="mb-3 cursor-pointer transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.85)',
        transitionDelay: `${index * 30}ms`,
      }}
    >
      {children}
    </div>
  );
};

const AnimatedList = ({
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleItemMouseEnter = useCallback((index) => setSelectedIndex(index), []);

  const handleItemClick = useCallback((item, index) => {
    setSelectedIndex(index);
    if (onItemSelect) onItemSelect(item, index);
  }, [onItemSelect]);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        if (onItemSelect) onItemSelect(items[selectedIndex], selectedIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        className={`max-h-[70vh] overflow-y-auto p-2 ${
          displayScrollbar ? '' : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{ scrollbarWidth: displayScrollbar ? 'thin' : 'none' }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            index={index}
            visible={visible}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div className={`p-4 rounded-xl border transition-all duration-200
              ${selectedIndex === index
                ? 'bg-lightAccent/10 dark:bg-darkAccent/10 border-lightAccent/40 dark:border-darkAccent/40'
                : 'bg-white dark:bg-darkCard border-gray-200 dark:border-darkBorder hover:border-lightAccent/30 dark:hover:border-darkAccent/30'
              } ${itemClassName}`}
            >
              {item}
            </div>
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] pointer-events-none transition-opacity duration-300
            bg-gradient-to-b from-lightBg dark:from-darkBg to-transparent"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[80px] pointer-events-none transition-opacity duration-300
            bg-gradient-to-t from-lightBg dark:from-darkBg to-transparent"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;