import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CommandSearchModal from '../../components/CommandSearchModal';

export default function CustomNavbarSearchBar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (
        e.key === '/' && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
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
          <kbd>⌘K</kbd>
        </span>
      </button>

      <CommandSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
