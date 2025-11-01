'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from './SimpleToast';
import { Progress } from './ui/progress';

interface MainPageProps {
  onLogout: () => void;
}

// Simple inline SVG icons
const LogOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const LoaderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="animate-spin"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function MainPage({ onLogout }: MainPageProps) {
  const [link, setLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processResult, setProcessResult] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleStartProcess = async () => {
    if (!link) {
      showToast('Please enter a link', 'error');
      return;
    }

    // Basic URL validation
    try {
      new URL(link);
    } catch {
      showToast('Please enter a valid URL', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessResult(null);

    try {
      const token = localStorage.getItem('auth_token');

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Replace with your FastAPI backend URL
      const response = await fetch('http://localhost:8000/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          link: link,
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Process failed');
      }

      // Process successful
      setProcessResult(data.message || 'Process completed successfully!');
      showToast('Process completed successfully!', 'success');
    } catch (err) {
      // For demo purposes with mock data
      if (err instanceof TypeError && err.message.includes('fetch')) {
        // Backend not available, use mock response
        console.warn('Backend not available, using mock response');
        setTimeout(() => {
          setProgress(100);
          setProcessResult(`Mock process completed for: ${link}`);
          showToast('Process completed successfully! (Mock mode)', 'success');
        }, 1000);
      } else {
        showToast(err instanceof Error ? err.message : 'An error occurred', 'error');
        setProgress(0);
      }
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1>Dashboard</h1>
          <Button variant="outline" onClick={onLogout}>
            <span className="mr-2">
              <LogOutIcon />
            </span>
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Process Link</CardTitle>
            <CardDescription>
              Enter a link below and click the button to start processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">
                  <LinkIcon />
                </span>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://example.com"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  disabled={isProcessing}
                  className="flex-1"
                />
              </div>
            </div>

            <Button
              onClick={handleStartProcess}
              disabled={isProcessing || !link}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <span className="mr-2">
                    <LoaderIcon />
                  </span>
                  Processing...
                </>
              ) : (
                'Start Process'
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Processing...</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {processResult && (
              <Alert>
                <AlertDescription>{processResult}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="mb-2">API Integration Notes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>
              Update the API endpoints in the code to match your FastAPI backend URL
            </li>
            <li>
              Current mock endpoints: <code className="bg-white px-1 rounded">http://localhost:8000/api/auth/login</code>,{' '}
              <code className="bg-white px-1 rounded">http://localhost:8000/api/auth/register</code>,{' '}
              <code className="bg-white px-1 rounded">http://localhost:8000/api/process</code>
            </li>
            <li>
              The app uses Bearer token authentication stored in localStorage
            </li>
            <li>
              Falls back to mock mode when backend is not available for testing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
