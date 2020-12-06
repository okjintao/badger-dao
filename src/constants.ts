import { BigInt } from "@graphprotocol/graph-ts";

// true constants
export const NONE = "";
export const NO_ADDR = "0x0000000000000000000000000000000000000000";
export const REWARD = "0x10fc82867013fce1bd624fafc719bb92df3172fc";

// evaluated constants
export let ZERO = BigInt.fromI32(0);

// 10^18, suggest a better name!
export let NORMALIZER = BigInt.fromI32(10).pow(18);
