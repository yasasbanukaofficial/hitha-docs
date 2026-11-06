import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CommandSearchModal from '../../components/CommandSearchModal';

export default function CustomNavbarSearchBar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is already typing in an input or textarea or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target?.tagName === 'INPUT' || 
        target?.tagName === 'TEXTAREA' || 
        target?.isContentEditable
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="navbar-search-wrapper">
      <button 
        type="button"
        className="navbar-search-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Search documentation"
      >
        <Search className="navbar-search-icon" />
        <span className="navbar-search-placeholder">Search</span>
        <span className="navbar-search-shortcut">
          <kbd>/</kbd>
        </span>
      </button>

      <CommandSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
