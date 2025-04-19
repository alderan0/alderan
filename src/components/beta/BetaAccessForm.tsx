import React, { useState } from 'react';
import { useBeta } from '../../context/BetaContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export const BetaAccessForm: React.FC = () => {
  const { requestBetaAccess, betaStatus } = useBeta();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestBetaAccess(email);
      setEmail('');
    } finally {
      setIsLoading(false);
    }
  };

  if (betaStatus === 'approved') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Beta!</CardTitle>
          <CardDescription>
            You have been granted access to the beta version of Alderan.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (betaStatus === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Beta Access Requested</CardTitle>
          <CardDescription>
            Your request for beta access is being reviewed. We'll notify you via email when a decision is made.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Beta Access</CardTitle>
        <CardDescription>
          Join our beta program and help shape the future of Alderan. Get early access to new features and provide valuable feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Request Access'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 