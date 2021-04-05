import { UserSettBalance } from "../../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleSettWithdraw(userBalance: UserSettBalance, share: BigInt, token: BigInt): void {
  userBalance.netDeposit = userBalance.netDeposit.minus(token);
  userBalance.grossWithdraw = userBalance.grossWithdraw.plus(token);
  userBalance.netShareDeposit = userBalance.netShareDeposit.minus(share);
  userBalance.grossShareWithdraw = userBalance.grossShareWithdraw.plus(share);
  userBalance.save();
}

export function handleSettDeposit(userBalance: UserSettBalance, share: BigInt, token: BigInt): void {
  userBalance.netDeposit = userBalance.netDeposit.plus(token);
  userBalance.grossDeposit = userBalance.grossDeposit.plus(token);
  userBalance.netShareDeposit = userBalance.netShareDeposit.plus(share);
  userBalance.grossShareDeposit = userBalance.grossShareDeposit.plus(share);
  userBalance.save();
}