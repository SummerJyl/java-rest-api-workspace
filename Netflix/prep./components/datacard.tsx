import React, { useState } from 'react';

// Netflix-themed styled components
const netflixTheme = {
  colors: {
    netflixRed: '#e50914',
    darkBackground: '#141414',
    cardBackground: '#2f2f2f',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    textMuted: '#808080',
    inputBackground: '#333333',
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
  },
  interactive: {
    background: `linear-gradient(135deg, ${netflixTheme.colors.cardBackground} 0%, #1a1a1a 100%)`,
    border: `1px solid ${netflixTheme.colors.netflixRed}`,
    boxShadow: `0 0 20px rgba(229, 9, 20, 0.2)`
  }
};

const buttonStyles = {
  primary: {
    backgroundColor: netflixTheme.colors.netflixRed,
    color: 'white',
    padding: '12px 24px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  secondary: {
    backgroundColor: 'transparent',
    color: netflixTheme.colors.textSecondary,
    border: `1px solid ${netflixTheme.colors.inputBorder}`,
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  interactive: {
    backgroundColor: 'transparent',
    color: netflixTheme.colors.netflixRed,
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: '2px'
  }
};

// TypeScript interfaces for props
interface DataCardProps {
  title: string;
  data: Record<string, any>;
  variant?: 'summary' | 'detailed' | 'interactive';
  isLoading?: boolean;
  error?: string | null;
  onInteract?: (key: string, value: any) => void;
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  data,
  variant = 'summary',
  isLoading = false,
  error = null,
  onInteract,
  className = ''
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Handle loading state
  if (isLoading) {
    return (
      <div 
        className={className} 
        style={cardStyles.base}
        role="status" 
        aria-label="Loading"
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
            <div style={{
              height: '16px',
              backgroundColor: '#404040',
              borderRadius: '4px',
              width: '100%'
            }}></div>
            <div style={{
              height: '16px',
              backgroundColor: '#404040',
              borderRadius: '4px',
              width: '85%'
            }}></div>
            <div style={{
              height: '16px',
              backgroundColor: '#404040',
              borderRadius: '4px',
              width: '65%'
            }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state with user-friendly messaging
  if (error) {
    const getUserFriendlyError = (errorMsg: string) => {
      if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        return "We're having trouble connecting. Please check your internet connection and try again.";
      }
      if (errorMsg.includes('timeout')) {
        return "This is taking longer than usual. Please try again in a moment.";
      }
      if (errorMsg.includes('permission') || errorMsg.includes('401')) {
        return "You don't have permission to view this data. Please contact support if this seems wrong.";
      }
      if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
        return "Some information seems to be missing or incorrect. Please refresh and try again.";
      }
      return "Something went wrong loading this information. Please try again or contact support.";
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
          marginBottom: '8px',
          fontSize: '18px'
        }}>
          Unable to Load Data
        </h3>
        <p style={{
          color: netflixTheme.colors.textSecondary,
          marginBottom: '16px',
          lineHeight: '1.5'
        }}>
          {getUserFriendlyError(error)}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            ...buttonStyles.primary,
            fontSize: '14px',
            padding: '10px 20px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f40612';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = netflixTheme.colors.netflixRed;
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const handleInteraction = (key: string, value: any) => {
    if (onInteract) {
      onInteract(key, value);
    }
  };

  const renderValue = (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (variant === 'detailed' || variant === 'interactive') {
        const isExpanded = expandedItems.has(key);
        return (
          <div className="space-y-2">
            <button
              onClick={() => toggleExpanded(key)}
              className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-expanded={isExpanded}
              aria-controls={`${key}-details`}
            >
              <span className="mr-1">{isExpanded ? '▼' : '▶'}</span>
              View Details
            </button>
            {isExpanded && (
              <div id={`${key}-details`} className="ml-4 pl-4 border-l-2 border-gray-200">
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div key={subKey} className="mb-2">
                    <span className="font-medium text-gray-600">{subKey}:</span>{' '}
                    <span className="text-gray-800">{String(subValue)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }
      return <span className="text-gray-500 italic">Object data</span>;
    }

    if (variant === 'interactive' && onInteract) {
      return (
        <button
          onClick={() => handleInteraction(key, value)}
          style={{
            color: variant === 'interactive' ? '#fbbf24' : '#2563eb',
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = variant === 'interactive' ? 'rgba(251,191,36,0.1)' : 'rgba(37,99,235,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {String(value)}
        </button>
      );
    }

    return <span className="text-gray-800">{String(value)}</span>;
  };

  return (
    <div 
      className={className}
      style={{
        ...cardStyles.base,
        ...(variant === 'interactive' ? cardStyles.interactive : {})
      }}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, cardStyles.hover);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, cardStyles.base, 
          variant === 'interactive' ? cardStyles.interactive : {});
      }}
    >
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
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: window.innerWidth < 640 ? 'flex-start' : 'center'
          }}>
            <dt style={{
              fontWeight: '600',
              color: netflixTheme.colors.textSecondary,
              marginBottom: window.innerWidth < 640 ? '4px' : '0',
              width: window.innerWidth < 640 ? '100%' : '40%',
              textTransform: 'capitalize',
              fontSize: '14px'
            }}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            </dt>
            <dd style={{
              width: window.innerWidth < 640 ? '100%' : '60%',
              color: netflixTheme.colors.textPrimary,
              fontSize: '16px'
            }}>
              {renderValue(key, value)}
            </dd>
          </div>
        ))}
      </div>

      {variant === 'interactive' && (
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: `1px solid ${netflixTheme.colors.inputBorder}`
        }}>
          <p style={{
            fontSize: '12px',
            color: netflixTheme.colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Click values to track engagement • Analytics enabled
          </p>
        </div>
      )}
    </div>
  );
};

// Demo component to show different variants
const DataCardDemo = () => {
  const [interactionLog, setInteractionLog] = useState<string[]>([]);

  const sampleData = {
    userId: 12345,
    name: 'John Doe',
    email: 'john.doe@example.com',
    subscription: {
      plan: 'Premium',
      status: 'Active',
      renewalDate: '2024-08-15'
    },
    lastActive: '2024-07-30',
    watchTime: '2h 34m'
  };

  const handleInteraction = (key: string, value: any) => {
    const newLog = `Interacted with ${key}: ${value}`;
    setInteractionLog(prev => [newLog, ...prev.slice(0, 4)]);
  };

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: netflixTheme.colors.darkBackground,
      padding: '24px'
    }}>
      {/* Netflix-style header */}
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
          DataCard Component Demo
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gap: '32px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        marginBottom: '40px'
      }}>
        {/* Summary variant */}
        <DataCard
          title="User Summary"
          data={sampleData}
          variant="summary"
        />

        {/* Detailed variant */}
        <DataCard
          title="User Details"
          data={sampleData}
          variant="detailed"
        />

        {/* Interactive variant */}
        <DataCard
          title="Interactive User Data"
          data={sampleData}
          variant="interactive"
          onInteract={handleInteraction}
        />

        {/* Loading state */}
        <DataCard
          title="Loading Example"
          data={{}}
          isLoading={true}
        />

        {/* Error state */}
        <DataCard
          title="Error Example"
          data={{}}
          error="Failed to load user data. Please try again."
        />
      </div>

      {/* Interaction log */}
      {interactionLog.length > 0 && (
        <div style={{
          ...cardStyles.base,
          marginTop: '32px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: netflixTheme.colors.textPrimary,
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Engagement Analytics
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

export default DataCardDemo;