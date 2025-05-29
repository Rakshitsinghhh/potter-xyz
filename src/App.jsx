import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './App.css';
import Login from './components/login';
import Signup from './components/signup';
import Main from './components/mainroot';
import { useMemo } from 'react';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// Import styles for the wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';
import { Balancefetcher } from './components/balancefetcher';

// Define endpoint
const queryClient = new QueryClient();
const endpoint = "https://api.devnet.solana.com";

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/',
      element: <Main />,
    },
  ]
);

function WalletAwareComponent() {
  const { publicKey } = useWallet();

  return (
    <div>
      <Balancefetcher address={publicKey ? publicKey.toBase58() : "Not connected"}/>
    </div>
  );
}

function App() {

  const wallets = useMemo(() => [], []);
  
  return (
    <QueryClientProvider client={queryClient}> 
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className='bg-[black]'>
              <WalletMultiButton className='p-3'/>
            </div>
            <div>
              <WalletAwareComponent/>
            </div>
            <RouterProvider router={router} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}

export default App;