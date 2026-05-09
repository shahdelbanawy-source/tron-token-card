import React, { useRef, useState } from 'react';
import QRCode from 'qrcode.react';

interface ReceiveTokenProps {
  walletAddress: string;
  tokenSymbol?: string;
  tokenLogo?: string;
}

export const ReceiveToken: React.FC<ReceiveTokenProps> = ({
  walletAddress,
  tokenSymbol = 'USDT',
  tokenLogo = '🔵',
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${tokenSymbol}-qr-${Date.now()}.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receive ${tokenSymbol}`,
          text: `Send ${tokenSymbol} to: ${walletAddress}`,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  return (
    <div className="glass rounded-lg p-6 border border-tron-primary/20">
      <h2 className="text-2xl font-bold mb-4 gradient-text">Receive Tokens</h2>

      <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-6">
        <p className="text-sm flex items-center">
          <span className="text-lg mr-2">⚠️</span>
          Only send {tokenSymbol} (BEP20) assets to this address. Other assets will be lost forever.
        </p>
      </div>

      {/* Token Header */}
      <div className="flex items-center justify-center mb-6">
        <span className="text-3xl mr-2">{tokenLogo}</span>
        <span className="text-2xl font-bold text-white">{tokenSymbol}</span>
        <span className="ml-2 bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">BEP20</span>
      </div>

      {/* QR Code Container */}
      <div
        ref={qrRef}
        className="bg-white rounded-lg p-6 flex flex-col items-center justify-center mb-6 glow"
      >
        <QRCode
          value={walletAddress}
          size={256}
          level="H"
          includeMargin
          imageSettings={{
            src: '',
            x: undefined,
            y: undefined,
            height: 60,
            width: 60,
          }}
        />
        <p className="text-gray-900 font-mono text-xs text-center mt-4 break-all">
          {walletAddress}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={handleCopy}
          className="flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg transition duration-200"
        >
          <span className="text-2xl mb-2">📋</span>
          <span className="text-xs font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        <button
          onClick={handleDownloadQR}
          className="flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg transition duration-200"
        >
          <span className="text-2xl mb-2">⬇️</span>
          <span className="text-xs font-semibold">Download</span>
        </button>

        <button
          onClick={handleShare}
          className="flex flex-col items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-lg transition duration-200"
        >
          <span className="text-2xl mb-2">🔗</span>
          <span className="text-xs font-semibold">Share</span>
        </button>
      </div>
    </div>
  );
};
