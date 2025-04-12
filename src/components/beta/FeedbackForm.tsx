import React, { useState } from 'react';
import { useBeta } from '../../context/BetaContext';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export const FeedbackForm: React.FC = () => {
  const { submitFeedback } = useBeta();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await submitFeedback(feedback, category);
      setFeedback('');
      setCategory('general');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>
          Help us improve Alderan by sharing your thoughts and suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="ui">UI/UX Feedback</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Share your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              className="min-h-[150px]"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 