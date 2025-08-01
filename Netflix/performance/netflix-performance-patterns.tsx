import React, { useState, useCallback, useMemo, useRef, useEffect, memo, Suspense, lazy } from 'react';

// Lazy loaded components for code splitting demo
const HeavyComponent = lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: () => (
          <div className="p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg">
            <h4 className="font-semibold mb-2">Heavy Component Loaded!</h4>
            <p className="text-sm text-gray-300">This component was lazy loaded to improve initial bundle size.</p>
          </div>
        )
      });
    }, 1000); // Simulate loading time
  })
);

// Memoized VideoCard component to prevent unnecessary re-renders
const VideoCard = memo(({ video, onPlay, onAddToList, isPlaying, onImageLoad }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    onImageLoad?.();
  }, [onImageLoad]);

  return (
    <div 
      ref={cardRef}
      className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200 will-change-transform"
    >
      <div className="aspect-video bg-gray-700 relative overflow-hidden">
        {inView && (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
            <img
              src={`https://picsum.photos/400/225?random=${video.id}`}
              alt={video.title}
              onLoad={handleImageLoad}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
            />
          </>
        )}
        
        {/* Play overlay */}
        {isPlaying === video.id && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-4xl">▶️</div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 truncate">{video.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{video.description}</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => onPlay(video.id)}
            className="flex-1 bg-white text-black hover:bg-gray-200 px-3 py-2 rounded font-medium text-sm transition-colors"
          >
            ▶️ Play
          </button>
          <button
            onClick={() => onAddToList(video.id)}
            className="border border-gray-600 hover:border-gray-500 px-3 py-2 rounded text-sm transition-colors"
          >
            ➕
          </button>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

// Virtual scrolling hook for large lists
const useVirtualScrolling = (items, containerHeight = 400, itemHeight = 300) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = items.slice(visibleStart, visibleEnd).map((item, index) => ({
    ...item,
    index: visibleStart + index
  }));

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    containerRef: setContainerRef
  };
};

// Performance monitoring hook
const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0
  });

  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    // Get memory usage if available
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

    setMetrics(prev => ({
      ...prev,
      renderTime: renderTime.toFixed(2),
      memoryUsage: (memoryUsage / 1024 / 1024).toFixed(2),
      componentCount: document.querySelectorAll('*').length
    }));

    startTime.current = performance.now();
  });

  return metrics;
};

