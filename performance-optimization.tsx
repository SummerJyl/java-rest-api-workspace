import React, { useState, useEffect, useMemo, useCallback, memo, lazy, Suspense } from 'react';

// Performance-optimized Netflix theme
const netflixTheme = {
  colors: {
    netflixRed: '#e50914',
    darkBackground: '#141414',
    cardBackground: '#2f2f2f',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    textMuted: '#808080',
    inputBorder: '#737373',
    hoverBackground: '#404040'
  }
};

// 1. MEMOIZED STYLES - Prevent style object recreation on every render
const cardStyles = {
  base: {
    backgroundColor: netflixTheme.colors.cardBackground,
    borderRadius: '8px',
    padding: '24px',
    border: `1px solid #404040`,
    transition: 'all 0.3s ease',
    color: netflixTheme.colors.textPrimary
  },
  loading: {
    backgroundColor: netflixTheme.colors.cardBackground,
    borderRadius: '8px',
    padding: '24px',
    border: `1px solid #404040`,
    color: netflixTheme.colors.textPrimary
  }
};

// 2. LAZY LOADING - Components loaded only when needed
const LazyContentAnalytics = lazy(() => 
  new Promise(resolve => {
    // Simulate dynamic import with loading delay
    setTimeout(() => {
      resolve({
        default: ({ data, onInteract }) => (
          <div style={{
            ...cardStyles.base,
            borderLeft: `4px solid ${netflixTheme.colors.netflixRed}`
          }}>
            <h3 style={{
              color: netflixTheme.colors.textPrimary,
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              Content Analytics (Lazy Loaded)
            </h3>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              {Object.entries(data).map(([key, value]) => (
                <div key={key} style={{
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }} onClick={() => onInteract?.(key, value)}>
                  <div style={{ color: netflixTheme.colors.textSecondary, fontSize: '12px' }}>
                    {key.toUpperCase()}
                  </div>
                  <div style={{ color: netflixTheme.colors.textPrimary, fontSize: '16px', fontWeight: '600' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      });
    }, 1000);
  })
);

// 3. MEMOIZED COMPONENT - Prevents unnecessary re-renders
const OptimizedDataCard = memo(({ 
  title, 
  data, 
  isLoading, 
  error, 
  onInteract,
  variant = 'default'
}) => {
  // Memoized error message computation
  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error.includes('network')) return "Connection issue. Check your internet.";
    if (error.includes('timeout')) return "Request timed out. Try again.";
    return "Something went wrong. Please try again.";
  }, [error]);

  // Memoized data entries to prevent unnecessary recalculations
  const dataEntries = useMemo(() => {
    return Object.entries(data || {});
  }, [data]);

  if (isLoading) {
    return (
      <div style={cardStyles.loading} role="status" aria-label="Loading">
        <div className="skeleton-loader">
          <div style={{
            height: '24px',
            backgroundColor: '#404040',
            borderRadius: '4px',
            marginBottom: '16px',
            width: '75%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
          {[100, 85, 65].map((width, i) => (
            <div key={i} style={{
              height: '16px',
              backgroundColor: '#404040',
              borderRadius: '4px',
              width: `${width}%`,
              marginBottom: '8px',
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        ...cardStyles.base,
        backgroundColor: '#2d1b1b',
        borderColor: netflixTheme.colors.netflixRed
      }} role="alert">
        <h3 style={{ color: netflixTheme.colors.netflixRed, fontWeight: '600', marginBottom: '8px' }}>
          Error Loading {title}
        </h3>
        <p style={{ color: netflixTheme.colors.textSecondary, marginBottom: '16px' }}>
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div style={cardStyles.base}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '700',
        color: netflixTheme.colors.textPrimary,
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {dataEntries.map(([key, value]) => (
          <div key={key} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <dt style={{
              fontWeight: '600',
              color: netflixTheme.colors.textSecondary,
              fontSize: '14px',
              width: '40%'
            }}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            </dt>
            <dd style={{
              width: '60%',
              color: netflixTheme.colors.textPrimary,
              fontSize: '16px',
              textAlign: 'right'
            }}>
              {variant === 'interactive' ? (
                <button
                  onClick={() => onInteract?.(key, value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: netflixTheme.colors.netflixRed,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {String(value)}
                </button>
              ) : (
                String(value)
              )}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
});

// 4. VIRTUAL SCROLLING SIMULATION - For large datasets
const VirtualizedList = memo(({ items, itemHeight = 80, containerHeight = 400 }) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  return (
    <div style={{
      ...cardStyles.base,
      height: containerHeight,
      overflow: 'auto'
    }}
    onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <h3 style={{
        color: netflixTheme.colors.textPrimary,
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px',
        position: 'sticky',
        top: 0,
        backgroundColor: netflixTheme.colors.cardBackground,
        padding: '8px 0',
        zIndex: 1
      }}>
        Virtual Scroll ({items.length.toLocaleString()} items)
      </h3>
      
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item) => (
            <div key={item.index} style={{
              height: itemHeight,
              padding: '12px',
              borderBottom: '1px solid #404040',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ color: netflixTheme.colors.textPrimary }}>
                Item {item.index + 1}: {item.title}
              </span>
              <span style={{ color: netflixTheme.colors.textSecondary }}>
                {item.views} views
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// 5. DEBOUNCED SEARCH - Prevents excessive API calls
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

const SearchComponent = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized search function
  const performSearch = useCallback(async (term) => {
    if (!term) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResults = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      title: `${term} Result ${i + 1}`,
      type: i % 2 === 0 ? 'Movie' : 'Series',
      rating: (Math.random() * 2 + 3).toFixed(1)
    }));
    
    setResults(mockResults);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  return (
    <div style={cardStyles.base}>
      <h3 style={{
        color: netflixTheme.colors.textPrimary,
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px'
      }}>
        Debounced Search (300ms delay)
      </h3>
      
      <input
        type="text"
        placeholder="Search content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#333',
          border: `1px solid ${netflixTheme.colors.inputBorder}`,
          borderRadius: '4px',
          color: netflixTheme.colors.textPrimary,
          fontSize: '16px',
          marginBottom: '16px'
        }}
      />
      
      {isSearching && (
        <div style={{ color: netflixTheme.colors.textSecondary, fontSize: '14px', marginBottom: '12px' }}>
          Searching...
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {results.map((result) => (
          <div key={result.id} style={{
            padding: '12px',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ color: netflixTheme.colors.textPrimary, fontWeight: '600' }}>
                {result.title}
              </div>
              <div style={{ color: netflixTheme.colors.textSecondary, fontSize: '12px' }}>
                {result.type}
              </div>
            </div>
            <div style={{ color: netflixTheme.colors.netflixRed, fontWeight: '600' }}>
              ⭐ {result.rating}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Main Performance Demo Component
const PerformanceDemo = () => {
  const [dataLoadingStates, setDataLoadingStates] = useState({
    user: false,
    content: false,
    analytics: false
  });
  
  const [showLazyComponent, setShowLazyComponent] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Memoized data objects
  const userData = useMemo(() => ({
    name: 'John Doe',
    plan: 'Premium',
    watchTime: '24h 32m',
    devices: 3,
    downloads: 12
  }), []);

  const contentData = useMemo(() => ({
    totalTitles: '15,000+',
    newThisWeek: 47,
    trending: 'Stranger Things 4',
    topGenre: 'Sci-Fi Drama',
    avgRating: 4.2
  }), []);

  const analyticsData = useMemo(() => ({
    views: '2.4M',
    engagement: '87%',
    completion: '92%',
    shares: '45K'
  }), []);

  // Generate large dataset for virtual scrolling
  const virtualScrollData = useMemo(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      title: `Content Title ${i + 1}`,
      views: Math.floor(Math.random() * 1000000).toLocaleString()
    })), []
  );

  // Memoized callback functions
  const handleInteraction = useCallback((key, value) => {
    setInteractionCount(prev => prev + 1);
    console.log(`Interaction ${interactionCount + 1}: ${key} = ${value}`);
  }, [interactionCount]);

  const simulateLoading = useCallback((dataType) => {
    setDataLoadingStates(prev => ({ ...prev, [dataType]: true }));
    setTimeout(() => {
      setDataLoadingStates(prev => ({ ...prev, [dataType]: false }));
    }, 2000);
  }, []);

  return (
    <div style={{ 
      backgroundColor: netflixTheme.colors.darkBackground,
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Add CSS animation for pulse effect */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: `1px solid #404040`
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: '900',
          color: netflixTheme.colors.netflixRed,
          letterSpacing: '-1px'
        }}>
          NETFLIX
        </div>
        <div style={{
          marginLeft: '32px',
          fontSize: '24px',
          fontWeight: '300',
          color: netflixTheme.colors.textPrimary
        }}>
          Performance Optimization Demo
        </div>
      </div>

      {/* Performance Controls */}
      <div style={{
        ...cardStyles.base,
        marginBottom: '32px'
      }}>
        <h3 style={{
          color: netflixTheme.colors.textPrimary,
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          Performance Controls
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['user', 'content', 'analytics'].map(type => (
            <button
              key={type}
              onClick={() => simulateLoading(type)}
              disabled={dataLoadingStates[type]}
              style={{
                backgroundColor: netflixTheme.colors.netflixRed,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: dataLoadingStates[type] ? 'not-allowed' : 'pointer',
                opacity: dataLoadingStates[type] ? 0.6 : 1
              }}
            >
              {dataLoadingStates[type] ? `Loading ${type}...` : `Test ${type} loading`}
            </button>
          ))}
          <button
            onClick={() => setShowLazyComponent(!showLazyComponent)}
            style={{
              backgroundColor: '#333',
              color: 'white',
              border: `1px solid ${netflixTheme.colors.inputBorder}`,
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showLazyComponent ? 'Hide' : 'Show'} Lazy Component
          </button>
        </div>
        <div style={{
          marginTop: '12px',
          fontSize: '14px',
          color: netflixTheme.colors.textSecondary
        }}>
          Interactions tracked: {interactionCount}
        </div>
      </div>

      {/* Optimized Data Cards Grid */}
      <div style={{
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        marginBottom: '32px'
      }}>
        <OptimizedDataCard
          title="User Profile"
          data={userData}
          isLoading={dataLoadingStates.user}
          variant="interactive"
          onInteract={handleInteraction}
        />
        
        <OptimizedDataCard
          title="Content Library"
          data={contentData}
          isLoading={dataLoadingStates.content}
        />
        
        <SearchComponent />
      </div>

      {/* Virtual Scrolling Demo */}
      <div style={{ marginBottom: '32px' }}>
        <VirtualizedList 
          items={virtualScrollData}
          itemHeight={60}
          containerHeight={300}
        />
      </div>

      {/* Lazy Loaded Component */}
      {showLazyComponent && (
        <Suspense fallback={
          <div style={cardStyles.base}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ color: netflixTheme.colors.textSecondary }}>
                Loading analytics component...
              </div>
            </div>
          </div>
        }>
          <LazyContentAnalytics 
            data={analyticsData}
            onInteract={handleInteraction}
          />
        </Suspense>
      )}

      {/* Performance Tips */}
      <div style={{
        ...cardStyles.base,
        marginTop: '32px'
      }}>
        <h3 style={{
          color: netflixTheme.colors.textPrimary,
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          Performance Optimizations Implemented
        </h3>
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {[
            { title: 'React.memo()', desc: 'Prevents unnecessary re-renders of components' },
            { title: 'useMemo()', desc: 'Memoizes expensive calculations and object references' },
            { title: 'useCallback()', desc: 'Memoizes functions to prevent child re-renders' },
            { title: 'Lazy Loading', desc: 'Components loaded only when needed with Suspense' },
            { title: 'Virtual Scrolling', desc: 'Renders only visible items in large lists' },
            { title: 'Debounced Search', desc: 'Reduces API calls with 300ms delay' },
            { title: 'Style Memoization', desc: 'Prevents style object recreation on renders' },
            { title: 'Bundle Splitting', desc: 'Code splitting with dynamic imports' }
          ].map(item => (
            <div key={item.title} style={{
              padding: '16px',
              backgroundColor: '#1a1a1a',
              borderRadius: '4px',
              borderLeft: `3px solid ${netflixTheme.colors.netflixRed}`
            }}>
              <div style={{
                color: netflixTheme.colors.textPrimary,
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                {item.title}
              </div>
              <div style={{
                color: netflixTheme.colors.textSecondary,
                fontSize: '14px'
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDemo;