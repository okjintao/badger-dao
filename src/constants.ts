import { BigInt } from "@graphprotocol/graph-ts";

// true constants
export const NONE = "";
export const NO_ADDR = "0x0000000000000000000000000000000000000000";
export const REWARD_SETT = "0x10fc82867013fce1bd624fafc719bb92df3172fc";
export const REWARD_LIQUIDITY = "0xa207d69ea6fb967e54baa8639c408c31767ba62d";

// evaluated constants
export let ZERO = BigInt.fromI32(0);

// 10^18, suggest a better name!
export let NORMALIZER = BigInt.fromI32(10).pow(18);

// geysers
// export let GEYSERS = [
//   "0x10fC82867013fCe1bD624FafC719Bb92Df3172FC",
//   "0x2296f174374508278DC12b806A7f27c87D53Ca15",
//   "0x085A9340ff7692Ab6703F17aB5FfC917B580a6FD",
//   "0xA207D69Ea6Fb967E54baA8639c408c31767Ba62D",
//   "0xeD0B7f5d9F6286d00763b0FFCbA886D8f9d56d5e",
//   "0xa9429271a28F8543eFFfa136994c0839E7d7bF77",
// ];