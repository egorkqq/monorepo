export const trimAddress = (address: string | undefined) =>
  address ? `${address?.slice(0, 6)}....${address?.slice(-5)}` : "";
