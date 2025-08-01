import React, { useState } from 'react';

// Types for our components
interface UserProfileProps {
  user: {
    name: string;
    email: string;
    subscription: string;
  };
  onUpdateProfile: (updates: Partial<UserProfileProps['user']>) => void;
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onPlay: () => void;
  onPause: () => void;
}

// 1. Unit Testing Example - UserProfile Component
const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  return (
    <div data-testid="user-profile" className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">User Profile</h2>
      
      {!isEditing ? (
        <div data-testid="profile-display">
          <p data-testid="user-name">Name: {user.name}</p>
          <p data-testid="user-email">Email: {user.email}</p>
          <p data-testid="user-subscription">Subscription: {user.subscription}</p>
          <button
            data-testid="edit-button"
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form data-testid="profile-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input
              id="name"
              data-testid="name-input"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input
              id="email"
              data-testid="email-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              data-testid="save-button"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Save
            </button>
            <button
              type="button"
              data-testid="cancel-button"
              onClick={() => {
                setFormData(user);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// 2. Integration Testing Example - VideoPlayer Component
const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, onPlay, onPause }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
    onPlay();
    // Simulate video progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause();
  };

  return (
    <div data-testid="video-player" className="bg-black rounded-lg overflow-hidden">
      <div className="aspect-video bg-gray-800 flex items-center justify-center relative">
        <div className="text-white text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <div className="text-sm opacity-75">Video ID: {videoId}</div>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
          <div 
            className="h-full bg-red-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          />
        </div>
      </div>
      
      <div className="p-4 bg-gray-900 flex items-center justify-between">
        <div className="flex gap-2">
          {!isPlaying ? (
            <button
              data-testid="play-button"
              onClick={handlePlay}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              aria-label={`Play ${title}`}
            >
              ▶ Play
            </button>
          ) : (
            <button
              data-testid="pause-button"
              onClick={handlePause}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              aria-label={`Pause ${title}`}
            >
              ⏸ Pause
            </button>
          )}
        </div>
        <div className="text-white text-sm">
          Progress: {progress}%
        </div>
      </div>
    </div>
  );
};

// Main Testing Demo Component
const NetflixTestingStrategies: React.FC = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    subscription: 'Premium'
  });

  const [playCount, setPlayCount] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);

  const handleUpdateProfile = (updates: Partial<typeof user>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handlePlay = () => {
    setPlayCount(prev => prev + 1);
  };

  const handlePause = () => {
    setPauseCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Netflix Testing Strategies & Patterns
          </h1>
          <p className="text-gray-600">
            Interactive demo showing unit testing, integration testing, and E2E testing concepts
          </p>
        </header>

        {/* Testing Strategy Overview */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">🧪 Testing Strategy Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Unit Testing (70%)</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Component rendering</li>
                <li>• Props handling</li>
                <li>• State management</li>
                <li>• Event handling</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Integration Testing (20%)</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Component interactions</li>
                <li>• API integration</li>
                <li>• User workflows</li>
                <li>• Performance optimizations</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">E2E Testing (10%)</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Critical user journeys</li>
                <li>• Cross-browser compatibility</li>
                <li>• Real API integration</li>
                <li>• Performance monitoring</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Components */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Unit Testing Demo */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">1. Unit Testing Demo</h2>
            <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />
          </div>

          {/* Integration Testing Demo */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">2. Integration Testing Demo</h2>
            <VideoPlayer
              videoId="nf-12345"
              title="Stranger Things S4E1"
              onPlay={handlePlay}
              onPause={handlePause}
            />
            <div className="p-4 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-600">
                Play events: {playCount} | Pause events: {pauseCount}
              </p>
            </div>
          </div>
        </div>

        {/* Testing Code Examples */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">📝 Example Test Code</h2>
          <div className="space-y-6">
            
            {/* Unit Test Example */}
            <div>
              <h3 className="font-semibold mb-2 text-green-700">Unit Test Example:</h3>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// UserProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from './UserProfile';

describe('UserProfile Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    subscription: 'Premium'
  };
  const mockOnUpdate = jest.fn();

  test('renders user information correctly', () => {
    render(<UserProfile user={mockUser} onUpdateProfile={mockOnUpdate} />);
    
    expect(screen.getByTestId('user-name')).toHaveTextContent('Name: John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('Email: john@example.com');
    expect(screen.getByTestId('user-subscription')).toHaveTextContent('Subscription: Premium');
  });

  test('enters edit mode when edit button is clicked', () => {
    render(<UserProfile user={mockUser} onUpdateProfile={mockOnUpdate} />);
    
    fireEvent.click(screen.getByTestId('edit-button'));
    
    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
  });

  test('calls onUpdateProfile when form is submitted', () => {
    render(<UserProfile user={mockUser} onUpdateProfile={mockOnUpdate} />);
    
    fireEvent.click(screen.getByTestId('edit-button'));
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByTestId('save-button'));
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ ...mockUser, name: 'Jane Doe' });
  });
});`}
              </pre>
            </div>

            {/* Integration Test Example */}
            <div>
              <h3 className="font-semibold mb-2 text-blue-700">Integration Test Example:</h3>
              <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// VideoPlayer.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoPlayer from './VideoPlayer';

describe('VideoPlayer Integration', () => {
  const mockOnPlay = jest.fn();
  const mockOnPause = jest.fn();

  test('complete play/pause workflow', async () => {
    render(
      <VideoPlayer
        videoId="test-123"
        title="Test Video"
        onPlay={mockOnPlay}
        onPause={mockOnPause}
      />
    );

    // Initial state
    expect(screen.getByTestId('play-button')).toBeInTheDocument();
    expect(screen.queryByTestId('pause-button')).not.toBeInTheDocument();

    // Start playing
    fireEvent.click(screen.getByTestId('play-button'));
    expect(mockOnPlay).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('pause-button')).toBeInTheDocument();

    // Wait for progress to update
    await waitFor(() => {
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar.style.width).not.toBe('0%');
    });

    // Pause video
    fireEvent.click(screen.getByTestId('pause-button'));
    expect(mockOnPause).toHaveBeenCalledTimes(1);
  });
});`}
              </pre>
            </div>

            {/* E2E Test Example */}
            <div>
              <h3 className="font-semibold mb-2 text-purple-700">E2E Test Example:</h3>
              <pre className="bg-gray-900 text-purple-400 p-4 rounded-lg text-sm overflow-x-auto">
{`// user-journey.e2e.test.ts
import { test, expect } from '@playwright/test';

test('user can update profile and watch video', async ({ page }) => {
  await page.goto('/dashboard');

  // Update user profile
  await page.click('[data-testid="edit-button"]');
  await page.fill('[data-testid="name-input"]', 'New Name');
  await page.click('[data-testid="save-button"]');

  // Verify profile update
  await expect(page.locator('[data-testid="user-name"]')).toContainText('New Name');

  // Start watching video
  await page.click('[data-testid="play-button"]');
  
  // Verify video is playing
  await expect(page.locator('[data-testid="pause-button"]')).toBeVisible();
  
  // Check progress bar updates
  await expect(page.locator('[data-testid="progress-bar"]')).not.toHaveCSS('width', '0px');
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* Netflix-Specific Best Practices */}
        <div className="mt-8 p-6 bg-red-50 rounded-lg">
          <h2 className="text-xl font-bold text-red-800 mb-4">🎯 Netflix Interview Talking Points</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Testing Philosophy:</h3>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Test pyramid approach (more unit, fewer E2E)</li>
                <li>• User-centric testing - test behavior, not implementation</li>
                <li>• Fast feedback loops - unit tests run in &lt; 1 second</li>
                <li>• Accessibility testing with axe-core</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Advanced Patterns:</h3>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Mock Service Worker (MSW) for API mocking</li>
                <li>• Custom render utilities with providers</li>
                <li>• Page Object Models for E2E maintainability</li>
                <li>• Parallel test execution for CI/CD</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetflixTestingStrategies;`