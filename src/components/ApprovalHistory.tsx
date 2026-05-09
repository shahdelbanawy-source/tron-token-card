import React from 'react';

interface Approval {
  id: string;
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
  txHash: string;
  date: number;
  status: 'success' | 'pending';
}

interface ApprovalHistoryProps {
  approvals: Approval[];
}

export const ApprovalHistory: React.FC<ApprovalHistoryProps> = ({ approvals }) => {
  return (
    <div className="glass rounded-lg p-6 border border-tron-primary/20">
      <h3 className="text-xl font-bold mb-4 text-white">Approval History</h3>

      {approvals.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No approvals yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {approvals.map((approval) => (
            <div key={approval.id} className="bg-tron-dark rounded-lg p-3 border border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-tron-primary font-mono text-xs break-all">
                    {approval.tokenAddress.slice(0, 10)}...
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Amount: {approval.amount}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    approval.status === 'success'
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-yellow-500/20 text-yellow-200'
                  }`}
                >
                  {approval.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{new Date(approval.date).toLocaleDateString()}</span>
                <a
                  href={`https://tronscan.org/#/transaction/${approval.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tron-primary hover:underline"
                >
                  View TX
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
