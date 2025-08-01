import React, { useState, useRef, useEffect } from 'react';

// Icon components using emojis
const Play = ({ size = 20 }) => <span style={{ fontSize: `${size}px` }}>▶️</span>;
const Pause = ({ size = 20 }) => <span style={{ fontSize: `${size}px` }}>⏸️</span>;
const Volume2 = ({ size = 20 }) => <span style={{ fontSize: `${size}px` }}>🔊</span>;
const VolumeX = ({ size = 20 }) => <span style={{ fontSize: `${size}px` }}>🔇</span>;
const SkipForward = ({ size = 20 }) => <span style={{ fontSize: `${size}px` }}>⏭️</span>;
const SkipBack = ({ size = 20 }) => <span style={{ fontSize: `${size}px` }}>⏮️</span>;
const Plus = ({ size = 16 }) => <span style={{ fontSize: `${size}px` }}>➕</span>;
const ThumbsUp = ({ size = 16 }) => <span style={{ fontSize: `${size}px` }}>👍</span>;
const Info = ({ size = 16 }) => <span style={{ fontSize: `${size}px` }}>ℹ️</span>;

const NetflixA11yPatterns = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [showDetails, setShowDetails] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  
  const videoPlayerRef = useRef(null);
  const skipToContentRef = useRef(null);
  const announcementRef = useRef(null);

  // Announce to screen readers
  const announce = (message) => {
    setAnnouncements(prev => [...prev, { id: Date.now(), message }]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', content: 'Core A11y Principles' },
    { id: 'navigation', label: 'Navigation', content: 'Keyboard & Focus Management' },
    { id: 'media', label: 'Media Player', content: 'Video Player Accessibility' },
    { id: 'content', label: 'Content Cards', content: 'Interactive Content Patterns' }
  ];

  const handlePlayPause = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    announce(newState ? 'Video playing' : 'Video paused');
  };

  const handleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    announce(newState ? 'Audio muted' : 'Audio unmuted');
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    announce(`Volume set to ${newVolume} percent`);
  };

  const handleSkip = (direction) => {
    announce(`Skipped ${direction} 10 seconds`);
  };

  // Focus management for modal
  useEffect(() => {
    if (showDetails) {
      const focusableElements = document.querySelectorAll(
        '[data-modal] button, [data-modal] [href], [data-modal] input, [data-modal] select, [data-modal] textarea, [data-modal] [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement.focus();
      }
    }
  }, [showDetails]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Live Region for Announcements */}
      <div 
        ref={announcementRef}
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {announcements.map(announcement => (
          <div key={announcement.id}>{announcement.message}</div>
        ))}
      </div>

      {/* Skip to Content Link */}
      <a
        ref={skipToContentRef}
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header with Proper Landmark */}
      <header className="p-6 border-b border-gray-800" role="banner">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">
            Netflix A11y Patterns
          </h1>
          <nav aria-label="Main navigation" role="navigation">
            <button 
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black px-3 py-2"
              aria-label="Open user menu"
            >
              Profile
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content" role="main" className="p-6">
        {/* Tab Navigation with ARIA */}
        <section aria-labelledby="patterns-heading">
          <h2 id="patterns-heading" className="text-xl font-semibold mb-6">
            Accessibility Implementation Patterns
          </h2>
          
          <div className="mb-8">
            <div role="tablist" aria-labelledby="patterns-heading" className="flex border-b border-gray-700">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={selectedTab === index}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  tabIndex={selectedTab === index ? 0 : -1}
                  className={`px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black ${
                    selectedTab === index
                      ? 'text-white border-b-2 border-red-600'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setSelectedTab(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      setSelectedTab((prev) => (prev + 1) % tabs.length);
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      setSelectedTab((prev) => (prev - 1 + tabs.length) % tabs.length);
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
                className={`mt-6 ${selectedTab === index ? 'block' : 'hidden'}`}
                tabIndex={0}
              >
                {index === 0 && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Core A11y Principles</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-red-400 mb-2">PERCEIVABLE</h4>
                          <ul className="text-gray-300 space-y-1 text-sm">
                            <li>• Alt text for images</li>
                            <li>• Captions for videos</li>
                            <li>• Sufficient color contrast</li>
                            <li>• Scalable text</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-400 mb-2">OPERABLE</h4>
                          <ul className="text-gray-300 space-y-1 text-sm">
                            <li>• Keyboard navigation</li>
                            <li>• No seizure triggers</li>
                            <li>• Sufficient time limits</li>
                            <li>• Clear focus indicators</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-400 mb-2">UNDERSTANDABLE</h4>
                          <ul className="text-gray-300 space-y-1 text-sm">
                            <li>• Readable text</li>
                            <li>• Predictable functionality</li>
                            <li>• Input assistance</li>
                            <li>• Error identification</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-400 mb-2">ROBUST</h4>
                          <ul className="text-gray-300 space-y-1 text-sm">
                            <li>• Valid HTML markup</li>
                            <li>• Compatible with assistive tech</li>
                            <li>• Future-proof code</li>
                            <li>• Semantic HTML elements</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {index === 1 && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Keyboard Navigation Demo</h3>
                      <p className="text-gray-300 mb-4">Try using Tab, Shift+Tab, Arrow keys, Enter, and Space:</p>
                      
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <button className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 px-4 py-2 rounded">
                            Primary Action
                          </button>
                          <button className="border border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 px-4 py-2 rounded">
                            Secondary Action
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="search-input" className="block text-sm font-medium">
                            Search Movies
                          </label>
                          <input
                            id="search-input"
                            type="text"
                            placeholder="Type to search..."
                            className="w-full bg-gray-800 border border-gray-600 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 px-3 py-2 rounded text-white placeholder-gray-400"
                            aria-describedby="search-help"
                          />
                          <div id="search-help" className="text-xs text-gray-400">
                            Press Enter to search, Escape to clear
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {index === 2 && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Accessible Video Player</h3>
                      
                      <div 
                        ref={videoPlayerRef}
                        className="bg-black rounded-lg overflow-hidden"
                        role="region"
                        aria-label="Video player"
                      >
                        <div className="aspect-video bg-gradient-to-br from-red-900 via-black to-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🎬</div>
                            <p className="text-xl">Stranger Things</p>
                            <p className="text-sm text-gray-400">Season 4, Episode 1</p>
                          </div>
                        </div>

                        <div className="p-4 bg-black bg-opacity-80">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={handlePlayPause}
                                className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black px-4 py-2 rounded font-medium"
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                              >
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                {isPlaying ? 'Pause' : 'Play'}
                              </button>

                              <button
                                onClick={() => handleSkip('backward')}
                                className="p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                                aria-label="Skip backward 10 seconds"
                              >
                                <SkipBack size={20} />
                              </button>

                              <button
                                onClick={() => handleSkip('forward')}
                                className="p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                                aria-label="Skip forward 10 seconds"
                              >
                                <SkipForward size={20} />
                              </button>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={handleMute}
                                  className="p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                                  aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                                >
                                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                </button>
                                
                                <div className="flex items-center gap-2">
                                  <label htmlFor="volume-slider" className="sr-only">
                                    Volume control
                                  </label>
                                  <input
                                    id="volume-slider"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                                    aria-label={`Volume ${isMuted ? 0 : volume} percent`}
                                    disabled={isMuted}
                                  />
                                  <span className="text-xs text-gray-400 w-8">
                                    {isMuted ? 0 : volume}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full bg-gray-600 rounded-full h-1">
                            <div 
                              className="bg-red-600 h-1 rounded-full transition-all duration-300" 
                              style={{width: '35%'}}
                              role="progressbar"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-valuenow="35"
                              aria-label="Video progress: 35% complete"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>12:34</span>
                            <span>45:67</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {index === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-900 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Interactive Content Cards</h3>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((item) => (
                          <article 
                            key={item}
                            className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 focus-within:ring-offset-black"
                            aria-labelledby={`title-${item}`}
                          >
                            <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                              <span className="text-4xl">🎭</span>
                            </div>
                            
                            <div className="p-4">
                              <h4 id={`title-${item}`} className="font-semibold mb-2">
                                Movie Title {item}
                              </h4>
                              <p className="text-sm text-gray-400 mb-3">
                                A thrilling adventure that will keep you on the edge of your seat.
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                  <button
                                    className="p-2 bg-white text-black rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    aria-label={`Play Movie Title ${item}`}
                                  >
                                    <Play size={16} />
                                  </button>
                                  
                                  <button
                                    className="p-2 border border-gray-600 rounded-full hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    aria-label={`Add Movie Title ${item} to my list`}
                                  >
                                    <Plus size={16} />
                                  </button>
                                  
                                  <button
                                    className="p-2 border border-gray-600 rounded-full hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    aria-label={`Like Movie Title ${item}`}
                                  >
                                    <ThumbsUp size={16} />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => setShowDetails(true)}
                                  className="p-2 border border-gray-600 rounded-full hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                  aria-label={`More information about Movie Title ${item}`}
                                >
                                  <Info size={16} />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Modal with Focus Management */}
        {showDetails && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-modal
          >
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 id="modal-title" className="text-xl font-semibold">
                    Movie Details
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 p-2 rounded"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-300">
                    This modal demonstrates proper focus management, ARIA attributes, and keyboard navigation patterns for Netflix-style overlays.
                  </p>
                  
                  <div className="flex gap-4">
                    <button className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 px-4 py-2 rounded">
                      Watch Now
                    </button>
                    <button 
                      onClick={() => setShowDetails(false)}
                      className="border border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 px-4 py-2 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Best Practices Summary */}
        <section className="mt-12 bg-gray-900 p-6 rounded-lg" aria-labelledby="best-practices">
          <h2 id="best-practices" className="text-xl font-semibold mb-4">
            Netflix A11y Best Practices
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-red-400 mb-3">Interview Talking Points:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• ARIA attributes for complex UI states</li>
                <li>• Proper focus management in SPAs</li>
                <li>• Screen reader optimization</li>
                <li>• Keyboard-only navigation support</li>
                <li>• Color contrast compliance (WCAG AA)</li>
                <li>• Live regions for dynamic content</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-red-400 mb-3">Implementation Details:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Skip links for keyboard users</li>
                <li>• Semantic HTML landmarks</li>
                <li>• Alternative text for media</li>
                <li>• Form labels and error handling</li>
                <li>• Modal focus trapping patterns</li>
                <li>• Progressive enhancement approach</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NetflixA11yPatterns;