// Debounced search hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NetflixPerformancePatterns = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [showHeavyComponent, setShowHeavyComponent] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [virtualScrollEnabled, setVirtualScrollEnabled] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const metrics = usePerformanceMonitor();

  // Generate mock video data
  const allVideos = useMemo(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `Movie ${i + 1}`,
      description: `An exciting ${['action', 'drama', 'comedy', 'thriller', 'sci-fi'][i % 5]} movie that will keep you entertained.`,
      genre: ['action', 'drama', 'comedy', 'thriller', 'sci-fi'][i % 5],
      rating: (3 + Math.random() * 2).toFixed(1)
    }))
  , []);

  // Filtered videos with memoization
  const filteredVideos = useMemo(() => {
    if (!debouncedSearch) return allVideos.slice(0, 50); // Limit initial render
    
    return allVideos.filter(video =>
      video.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      video.genre.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).slice(0, 50);
  }, [debouncedSearch, allVideos]);

  // Virtual scrolling setup
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    containerRef
  } = useVirtualScrolling(filteredVideos, 600, 320);

  // Memoized callbacks to prevent child re-renders
  const handlePlay = useCallback((videoId) => {
    setCurrentlyPlaying(prev => prev === videoId ? null : videoId);
  }, []);

  const handleAddToList = useCallback((videoId) => {
    console.log(`Added video ${videoId} to list`);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'lazy-loading', label: 'Lazy Loading' },
    { id: 'virtualization', label: 'Virtualization' },
    { id: 'monitoring', label: 'Performance Monitoring' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-red-600">
            Netflix Performance Optimization
          </h1>
          <div className="text-sm text-gray-400">
            Render: {metrics.renderTime}ms | Memory: {metrics.memoryUsage}MB | DOM: {metrics.componentCount}
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex border-b border-gray-700">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === index
                    ? 'text-white border-b-2 border-red-600'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 0 && (
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Performance Optimization Overview</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">Code Splitting</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Dynamic imports with React.lazy()</li>
                        <li>• Route-based code splitting</li>
                        <li>• Component-level splitting</li>
                        <li>• Webpack bundle analysis</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">Image Optimization</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Lazy loading with Intersection Observer</li>
                        <li>• WebP format with fallbacks</li>
                        <li>• Responsive images with srcset</li>
                        <li>• Progressive loading placeholders</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">React Optimization</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• React.memo for component memoization</li>
                        <li>• useCallback for function stability</li>
                        <li>• useMemo for expensive calculations</li>
                        <li>• Virtual scrolling for large lists</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">Bundle Optimization</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Tree shaking unused code</li>
                        <li>• Webpack bundle splitting</li>
                        <li>• Gzip/Brotli compression</li>
                        <li>• CDN optimization</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">Runtime Performance</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Debounced search inputs</li>
                        <li>• Request deduplication</li>
                        <li>• Service worker caching</li>
                        <li>• Memory leak prevention</li>
                      </ul>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">Monitoring</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Performance API metrics</li>
                        <li>• Core Web Vitals tracking</li>
                        <li>• Memory usage monitoring</li>
                        <li>• Real User Monitoring (RUM)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Lazy Loading Strategies</h3>
                  
                  <div className="space-y-6">
                    {/* Component Lazy Loading */}
                    <div>
                      <h4 className="font-medium mb-3">Component Lazy Loading</h4>
                      <div className="flex gap-4 mb-4">
                        <button
                          onClick={() => setShowHeavyComponent(!showHeavyComponent)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                        >
                          {showHeavyComponent ? 'Hide' : 'Load'} Heavy Component
                        </button>
                      </div>
                      
                      {showHeavyComponent && (
                        <Suspense fallback={
                          <div className="p-4 bg-gray-800 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                          </div>
                        }>
                          <HeavyComponent />
                        </Suspense>
                      )}
                    </div>

                    {/* Image Lazy Loading */}
                    <div>
                      <h4 className="font-medium mb-3">Image Lazy Loading Demo</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        Images load only when they enter the viewport. Images loaded: {imagesLoaded}
                      </p>
                      
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Search movies... (debounced 300ms)"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-600 focus:border-red-500 focus:outline-none px-3 py-2 rounded text-white"
                        />
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                          {filteredVideos.slice(0, 6).map((video) => (
                            <VideoCard
                              key={video.id}
                              video={video}
                              onPlay={handlePlay}
                              onAddToList={handleAddToList}
                              isPlaying={currentlyPlaying}
                              onImageLoad={handleImageLoad}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Virtual Scrolling</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setVirtualScrollEnabled(!virtualScrollEnabled)}
                        className={`px-4 py-2 rounded transition-colors ${
                          virtualScrollEnabled 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        Virtual Scrolling: {virtualScrollEnabled ? 'ON' : 'OFF'}
                      </button>
                      <span className="text-sm text-gray-400">
                        Total items: {allVideos.length} | 
                        Rendered: {virtualScrollEnabled ? visibleItems.length : Math.min(filteredVideos.length, 50)}
                      </span>
                    </div>

                    {virtualScrollEnabled ? (
                      <div 
                        ref={containerRef}
                        className="h-96 overflow-auto bg-gray-800 rounded-lg"
                        onScroll={handleScroll}
                      >
                        <div style={{ height: totalHeight, position: 'relative' }}>
                          <div 
                            style={{ 
                              transform: `translateY(${offsetY}px)`,
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
                          >
                            {visibleItems.map((video) => (
                              <div key={video.id} style={{ height: '300px' }}>
                                <VideoCard
                                  video={video}
                                  onPlay={handlePlay}
                                  onAddToList={handleAddToList}
                                  isPlaying={currentlyPlaying}
                                  onImageLoad={handleImageLoad}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-96 overflow-auto bg-gray-800 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredVideos.slice(0, 50).map((video) => (
                            <VideoCard
                              key={video.id}
                              video={video}
                              onPlay={handlePlay}
                              onAddToList={handleAddToList}
                              isPlaying={currentlyPlaying}
                              onImageLoad={handleImageLoad}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Performance Monitoring</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">{metrics.renderTime}ms</div>
                      <div className="text-sm text-gray-400">Render Time</div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">{metrics.memoryUsage}MB</div>
                      <div className="text-sm text-gray-400">Memory Usage</div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-400">{metrics.componentCount}</div>
                      <div className="text-sm text-gray-400">DOM Elements</div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-400">{imagesLoaded}</div>
                      <div className="text-sm text-gray-400">Images Loaded</div>
                    </div>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Performance Best Practices</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-red-400 mb-2">React Optimization:</h5>
                        <ul className="text-gray-300 space-y-1">
                          <li>• Use React.memo() for pure components</li>
                          <li>• Implement useCallback() for event handlers</li>
                          <li>• Apply useMemo() for expensive calculations</li>
                          <li>• Avoid inline objects and functions in JSX</li>
                          <li>• Use React DevTools Profiler</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-red-400 mb-2">Bundle Optimization:</h5>
                        <ul className="text-gray-300 space-y-1">
                          <li>• Implement code splitting with React.lazy()</li>
                          <li>• Use webpack-bundle-analyzer</li>
                          <li>• Enable tree shaking for unused code</li>
                          <li>• Optimize third-party dependencies</li>
                          <li>• Implement proper caching strategies</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Tips */}
        <section className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Netflix Performance Interview Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium text-red-400 mb-3">Key Performance Metrics:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>First Contentful Paint (FCP):</strong> {'<'} 1.8s</li>
                <li>• <strong>Largest Contentful Paint (LCP):</strong> {'<'} 2.5s</li>
                <li>• <strong>Cumulative Layout Shift (CLS):</strong> {'<'} 0.1</li>
                <li>• <strong>First Input Delay (FID):</strong> {'<'} 100ms</li>
                <li>• <strong>Time to Interactive (TTI):</strong> {'<'} 3.8s</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-red-400 mb-3">Implementation Strategy:</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Measure first, optimize second</li>
                <li>• Focus on user-perceived performance</li>
                <li>• Implement progressive loading strategies</li>
                <li>• Use performance budgets and CI/CD checks</li>
                <li>• Monitor real-world user metrics</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NetflixPerformancePatterns;