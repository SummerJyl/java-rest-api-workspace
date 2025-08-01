Query Structure & Fragments:

Fragments for reusable data structures (UserProfile fragment)
Variables for dynamic queries (userId, contentId, timeRange)
Type safety with proper GraphQL schema integration

Data Fetching Patterns:

Custom hook (useGraphQLQuery) for consistent data fetching
Caching strategy to avoid redundant requests
Error boundaries with user-friendly error translation
Refetch functionality for real-time updates

Performance Optimizations:

Field selection - only fetch what you need
Query optimization - combine related data in single requests
Cache management - intelligent cache invalidation
Loading states that don't block the UI

Enterprise Considerations:

Error handling at the GraphQL field level
Data mappers to transform API responses for UI consumption
Consistent patterns across all components
Real-time subscriptions (mentioned for live updates)

This demonstrates exactly what Netflix looks for: understanding how to build scalable data fetching patterns that work well in large applications.
Interview Talking Points:

How you'd handle GraphQL subscriptions for real-time content updates
Cache strategies for different types of data (user profiles vs. content metrics)
Error boundary patterns for GraphQL failures
Performance monitoring for GraphQL queries


