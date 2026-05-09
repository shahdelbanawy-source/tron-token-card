import TronWeb from 'tronweb';

const TRC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const approveToken = async (
  tronWeb: any,
  tokenAddress: string,
  spenderAddress: string,
  amount: string
) => {
  try {
    const contract = tronWeb.contract(TRC20_ABI, tokenAddress);
    
    const amountInWei = tronWeb.toSun(amount);
    
    const tx = await contract.approve(spenderAddress, amountInWei).send({
      feeLimit: 100_000_000,
    });

    return tx;
  } catch (error) {
    console.error('Approval error:', error);
    throw error;
  }
};

export const getAllowance = async (
  tronWeb: any,
  tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string
) => {
  try {
    const contract = tronWeb.contract(TRC20_ABI, tokenAddress);
    const allowance = await contract.allowance(ownerAddress, spenderAddress).call();
    return allowance.toString();
  } catch (error) {
    console.error('Error getting allowance:', error);
    return '0';
  }
};

export const getTransactionInfo = async (
  tronWeb: any,
  txHash: string
) => {
  try {
    const tx = await tronWeb.trx.getTransaction(txHash);
    return tx;
  } catch (error) {
    console.error('Error getting transaction info:', error);
    return null;
  }
};
