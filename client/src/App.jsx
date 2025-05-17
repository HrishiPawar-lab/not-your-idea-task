import Routes from './routes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});


export default function App() {
  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Routes />
      </QueryClientProvider>
    </>
  );
}
