import { WalletContractV4, WalletContractV5R1 } from "@ton/ton";

const walletContractsMap = {
  V5R1: WalletContractV5R1,
  V4: WalletContractV4,
};

export const getWalletContract = (ver: "V5R1" | "V4") => {
  const WalletContract = walletContractsMap[ver];
  return WalletContract;
};

// V4:
//     seqno: number;
//     messages: MessageRelaxed[];
//     sendMode?: Maybe<SendMode>;
//     timeout?: Maybe<number>;
//     secretKey: Buffer;

// V5:
//     seqno: number;
//     messages: MessageRelaxed[];
//     sendMode: SendMode;
//     timeout?: Maybe<number>;
//     secretKey: Buffer;
//     authType?: 'external' | 'internal';
