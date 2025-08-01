import React, { useState, useEffect } from 'react';

// Netflix theme for consistency
const netflixTheme = {
  colors: {
    netflixRed: '#e50914',
    darkBackground: '#141414',
    cardBackground: '#2f2f2f',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    textMuted: '#808080',
    successGreen: '#46d369',
    warningYellow: '#ffd600',
    inputBorder: '#737373'
  }
};

const cardStyles = {
  base: {
    backgroundColor: netflixTheme.colors.cardBackground,
    borderRadius: '8px',
    padding: '24px',
    border: `1px solid #404040`,
    color: netflixTheme.colors.textPrimary,
    marginBottom: '24px'
  }
};

// 1. COMPONENT TO BE TESTED - UserProfile Component
const UserProfile = ({ userId, onUserLoad, testId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async (id) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (id === 'error-user') {
        throw new Error('User not found');
      }
      
      const userData = {
        id,
        name: `User ${id}`,
        email: `user${id}@netflix.com`,
        subscription: 'Premium',
        watchTime: '24h 32m'
      };
      
      setUser(userData);
      onUserLoad?.(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (loading) {
    return (
      <div data-testid={`${testId}-loading`} style={cardStyles.base}>
        <div style={{ color: netflixTheme.colors.textSecondary }}>
          Loading user profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        data-testid={`${testId}-error`} 
        style={{
          ...cardStyles.base,
          borderColor: netflixTheme.colors.netflixRed,
          backgroundColor: '#2d1b1b'
        }}
        role="alert"
      >
        <div style={{ color: netflixTheme.colors.netflixRed, fontWeight: '600' }}>
          Error: {error}
        </div>
        <button
          data-testid={`${testId}-retry`}
          onClick={() => fetchUser(userId)}
          style={{
            backgroundColor: netflixTheme.colors.netflixRed,
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginTop: '12px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div data-testid={`${testId}-empty`} style={cardStyles.base}>
        <div style={{ color: netflixTheme.colors.textMuted }}>
          No user selected
        </div>
      </div>
    );
  }

  return (
    <div data-testid={`${testId}-loaded`} style={cardStyles.base}>
      <h3 style={{
        color: netflixTheme.colors.textPrimary,
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '16px'
      }}>
        User Profile
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div data-testid="user-name">
          <strong>Name:</strong> {user.name}
        </div>
        <div data-testid="user-email">
          <strong>Email:</strong> {user.email}
        </div>
        <div data-testid="user-subscription">
          <strong>Subscription:</strong> {user.subscription}
        </div>
        <div data-testid="user-watch-time">
          <strong>Watch Time:</strong> {user.watchTime}
        </div>
      </div>
    </div>
  );
};

// 2. SEARCH COMPONENT - For integration testing
const SearchComponent = ({ onSearch, placeholder = "Search...", testId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    
    try {
      // Simulate search API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = [
        { id: 1, title: `${searchQuery} Result 1`, type: 'Movie' },
        { id: 2, title: `${searchQuery} Result 2`, type: 'Series' },
        { id: 3, title: `${searchQuery} Result 3`, type: 'Documentary' }
      ];
      
      setResults(mockResults);
      onSearch?.(searchQuery, mockResults);
    } catch (error) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div data-testid={testId} style={cardStyles.base}>
      <h3 style={{
        color: netflixTheme.colors.textPrimary,
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '16px'
      }}>
        Content Search
      </h3>
      
      <input
        data-testid={`${testId}-input`}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
      
      {searching && (
        <div data-testid={`${testId}-loading`} style={{
          color: netflixTheme.colors.textSecondary,
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          Searching...
        </div>
      )}
      
      <div data-testid={`${testId}-results`}>
        {results.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {results.map((result) => (
              <div
                key={result.id}
                data-testid={`result-${result.id}`}
                style={{
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ color: netflixTheme.colors.textPrimary, fontWeight: '600' }}>
                    {result.title}
                  </div>
                  <div style={{ color: netflixTheme.colors.textSecondary, fontSize: '12px' }}>
                    {result.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : query && !searching ? (
          <div data-testid={`${testId}-no-results`} style={{
            color: netflixTheme.colors.textMuted,
            fontSize: '14px'
          }}>
            No results found for "{query}"
          </div>
        ) : null}
      </div>
    </div>
  );
};

// 3. TESTING EXAMPLES SHOWCASE
const TestingExamplesShowcase = () => {
  // Unit Test Examples
  const unitTestExamples = [
    {
      title: "Component Rendering",
      code: `// UserProfile.test.jsx
// Testing Library imports (would be installed in real project)
// import { render, screen } from '@testing-library/react';
// import UserProfile from './UserProfile';

describe('UserProfile Component', () => {
  test('renders loading state correctly', () => {
    // render(<UserProfile userId="123" testId="user-profile" />);
    
    // expect(screen.getByTestId('user-profile-loading')).toBeInTheDocument();
    // expect(screen.getByText('Loading user profile...')).toBeInTheDocument();
  });

  test('renders error state with retry button', () => {
    // render(<UserProfile userId="error-user" testId="user-profile" />);
    
    // expect(screen.getByTestId('user-profile-error')).toBeInTheDocument();
    // expect(screen.getByRole('alert')).toBeInTheDocument();
    // expect(screen.getByTestId('user-profile-retry')).toBeInTheDocument();
  });

  test('displays user data when loaded', async () => {
    // render(<UserProfile userId="123" testId="user-profile" />);
    
    // Wait for loading to complete
    // await screen.findByTestId('user-profile-loaded');
    
    // expect(screen.getByTestId('user-name')).toHaveTextContent('User 123');
    // expect(screen.getByTestId('user-email')).toHaveTextContent('user123@netflix.com');
  });
});

// Key Testing Principles:
// 1. Test behavior, not implementation
// 2. Use data-testid for reliable element selection
// 3. Test loading, error, and success states
// 4. Verify accessibility attributes (role="alert")`
    },
    {
      title: "User Interactions",
      code: `// UserProfile.interaction.test.jsx
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

describe('UserProfile Interactions', () => {
  test('calls onUserLoad callback when user loads', async () => {
    // const mockOnUserLoad = jest.fn();
    
    // render(
    //   <UserProfile 
    //     userId="123" 
    //     onUserLoad={mockOnUserLoad} 
    //     testId="user-profile" 
    //   />
    // );
    
    // await waitFor(() => {
    //   expect(mockOnUserLoad).toHaveBeenCalledWith({
    //     id: '123',
    //     name: 'User 123',
    //     email: 'user123@netflix.com',
    //     subscription: 'Premium',
    //     watchTime: '24h 32m'
    //   });
    // });
  });

  test('retry button refetches user data', async () => {
    // const { rerender } = render(
    //   <UserProfile userId="error-user" testId="user-profile" />
    // );
    
    // await screen.findByTestId('user-profile-error');
    
    // const retryButton = screen.getByTestId('user-profile-retry');
    // fireEvent.click(retryButton);
    
    // expect(screen.getByTestId('user-profile-loading')).toBeInTheDocument();
  });
});

// Interaction Testing Best Practices:
// 1. Use userEvent for realistic user interactions
// 2. Test callback functions with jest.fn() mocks
// 3. Verify state changes after user actions
// 4. Test error recovery flows (retry buttons, etc.)`
    },
    {
      title: "Integration Testing",
      code: `// Search.integration.test.jsx
// import { render, screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

describe('Search Integration', () => {
  test('performs search with debounced input', async () => {
    // const mockOnSearch = jest.fn();
    // const user = userEvent.setup();
    
    // render(
    //   <SearchComponent 
    //     onSearch={mockOnSearch} 
    //     testId="search-component" 
    //   />
    // );
    
    // const input = screen.getByTestId('search-component-input');
    
    // Type search query
    // await user.type(input, 'stranger things');
    
    // Wait for debounce and search to complete
    // await waitFor(() => {
    //   expect(mockOnSearch).toHaveBeenCalledWith(
    //     'stranger things',
    //     expect.arrayContaining([
    //       expect.objectContaining({
    //         title: expect.stringContaining('stranger things')
    //       })
    //     ])
    //   );
    // }, { timeout: 1000 });
    
    // Verify results are displayed
    // expect(screen.getByTestId('result-1')).toBeInTheDocument();
    // expect(screen.getByTestId('result-2')).toBeInTheDocument();
  });

  test('shows no results message for empty search', async () => {
    // const user = userEvent.setup();
    
    // render(<SearchComponent testId="search-component" />);
    
    // const input = screen.getByTestId('search-component-input');
    // await user.type(input, 'nonexistentmovie12345');
    
    // await waitFor(() => {
    //   expect(screen.getByTestId('search-component-no-results'))
    //     .toHaveTextContent('No results found for "nonexistentmovie12345"');
    // });
  });
});

// Integration Testing Focus:
// 1. Test complete user workflows
// 2. Verify component communication
// 3. Test debounced/throttled interactions
// 4. Validate API integration points`
    },
    {
      title: "Mock & Spy Testing",
      code: `// API.mocks.test.jsx
// import { jest } from '@jest/globals';

// Mock GraphQL client (example pattern)
const mockGraphQLClient = {
  query: () => Promise.resolve(), // jest.fn() in real implementation
  mutate: () => Promise.resolve(), // jest.fn() in real implementation
  subscribe: () => Promise.resolve() // jest.fn() in real implementation
};

// jest.mock('../services/graphql', () => ({
//   graphqlClient: mockGraphQLClient
// }));

describe('API Integration', () => {
  beforeEach(() => {
    // jest.clearAllMocks();
  });

  test('handles GraphQL query success', async () => {
    // const mockUserData = {
    //   data: { user: { id: '123', name: 'John Doe' } }
    // };
    
    // mockGraphQLClient.query.mockResolvedValueOnce(mockUserData);
    
    // render(<UserProfile userId="123" testId="user-profile" />);
    
    // await waitFor(() => {
    //   expect(mockGraphQLClient.query).toHaveBeenCalledWith(
    //     expect.stringContaining('GetUserProfile'),
    //     { userId: '123' }
    //   );
    // });
    
    // expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
  });

  test('handles GraphQL query failure', async () => {
    // mockGraphQLClient.query.mockRejectedValueOnce(
    //   new Error('Network error')
    // );
    
    // render(<UserProfile userId="123" testId="user-profile" />);
    
    // await waitFor(() => {
    //   expect(screen.getByTestId('user-profile-error'))
    //     .toHaveTextContent('Network error');
    // });
  });
});

// API Testing Strategies:
// 1. Mock external dependencies (GraphQL, REST APIs)
// 2. Test both success and failure scenarios
// 3. Verify correct API calls are made
// 4. Use MSW (Mock Service Worker) for realistic API mocking`
    },
    {
      title: "Accessibility Testing",
      code: `// Accessibility.test.jsx
// import { render, screen } from '@testing-library/react';
// import { axe, toHaveNoViolations } from 'jest-axe';

// expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('UserProfile has no accessibility violations', async () => {
    // const { container } = render(
    //   <UserProfile userId="123" testId="user-profile" />
    // );
    
    // await screen.findByTestId('user-profile-loaded');
    
    // const results = await axe(container);
    // expect(results).toHaveNoViolations();
  });

  test('error state is announced to screen readers', async () => {
    // render(<UserProfile userId="error-user" testId="user-profile" />);
    
    // const errorElement = await screen.findByRole('alert');
    // expect(errorElement).toBeInTheDocument();
    // expect(errorElement).toHaveAttribute('role', 'alert');
  });

  test('search input has proper labeling', () => {
    // render(
    //   <SearchComponent 
    //     placeholder="Search Netflix content" 
    //     testId="search-component" 
    //   />
    // );
    
    // const input = screen.getByPlaceholderText('Search Netflix content');
    // expect(input).toBeInTheDocument();
    // expect(input).toHaveAttribute('type', 'text');
  });
});

// Accessibility Testing Checklist:
// 1. Use jest-axe for automated a11y testing
// 2. Test keyboard navigation paths
// 3. Verify ARIA attributes and roles
// 4. Test with screen reader simulation
// 5. Check color contrast ratios
// 6. Validate focus management`
    },
    {
      title: "Performance Testing",
      code: `// Performance.test.jsx
// Performance testing patterns (conceptual examples)

describe('Performance Tests', () => {
  test('component renders within performance budget', async () => {
    // const startTime = Date.now();
    
    // render(<UserProfile userId="123" testId="user-profile" />);
    
    // await screen.findByTestId('user-profile-loaded');
    
    // const endTime = Date.now();
    // const renderTime = endTime - startTime;
    
    // Should render within 100ms
    // expect(renderTime).toBeLessThan(100);
  });

  test('search debounce prevents excessive API calls', async () => {
    // const mockOnSearch = jest.fn();
    // const user = userEvent.setup();
    
    // render(<SearchComponent onSearch={mockOnSearch} testId="search" />);
    
    // const input = screen.getByTestId('search-input');
    
    // Rapidly type multiple characters
    // await user.type(input, 'test query');
    
    // Wait for debounce period
    // await waitFor(() => {
    //   Should only call once after debounce, not for each keystroke
    //   expect(mockOnSearch).toHaveBeenCalledTimes(1);
    // }, { timeout: 500 });
  });

  test('virtual scrolling handles large datasets', () => {
    // const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
    //   id: i,
    //   title: \`Item \${i}\`
    // }));
    
    // const startTime = Date.now();
    // render(<VirtualList items={largeDataset} />);
    // const renderTime = Date.now() - startTime;
    
    // Should render quickly even with large datasets
    // expect(renderTime).toBeLessThan(200);
  });
});

// Performance Testing Strategies:
// 1. Set render time budgets (< 100ms for components)
// 2. Test with large datasets (10,000+ items)
// 3. Monitor bundle size impact
// 4. Verify debounce/throttle effectiveness
// 5. Test memory usage patterns`
    }
  ];

  const [selectedExample, setSelectedExample] = useState(0);
  const [testResults, setTestResults] = useState([]);

  // Simulate running tests
  const runMockTests = () => {
    setTestResults([
      { name: 'UserProfile rendering', status: 'passed', time: '23ms' },
      { name: 'User interactions', status: 'passed', time: '45ms' },
      { name: 'Search integration', status: 'passed', time: '67ms' },
      { name: 'API mocking', status: 'passed', time: '34ms' },
      { name: 'Accessibility checks', status: 'passed', time: '156ms' },
      { name: 'Performance budget', status: 'passed', time: '89ms' }
    ]);
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
          Testing Strategies & Patterns
        </div>
      </div>

      {/* Live Component Examples */}
      <div style={{
        display: 'grid',
        gap: '24px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        marginBottom: '32px'
      }}>
        <UserProfile userId="123" testId="demo-user-profile" />
        <SearchComponent testId="demo-search" placeholder="Search Netflix content..." />
      </div>

      {/* Test Runner Simulation */}
      <div style={cardStyles.base}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            color: netflixTheme.colors.textPrimary,
            fontSize: '18px',
            fontWeight: '700'
          }}>
            Test Suite Runner
          </h3>
          <button
            onClick={runMockTests}
            style={{
              backgroundColor: netflixTheme.colors.successGreen,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Run Tests
          </button>
        </div>
        
        {testResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {testResults.map((result, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                borderLeft: `3px solid ${netflixTheme.colors.successGreen}`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{ color: netflixTheme.colors.successGreen }}>✓</span>
                  <span style={{ color: netflixTheme.colors.textPrimary }}>
                    {result.name}
                  </span>
                </div>
                <span style={{ color: netflixTheme.colors.textSecondary, fontSize: '14px' }}>
                  {result.time}
                </span>
              </div>
            ))}
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#1a4a1a',
              borderRadius: '4px',
              color: netflixTheme.colors.successGreen,
              textAlign: 'center',
              fontWeight: '600'
            }}>
              All tests passed! ✨ 6 passed, 0 failed
            </div>
          </div>
        )}
      </div>

      {/* Testing Examples */}
      <div style={cardStyles.base}>
        <h3 style={{
          color: netflixTheme.colors.textPrimary,
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          Testing Code Examples
        </h3>
        
        {/* Example selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {unitTestExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => setSelectedExample(index)}
              style={{
                backgroundColor: selectedExample === index 
                  ? netflixTheme.colors.netflixRed 
                  : '#333',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {example.title}
            </button>
          ))}
        </div>

        {/* Code display */}
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          padding: '20px',
          overflow: 'auto'
        }}>
          <h4 style={{
            color: netflixTheme.colors.textPrimary,
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            {unitTestExamples[selectedExample].title}
          </h4>
          <pre style={{
            color: netflixTheme.colors.textSecondary,
            fontSize: '13px',
            lineHeight: '1.5',
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
          }}>
            {unitTestExamples[selectedExample].code}
          </pre>
        </div>
      </div>

      {/* Testing Strategy Overview */}
      <div style={cardStyles.base}>
        <h3 style={{
          color: netflixTheme.colors.textPrimary,
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          Netflix Testing Strategy
        </h3>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {[
            {
              category: 'Unit Tests (70%)',
              description: 'Individual component logic, pure functions, utilities',
              tools: 'Jest, React Testing Library, @testing-library/jest-dom'
            },
            {
              category: 'Integration Tests (20%)',
              description: 'Component interactions, API integration, user workflows',
              tools: 'React Testing Library, MSW (Mock Service Worker)'
            },
            {
              category: 'E2E Tests (10%)',
              description: 'Critical user journeys, cross-browser testing',
              tools: 'Playwright, Cypress, Selenium Grid'
            },
            {
              category: 'Performance Tests',
              description: 'Bundle size, render time, memory usage monitoring',
              tools: 'Jest, Lighthouse CI, Web Vitals'
            },
            {
              category: 'Accessibility Tests',
              description: 'WCAG compliance, screen reader compatibility',
              tools: 'jest-axe, axe-core, Pa11y'
            },
            {
              category: 'Visual Regression',
              description: 'UI consistency across deployments and browsers',
              tools: 'Chromatic, Percy, BackstopJS'
            }
          ].map((strategy, index) => (
            <div key={index} style={{
              padding: '20px',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              borderLeft: `4px solid ${netflixTheme.colors.netflixRed}`
            }}>
              <div style={{
                color: netflixTheme.colors.textPrimary,
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                {strategy.category}
              </div>
              <div style={{
                color: netflixTheme.colors.textSecondary,
                fontSize: '14px',
                marginBottom: '12px',
                lineHeight: '1.4'
              }}>
                {strategy.description}
              </div>
              <div style={{
                color: netflixTheme.colors.textMuted,
                fontSize: '12px',
                fontStyle: 'italic'
              }}>
                Tools: {strategy.tools}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestingExamplesShowcase;