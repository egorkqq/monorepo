import { useEffect, useMemo, useState } from "react";

import { Wallet } from "@arc/sdk";

export const App = () => {
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);

  useEffect(() => {
    const walletInstance = new Wallet();
    setTimeout(() => setWallet(walletInstance), 1500);
  }, []);

  useMemo(() => wallet?.create().hello, [wallet]);

  return (
    <div>
      <button type="button">test</button>
      <div className="font-bold text-cyan-400">Welcome to ARC </div>
      <div>Super-Puper-Elemento</div>
      <div>Super-Puper-Elemento</div>
      <div>
        Wallet:
        {wallet?.create().hello || "wait..."}
      </div>
      <button className="w-full bg-[#ccc]">TEST</button>
    </div>
  );
};
