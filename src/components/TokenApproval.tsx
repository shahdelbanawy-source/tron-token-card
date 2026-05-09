import React, { useState } from 'react';
import { approveToken, getAllowance } from '../utils/tronweb';

interface TokenApprovalProps {
  walletAddress: string;
}

export const TokenApproval: React.FC<TokenApprovalProps> = ({ walletAddress }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [spenderAddress, setSpenderAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState('0');
  const [error, setError] = useState<string | null>(null);

  const handleCheckAllowance = async () => {
    if (!tokenAddress || !spenderAddress) {
      setError('Please fill in token and spender addresses');
      return;
    }

    try {
      const allowance = await getAllowance(tokenAddress, walletAddress, spenderAddress);
      setCurrentAllowance(allowance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check allowance');
    }
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!tokenAddress || !spenderAddress || !amount) {
        throw new Error('Please fill in all fields');
      }

      const result = await approveToken(tokenAddress, spenderAddress, amount);
      setTokenAddress('');
      setSpenderAddress('');
      setAmount('');
      alert(`Approval successful! TX: ${result.hash}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Approval failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-lg p-6 border border-tron-primary/20">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Token Approval</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleApprove} className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Token Address</label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="TR7NHqjeKQxGTCi8q282XEXZTVX..."
            className="w-full bg-tron-dark rounded px-3 py-2 text-white border border-gray-600 focus:border-tron-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Spender Address</label>
          <input
            type="text"
            value={spenderAddress}
            onChange={(e) => setSpenderAddress(e.target.value)}
            placeholder="TR7NHqjeKQxGTCi8q282XEXZTVX..."
            className="w-full bg-tron-dark rounded px-3 py-2 text-white border border-gray-600 focus:border-tron-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full bg-tron-dark rounded px-3 py-2 text-white border border-gray-600 focus:border-tron-primary outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleCheckAllowance}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg transition duration-200 mb-2"
        >
          Check Allowance
        </button>

        {currentAllowance !== '0' && (
          <div className="bg-tron-dark rounded-lg p-3">
            <p className="text-gray-400 text-sm">Current Allowance</p>
            <p className="text-lg font-bold text-tron-primary">{currentAllowance}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tron-primary hover:bg-orange-600 disabled:bg-gray-600 text-black font-bold py-3 rounded-lg transition duration-200 glow"
        >
          {loading ? 'Approving...' : 'Approve Token'}
        </button>
      </form>
    </div>
  );
};
