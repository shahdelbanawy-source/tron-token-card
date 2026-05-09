import React, { useState, useEffect } from 'react';
import { connectWallet, getBalance } from '../utils/tronweb';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await connectWallet();
      setAddress(result.address);
      
      const bal = await getBalance(result.address);
      setBalance(bal);
      
      if (onConnect) {
        onConnect(result.address);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    setBalance(0);
    setError(null);
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return (
    <div className="glass rounded-lg p-6 border border-tron-primary/20">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Wallet Connection</h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!address ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-tron-primary hover:bg-orange-600 disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition duration-200 glow"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <div className="bg-tron-dark rounded-lg p-4 mb-4">
            <p className="text-gray-400 text-sm mb-2">Connected Address</p>
            <p className="text-tron-primary font-mono break-all">{address}</p>
          </div>
          
          <div className="bg-tron-dark rounded-lg p-4 mb-4">
            <p className="text-gray-400 text-sm mb-2">TRX Balance</p>
            <p className="text-2xl font-bold text-white">{balance.toFixed(2)} TRX</p>
          </div>

          <button
            onClick={handleDisconnect}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};
