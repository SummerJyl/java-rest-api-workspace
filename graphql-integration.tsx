import React, { useState, useEffect, useMemo } from 'react';

// Mock GraphQL client (in real Netflix app, this would be Apollo Client or similar)
const mockGraphQLClient = {
  query: async (query, variables = {}) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Mock different data based on query type
    if (query.includes('getUserProfile')) {
      if (variables.userId === 'error') {
        throw new Error('network_error');
      }
      return {
        data: {
          user: {
            id: variables.userId || 12345,
            name: 'John Doe',
            email: 'john.doe@netflix.com',
            subscription: {
              plan: 'Premium',
              status: 'Active',
              renewalDate: '2024-08-15'
            },
            viewingHistory: {
              totalWatchTime: '2h 34m',
              lastActive: '2024-07-30',
              favoriteGenres: ['Action', 'Sci-Fi', 'Drama']
            }
          }
        }
      };
    }
    
    if (query.includes('getContentMetrics')) {
      return {
        data: {
          content: {
            id: variables.contentId,
            title: 'Stranger Things',
            metrics: {
              totalViews: 1250000,
              averageRating: 4.8,
              completionRate: 0.85,
              engagement: {
                likes: 98500,
                shares: 12400,
                comments: 5670
              }
            }
          }
        }
      };
    }
  }
};

// GraphQL queries (fragments for reusability)
const USER_PROFILE_FRAGMENT = `
  fragment UserProfile on User {
    id
    name
    email
    subscription {
      plan
      status
      renewalDate
    }
    viewingHistory {
      totalWatchTime
      lastActive
      favoriteGenres
    }
  }
`;

const GET_USER_PROFILE = `
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      ...UserProfile
    }
  }
  ${USER_PROFILE_FRAGMENT}
`;

const GET_CONTENT_METRICS = `
  query GetContentMetrics($contentId: ID!, $timeRange: TimeRange) {
    content(id: $contentId) {
      id
      title
      metrics(timeRange: $timeRange) {
        totalViews
        averageRating
        completionRate
        engagement {
          likes
          shares
          comments
        }
      }
    }
  }
`;

// Custom hook for GraphQL data fetching with caching
const useGraphQLQuery = (query, variables = {}, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simple cache key generation
  const cacheKey = useMemo(() => 
    `${query.slice(0, 50)}${JSON.stringify(variables)}`, 
    [query, variables]
  );
  
  // Mock cache (in real app, this would be Apollo Cache or similar)
  const [cache] = useState(new Map());
  
  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      if (cache.has(cacheKey) && !options.refetch) {
        setData(cache.get(cacheKey));
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await mockGraphQLClient.query(query, variables);
        cache.set(cacheKey, result.data);
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [query, variables, cacheKey, options.refetch]);
  
  const refetch = () => {
    cache.delete(cacheKey);
    setData(null);
    setLoading(true);
    setError(null);
  };
  
  return { data, loading, error, refetch };
};

// Netflix theme (same as before)
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

const cardStyles = {
  base: {
    backgroundColor: netflixTheme.colors.cardBackground,
    borderRadius: '8px',
    padding: '24px',
    border: `1px solid #404040`,
    transition: 'all 0.3s ease',
    color: netflixTheme.colors.textPrimary
  },
  hover: {
    backgroundColor: netflixTheme.colors.hoverBackground,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
  }
};

