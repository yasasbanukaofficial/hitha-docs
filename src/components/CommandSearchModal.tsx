import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistory } from '@docusaurus/router';
import catalogData from '../data/searchCatalog.json';
import { Search, X, Hash, ArrowRight, CornerDownLeft, FileText, Layers, Shield, Stethoscope, DollarSign, Terminal, Clock } from 'lucide-react';

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
  Overview: <Layers className="w-4 h-4 text-emerald-500" />,
  Logging: <Terminal className="w-4 h-4 text-amber-500" />,
  'Logging Audit': <Terminal className="w-4 h-4 text-amber-500" />,
  Security: <Shield className="w-4 h-4 text-rose-500" />,
  Clinical: <Stethoscope className="w-4 h-4 text-cyan-500" />,
  Financial: <DollarSign className="w-4 h-4 text-emerald-500" />,
  Reference: <FileText className="w-4 h-4 text-indigo-500" />,
  Dictionary: <FileText className="w-4 h-4 text-teal-500" />,
  'Engineering Timeline': <Clock className="w-4 h-4 text-violet-500" />,
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILTER_CATEGORIES = [
  { id: 'ALL', label: 'All' },
  { id: 'Dictionary', label: '📖 Dictionary (#)' },
  { id: 'Clinical', label: 'Clinical' },
  { id: 'Security', label: 'Security' },
  { id: 'Logging Audit', label: 'Logging & Audit' },
  { id: 'Financial', label: 'Financial' },
  { id: 'Reference', label: 'Reference' },
];

export default function CommandSearchModal({ isOpen, onClose }: SearchModalProps): React.JSX.Element | null {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const history = useHistory();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
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
  const filteredItems: DocItem[] = useMemo(() => {
    const rawQ = query.trim();
    const isHashSearch = rawQ.startsWith('#');
    const q = (isHashSearch ? rawQ.slice(1).trim() : rawQ).toLowerCase();

    return (catalogData as DocItem[]).filter((item) => {
      // If user typed '#' prefix, strictly match dictionary or reference terms
      if (isHashSearch) {
        const isDict =
          item.category === 'Dictionary' ||
          item.category === 'Reference' ||
          item.route.includes('dictionary') ||
          item.id.includes('dictionary');
        if (!isDict) return false;
        if (!q) return true;
        const titleMatch = item.title.toLowerCase().includes(q);
        const previewMatch = item.preview.toLowerCase().includes(q);
        const headingMatch = item.headings?.some((h) => h.title.toLowerCase().includes(q));
        return titleMatch || previewMatch || headingMatch;
      }

      if (selectedCategory === 'Dictionary') {
        const isDict =
          item.category === 'Dictionary' ||
          item.category === 'Reference' ||
          item.route.includes('dictionary') ||
          item.id.includes('dictionary');
        if (!isDict) return false;
      } else if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      if (!q) return true;
      const titleMatch = item.title.toLowerCase().includes(q);
      const previewMatch = item.preview.toLowerCase().includes(q);
      const headingMatch = item.headings?.some((h) => h.title.toLowerCase().includes(q));
      const categoryMatch = item.category.toLowerCase().includes(q);
      return titleMatch || previewMatch || headingMatch || categoryMatch;
    });
  }, [query, selectedCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Keyboard navigation & Focus Trap
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

  // Helper to highlight matching text
  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="search-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="search-header">
          <Search className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search architecture, diagrams, scenarios, or type '#' for Dictionary..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documentation"
          />
          {query ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="search-shortcut-badge">ESC</div>
          )}
        </div>

        {/* High-Contrast Quick Filter Categories Bar (Rule 4) */}
        <div className="search-category-filter">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`search-filter-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={isActive}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Results List */}
        <div className="search-results-container" ref={resultsRef}>
          {filteredItems.length === 0 ? (
            <div className="search-no-results">
              <p className="no-res-title">No matching architecture documents found</p>
              <p className="no-res-subtitle">
                Try searching for real-life flows: <strong>payment</strong>, <strong>emergency queue</strong>, <strong>rate limiting</strong>, or <strong>outbox</strong>.
              </p>
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

                  <h4 className="search-item-title">
                    {highlightMatch(item.title, query.trim())}
                  </h4>

                  {/* Snippet preview */}
                  <p className="search-item-snippet">
                    {highlightMatch(item.preview.slice(0, 160) + '...', query.trim())}
                  </p>

                  {/* Section sub-links */}
                  {item.headings && item.headings.length > 0 && (
                    <div className="search-item-headings">
                      {item.headings.slice(0, 3).map((h) => (
                        <button
                          key={h.slug}
                          type="button"
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
            {filteredItems.length} {filteredItems.length === 1 ? 'guide' : 'guides'} found
          </div>
        </div>
      </div>
    </div>
  );
}
