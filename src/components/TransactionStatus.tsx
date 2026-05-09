import React from 'react';

interface Transaction {
  hash: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: number;
  amount?: string;
  from?: string;
  to?: string;
}

interface TransactionStatusProps {
  transaction: Transaction;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ transaction }) => {
  const statusColors = {
    success: 'bg-green-500/20 border-green-500 text-green-200',
    pending: 'bg-yellow-500/20 border-yellow-500 text-yellow-200',
    failed: 'bg-red-500/20 border-red-500 text-red-200',
  };

  const statusEmojis = {
    success: '✓',
    pending: '⏳',
    failed: '✗',
  };

  return (
    <div className="glass rounded-lg p-6 border border-tron-primary/20">
      <h3 className="text-xl font-bold mb-4 text-white">Last Transaction</h3>

      <div className={`border rounded-lg p-4 mb-4 ${statusColors[transaction.status]}`}>
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{statusEmojis[transaction.status]}</span>
          <span className="font-semibold capitalize">{transaction.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-gray-400 text-sm">Transaction Hash</p>
          <p className="text-sm font-mono break-all text-tron-primary">{transaction.hash}</p>
        </div>

        {transaction.amount && (
          <div>
            <p className="text-gray-400 text-sm">Amount</p>
            <p className="text-lg font-bold text-white">{transaction.amount}</p>
          </div>
        )}

        <div>
          <p className="text-gray-400 text-sm">Timestamp</p>
          <p className="text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
        </div>

        {transaction.status === 'success' && (
          <a
            href={`https://tronscan.org/#/transaction/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-tron-primary hover:underline font-semibold"
          >
            View on Tronscan →
          </a>
        )}
      </div>
    </div>
  );
};