// Enhanced DataCard with GraphQL integration
const GraphQLDataCard = ({ 
  title, 
  query, 
  variables = {}, 
  dataMapper, 
  variant = 'summary',
  onInteract,
  className = ''
}) => {
  const { data, loading, error, refetch } = useGraphQLQuery(query, variables);
  
  // Transform GraphQL data for display
  const displayData = useMemo(() => {
    if (!data || !dataMapper) return {};
    return dataMapper(data);
  }, [data, dataMapper]);
  
  if (loading) {
    return (
      <div 
        className={className} 
        style={cardStyles.base}
        role="status" 
        aria-label="Loading data"
      >
        <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
          <div style={{
            height: '24px',
            backgroundColor: '#404040',
            borderRadius: '4px',
            marginBottom: '16px',
            width: '75%'
          }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[100, 85, 65].map((width, i) => (
              <div key={i} style={{
                height: '16px',
                backgroundColor: '#404040',
                borderRadius: '4px',
                width: `${width}%`
              }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    const getUserFriendlyError = (errorMsg) => {
      if (errorMsg.includes('network')) return "Connection issue. Please check your internet.";
      if (errorMsg.includes('timeout')) return "Request timed out. Please try again.";
      if (errorMsg.includes('permission')) return "Access denied. Please contact support.";
      return "Something went wrong. Please try again.";
    };
    
    return (
      <div 
        className={className}
        style={{
          ...cardStyles.base,
          backgroundColor: '#2d1b1b',
          borderColor: netflixTheme.colors.netflixRed
        }}
        role="alert"
      >
        <h3 style={{
          color: netflixTheme.colors.netflixRed,
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          Failed to Load {title}
        </h3>
        <p style={{
          color: netflixTheme.colors.textSecondary,
          marginBottom: '16px'
        }}>
          {getUserFriendlyError(error)}
        </p>
        <button 
          onClick={refetch}
          style={{
            backgroundColor: netflixTheme.colors.netflixRed,
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700'
          }}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div 
      className={className}
      style={cardStyles.base}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, cardStyles.hover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, cardStyles.base);
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: netflixTheme.colors.textPrimary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </h3>
        <button
          onClick={refetch}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${netflixTheme.colors.inputBorder}`,
            color: netflixTheme.colors.textSecondary,
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          title="Refresh data"
        >
          🔄 REFRESH
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(displayData).map(([key, value]) => (
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
              {variant === 'interactive' && onInteract ? (
                <button
                  onClick={() => onInteract(key, value)}
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
};

// Demo component showing GraphQL integration
const GraphQLDemo = () => {
  const [selectedUser, setSelectedUser] = useState('12345');
  const [interactionLog, setInteractionLog] = useState([]);
  
  // Data mappers to transform GraphQL responses
  const userDataMapper = (data) => ({
    name: data.user.name,
    email: data.user.email,
    plan: data.user.subscription.plan,
    status: data.user.subscription.status,
    lastActive: data.user.viewingHistory.lastActive,
    watchTime: data.user.viewingHistory.totalWatchTime,
    genres: data.user.viewingHistory.favoriteGenres.join(', ')
  });
  
  const contentDataMapper = (data) => ({
    title: data.content.title,
    views: data.content.metrics.totalViews.toLocaleString(),
    rating: `${data.content.metrics.averageRating}/5.0`,
    completion: `${(data.content.metrics.completionRate * 100).toFixed(1)}%`,
    likes: data.content.metrics.engagement.likes.toLocaleString(),
    shares: data.content.metrics.engagement.shares.toLocaleString()
  });
  
  const handleInteraction = (key, value) => {
    setInteractionLog(prev => [`GraphQL: Clicked ${key} = ${value}`, ...prev.slice(0, 4)]);
  };
  
  return (
    <div style={{ 
      backgroundColor: netflixTheme.colors.darkBackground,
      minHeight: '100vh',
      padding: '24px'
    }}>
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
          GraphQL Integration Demo
        </div>
      </div>
      
      {/* User selector */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          color: netflixTheme.colors.textSecondary,
          fontSize: '14px',
          display: 'block',
          marginBottom: '8px'
        }}>
          Select User ID:
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{
            backgroundColor: netflixTheme.colors.cardBackground,
            color: netflixTheme.colors.textPrimary,
            border: `1px solid ${netflixTheme.colors.inputBorder}`,
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '16px'
          }}
        >
          <option value="12345">User 12345 (John Doe)</option>
          <option value="67890">User 67890 (Loading...)</option>
          <option value="error">Error User (Test Error)</option>
        </select>
      </div>
      
      {/* GraphQL Data Cards */}
      <div style={{
        display: 'grid',
        gap: '32px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        marginBottom: '40px'
      }}>
        <GraphQLDataCard
          title="User Profile"
          query={GET_USER_PROFILE}
          variables={{ userId: selectedUser }}
          dataMapper={userDataMapper}
          variant="detailed"
        />
        
        <GraphQLDataCard
          title="Content Analytics"
          query={GET_CONTENT_METRICS}
          variables={{ contentId: 'stranger-things-s4', timeRange: 'LAST_30_DAYS' }}
          dataMapper={contentDataMapper}
          variant="interactive"
          onInteract={handleInteraction}
        />
      </div>
      
      {/* GraphQL Benefits showcase */}
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
          GraphQL Integration Benefits
        </h3>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {[
            { title: 'Query Optimization', desc: 'Fetch only needed fields, reduce payload size' },
            { title: 'Fragment Reuse', desc: 'Reusable data structures across components' },
            { title: 'Built-in Caching', desc: 'Automatic caching with cache invalidation' },
            { title: 'Type Safety', desc: 'GraphQL schema provides TypeScript types' },
            { title: 'Real-time Updates', desc: 'Subscriptions for live data updates' },
            { title: 'Error Handling', desc: 'Granular error handling per field' }
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
      
      {/* Interaction log */}
      {interactionLog.length > 0 && (
        <div style={cardStyles.base}>
          <h3 style={{
            color: netflixTheme.colors.textPrimary,
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '16px'
          }}>
            GraphQL Interaction Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {interactionLog.map((log, index) => (
              <div key={index} style={{
                fontSize: '14px',
                color: netflixTheme.colors.textSecondary,
                padding: '12px',
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                borderLeft: `3px solid ${netflixTheme.colors.netflixRed}`
              }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphQLDemo;