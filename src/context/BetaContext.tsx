import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface BetaContextType {
  betaStatus: 'pending' | 'approved' | 'rejected' | null;
  requestBetaAccess: (email: string) => Promise<void>;
  submitFeedback: (feedback: string, category: string) => Promise<void>;
}

const BetaContext = createContext<BetaContextType | undefined>(undefined);

export const BetaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [betaStatus, setBetaStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  const requestBetaAccess = useCallback(async (email: string) => {
    try {
      // TODO: Implement actual API call to request beta access
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBetaStatus('pending');
      toast.success('Beta access request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit beta access request. Please try again.');
      console.error('Beta access request error:', error);
    }
  }, []);

  const submitFeedback = useCallback(async (feedback: string, category: string) => {
    try {
      // TODO: Implement actual API call to submit feedback
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', error);
    }
  }, []);

  return (
    <BetaContext.Provider value={{ betaStatus, requestBetaAccess, submitFeedback }}>
      {children}
    </BetaContext.Provider>
  );
};

export const useBeta = () => {
  const context = useContext(BetaContext);
  if (context === undefined) {
    throw new Error('useBeta must be used within a BetaProvider');
  }
  return context;
}; 