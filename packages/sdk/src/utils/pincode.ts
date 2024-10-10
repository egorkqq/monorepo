import { sha256_sync as sha256Sync } from "@ton/crypto";
import { Utf8 } from "crypto-es/lib/core";
import { TripleDES } from "crypto-es/lib/tripledes";

export const PINCODE_SALT = "architec.ton";

const encodeMnemonic = (mnemonic: string, salt: string) =>
  TripleDES.encrypt(mnemonic, sha256Sync(salt).toString()).toString();

const decodeMnemonic = (hash: string, salt: string) =>
  TripleDES.decrypt(hash, sha256Sync(salt).toString()).toString(Utf8);

export const encodePrivateKeyByPin = (mnemonics: string[], pincode: string) =>
  encodeMnemonic(mnemonics.join(" "), `${pincode}-${PINCODE_SALT}`);

export const decodePrivateKeyByPin = (hash: string, pincode: string) =>
  decodeMnemonic(hash, `${pincode}-${PINCODE_SALT}`).split(" ");
