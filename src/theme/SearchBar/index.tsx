import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import CommandSearchModal from '../../components/CommandSearchModal';

export default function CustomNavbarSearchBar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        type="button"
        className="navbar-search-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Search documentation"
      >
        <Search className="w-4 h-4 text-emerald-400 opacity-80" />
        <span className="navbar-search-text">Search architecture...</span>
        <span className="navbar-search-kbd">
          <kbd>⌘K</kbd>
        </span>
      </button>

      <CommandSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
