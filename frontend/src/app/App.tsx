/**
 * @component App
 * @summary Root application component with providers and routing
 * @domain core
 * @type root-component
 * @category application
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router';
import { queryClient } from '@/core/lib/queryClient';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  );
};
