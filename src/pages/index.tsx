import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { WalletConnect } from '../components/WalletConnect';
import { TokenApproval } from '../components/TokenApproval';
import { ReceiveToken } from '../components/ReceiveToken';
import { TransactionStatus } from '../components/TransactionStatus';
import { ApprovalHistory } from '../components/ApprovalHistory';

interface Approval {
  id: string;
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
  txHash: string;
  date: number;
  status: 'success' | 'pending';
}

interface Transaction {
  hash: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: number;
  amount?: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const savedApprovals = localStorage.getItem('approvals');
    if (savedApprovals) {
      setApprovals(JSON.parse(savedApprovals));
    }
  }, []);

  const handleConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  return (
    <>
      <Head>
        <title>TRON Token Approval Manager</title>
        <meta
          name="description"
          content="Securely manage your TRC-20 token approvals on the TRON blockchain"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-tron-dark via-tron-dark to-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-2">
              TRON Token Approval Manager
            </h1>
            <p className="text-gray-400 text-lg">
              Securely manage your TRC-20 token approvals on the TRON blockchain
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Left Column: Wallet & Token Approval */}
            <div className="lg:col-span-1 space-y-6">
              <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />
              {walletAddress && <TokenApproval walletAddress={walletAddress} />}
            </div>

            {/* Right Column: Receive Token QR */}
            <div className="lg:col-span-2">
              {walletAddress ? (
                <ReceiveToken
                  walletAddress={walletAddress}
                  tokenSymbol="USDT"
                  tokenLogo="🔵"
                />
              ) : (
                <div className="glass rounded-lg p-6 border border-tron-primary/20">
                  <p className="text-gray-400 text-center py-12">
                    Connect your wallet to see your receiving address
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Status & History */}
          {walletAddress && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lastTransaction && <TransactionStatus transaction={lastTransaction} />}
              <ApprovalHistory approvals={approvals} />
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-400 text-sm">
            <p>⚠️ Always verify addresses before approving tokens</p>
            <p className="mt-2">
              Built with Next.js, React, and TronWeb | Powered by TRON
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
