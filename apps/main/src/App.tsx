import { useEffect, useState } from 'react';
import { Wallet } from '@arc/sdk';

export function App() {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  useEffect(() => {
    const walletInstance = new Wallet();
    setTimeout(() => setWallet(walletInstance), 1500);
  }, []);

  return (
    <div>
      <div>Welcome to ARC </div>
      <div>Wallet: {wallet?.create().hello || 'wait...'}</div>
    </div>
  );
}
