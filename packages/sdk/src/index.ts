// NOTE: never make backend calls in sdk.
export { useTonWallets } from "./hooks/useTonWallets";
export { useTonWallet } from "./hooks/useTonWallet";
export { useNetwork } from "./hooks/useNetwork";
export { useTonClient } from "./hooks/useTonClient";
export { useSendTransaction } from "./hooks/useSendTransaction";

export { decodePrivateKeyByPin, encodePrivateKeyByPin } from "./utils/pincode";
export { trimAddress } from "./utils/trimAddress";
