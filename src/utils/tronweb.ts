import TronWeb from 'tronweb';

let tronWeb: any = null;
let isReady = false;

export const getTronWeb = async () => {
  if (tronWeb && isReady) {
    return tronWeb;
  }

  if (typeof window !== 'undefined' && (window as any).tronWeb) {
    tronWeb = (window as any).tronWeb;
    isReady = true;
    try {
      await tronWeb.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('Error requesting accounts:', error);
    }
    return tronWeb;
  }

  try {
    tronWeb = new TronWeb({
      fullHost: 'https://api.tronstack.cn',
    });
    isReady = true;
    return tronWeb;
  } catch (error) {
    console.error('Error initializing TronWeb:', error);
    throw error;
  }
};

export const connectWallet = async () => {
  try {
    const web = await getTronWeb();
    const address = web.defaultAddress?.base58;
    
    if (!address) {
      throw new Error('No wallet connected. Please install TronLink extension.');
    }

    return {
      address,
      connected: true,
    };
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

export const getBalance = async (address: string) => {
  try {
    const web = await getTronWeb();
    const balance = await web.trx.getBalance(address);
    return web.fromSun(balance);
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

export const getTokenBalance = async (
  tokenAddress: string,
  userAddress: string
) => {
  try {
    const web = await getTronWeb();
    const contract = await web.contract().at(tokenAddress);
    const balance = await contract.balanceOf(userAddress).call();
    return balance.toString();
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
};

const TRC20_ABI = [
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
];

export const approveToken = async (
  tokenAddress: string,
  spenderAddress: string,
  amount: string
) => {
  try {
    const web = await getTronWeb();
    const contract = await web.contract(TRC20_ABI, tokenAddress);
    
    const tx = await contract
      .approve(spenderAddress, web.toSun(amount))
      .send({
        feeLimit: 100000000,
      });

    return {
      hash: tx,
      status: 'success',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error approving token:', error);
    throw error;
  }
};

export const getAllowance = async (
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
) => {
  try {
    const web = await getTronWeb();
    const contract = await web.contract(TRC20_ABI, tokenAddress);
    const allowance = await contract
      .allowance(ownerAddress, spenderAddress)
      .call();
    return allowance.toString();
  } catch (error) {
    console.error('Error getting allowance:', error);
    return '0';
  }
};

export const getTransactionInfo = async (
  txHash: string
) => {
  try {
    const web = await getTronWeb();
    const tx = await web.trx.getTransaction(txHash);
    return tx;
  } catch (error) {
    console.error('Error getting transaction info:', error);
    return null;
  }
};
