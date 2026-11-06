import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from '@docusaurus/router';
import catalogData from '../data/searchCatalog.json';
import { Search, X, Hash, ArrowRight, CornerDownLeft, FileText, Layers, Shield, Stethoscope, DollarSign, Terminal } from 'lucide-react';

interface Heading {
  title: string;
  slug: string;
  url: string;
}

interface DocItem {
  id: string;
  title: string;
  category: string;
  route: string;
  headings: Heading[];
  preview: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Overview: <Layers className="w-4 h-4 text-emerald-400" />,
  Logging: <Terminal className="w-4 h-4 text-amber-400" />,
  'Logging Audit': <Terminal className="w-4 h-4 text-amber-400" />,
  Security: <Shield className="w-4 h-4 text-rose-400" />,
  Clinical: <Stethoscope className="w-4 h-4 text-cyan-400" />,
  Financial: <DollarSign className="w-4 h-4 text-emerald-400" />,
  Reference: <FileText className="w-4 h-4 text-indigo-400" />,
  'Engineering Timeline': <Layers className="w-4 h-4 text-violet-400" />,
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandSearchModal({ isOpen, onClose }: SearchModalProps): React.JSX.Element | null {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const categories = ['ALL', 'Logging Audit', 'Security', 'Clinical', 'Financial', 'Reference'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter items based on query & category
  const filteredItems: DocItem[] = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return (catalogData as DocItem[]).filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q);
      const previewMatch = item.preview.toLowerCase().includes(q);
      const headingMatch = item.headings.some(h => h.title.toLowerCase().includes(q));
      const categoryMatch = item.category.toLowerCase().includes(q);
      return titleMatch || previewMatch || headingMatch || categoryMatch;
    });
  }, [query, selectedCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          navigateTo(filteredItems[selectedIndex].route);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  const navigateTo = (url: string) => {
    onClose();
    history.push(url);
  };

  if (!isOpen) return null;

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div 
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="search-header">
          <Search className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search architecture, concepts, SQL queries, or Sinhala guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button className="search-clear-btn" onClick={() => setQuery('')}>
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="search-shortcut-badge">ESC to close</div>
          )}
        </div>

        {/* Quick Filter Categories */}
        <div className="search-category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`search-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="search-results-container" ref={resultsRef}>
          {filteredItems.length === 0 ? (
            <div className="search-no-results">
              <p className="no-res-title">No matching architecture documents found</p>
              <p className="no-res-subtitle">Try searching for keywords like "hash chain", "dual plane", "rate limit", "escrow", or "webrtc".</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  className={`search-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => navigateTo(item.route)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="search-item-header">
                    <span className="search-item-category">
                      {CATEGORY_ICONS[item.category] || <FileText className="w-4 h-4" />}
                      <span>{item.category}</span>
                    </span>
                    <span className="search-item-route">{item.route}</span>
                  </div>

                  <h4 className="search-item-title">{item.title}</h4>

                  {/* Snippet preview */}
                  <p className="search-item-snippet">
                    {item.preview.slice(0, 160)}...
                  </p>

                  {/* Section sub-links */}
                  {item.headings && item.headings.length > 0 && (
                    <div className="search-item-headings">
                      {item.headings.slice(0, 3).map((h) => (
                        <button
                          key={h.slug}
                          className="search-heading-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo(h.url);
                          }}
                        >
                          <Hash className="w-3 h-3 opacity-60" />
                          <span>{h.title}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isSelected && (
                    <div className="search-item-enter-hint">
                      <span>Jump</span>
                      <CornerDownLeft className="w-3.5 h-3.5 ml-1 inline" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="search-footer">
          <div className="search-footer-commands">
            <span><kbd className="search-kbd">↑</kbd> <kbd className="search-kbd">↓</kbd> Navigate</span>
            <span><kbd className="search-kbd">↵</kbd> Select</span>
            <span><kbd className="search-kbd">ESC</kbd> Close</span>
          </div>
          <div className="search-footer-count">
            {filteredItems.length} {filteredItems.length === 1 ? 'doc' : 'docs'} indexed
          </div>
        </div>
      </div>
    </div>
  );
}
