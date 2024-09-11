import { useEffect, useMemo, useState } from "react";

import { Wallet } from "@arc/sdk";
import { Button } from "@arc/ui/button";
import { cn } from "@arc/ui/cn";

import { Test } from "@/components/test";

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
      <div>
        Super-Puper-ElementoSuper-Puper-ElementoSuper-PuperElementoSuper-PuperElementoSuper-Puper-ElementoSuper-Puper-ElementoSuper-Puper-Elemento
      </div>
      <div>
        Wallet:
        {wallet?.create().hello || "wait..."}
      </div>
      <Button variant="outline" size="lg" style={{ color: "green" }}>
        Testik
      </Button>
      <button className={cn("w-full bg-[#ccc]")}>TEST</button>

      <Test />
    </div>
  );
};
