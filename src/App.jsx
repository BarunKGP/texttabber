import React, { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";

const App = ({ initialTabs, close }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(initialTabs);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const fuse = new Fuse(initialTabs, {
    keys: ["title", "url"],
    threshold: 0.35,
  });

  useEffect(() => {
    setResults(
      query.trim() === "" ? initialTabs : fuse.search(query).map((r) => r.item),
    );
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const forceFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        // On some sites, selecting the text helps "lock" the focus
        inputRef.current.select();
      }
    };

    // Immediate attempt
    forceFocus();

    // Secondary attempt to bypass site scripts that re-grab focus
    const timeoutId = setTimeout(forceFocus, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();

    // Global listener for clicks outside the modal
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !e.composedPath().includes(containerRef.current)
      ) {
        close();
      }
    };

    // Listener for when the window loses focus (like Ctrl+L to address bar)
    const handleWindowBlur = () => {
      close();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [close]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % results.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      e.preventDefault();
    } else if (e.key === "Enter" && results[selectedIndex]) {
      chrome.runtime.sendMessage({
        action: "switchToTab",
        tabId: results[selectedIndex].id,
      });
      close();
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div className="tt-overlay" onClick={close}>
      <div
        className="tt-modal"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tt-search-container">
          <input
            ref={inputRef}
            className="tt-input"
            placeholder="Search tabs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={(e) => {
              // Only close if the focus moved outside the shadow root entirely
              if (!e.relatedTarget) {
                setTimeout(close, 150);
              }
            }}
          />
        </div>
        <div className="tt-results">
          {results.map((tab, index) => (
            <div
              key={tab.id}
              className={`tt-item ${index === selectedIndex ? "selected" : ""}`}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => {
                chrome.runtime.sendMessage({
                  action: "switchToTab",
                  tabId: tab.id,
                });
                close();
              }}
            >
              <img src={tab.favIcon || ""} className="tt-icon" />
              <div className="tt-info">
                <span className="tt-title">{tab.title}</span>
                <span className="tt-url">{tab.url}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="tt-footer">
          <span>↑↓ Navigate</span>
          <span>↵ Switch</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default App;
