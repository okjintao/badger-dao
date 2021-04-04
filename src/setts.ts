import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/CAKE-BBADGER-BTCB/BadgerSett"
import { getOrCreateSett, getOrCreateSettBalance, getOrCreateUser } from "./loader";
import { NORMALIZER, NO_ADDR, GEYSERS } from "./constants"
import { UserSettBalance } from "../generated/schema";

function handleWithdraw(userBalance: UserSettBalance, share: BigInt, token: BigInt): void {
  userBalance.netDeposit = userBalance.netDeposit.minus(token);
  userBalance.grossWithdraw = userBalance.grossWithdraw.plus(token);
  userBalance.netShareDeposit = userBalance.netShareDeposit.minus(share);
  userBalance.grossShareWithdraw = userBalance.grossShareWithdraw.plus(share);
  userBalance.save();
}

function handleDeposit(userBalance: UserSettBalance, share: BigInt, token: BigInt): void {
  userBalance.netDeposit = userBalance.netDeposit.plus(token);
  userBalance.grossDeposit = userBalance.grossDeposit.plus(token);
  userBalance.netShareDeposit = userBalance.netShareDeposit.plus(share);
  userBalance.grossShareDeposit = userBalance.grossShareDeposit.plus(share);
  userBalance.save();
}

function isValidUser(address: string): boolean {
  return address != NO_ADDR && !GEYSERS.includes(address);
}

export function handleTransfer(event: Transfer): void {
  // get relevant entities
  let sett = getOrCreateSett(event.address);
  let from = getOrCreateUser(event.params.from);
  let to = getOrCreateUser(event.params.to);

  // get share and token values
  let share = event.params.value;
  let token = share.times(sett.pricePerFullShare).div(NORMALIZER);

  // get user balances
  let fromBalance = getOrCreateSettBalance(from, sett);
  let toBalance = getOrCreateSettBalance(to, sett);

  // deposit
  if (event.params.from.toHexString() == NO_ADDR) {
    handleDeposit(toBalance, share, token);
    sett.netDeposit = sett.netDeposit.plus(token);
    sett.grossDeposit = sett.grossDeposit.plus(token);
    sett.netShareDeposit = sett.netShareDeposit.plus(share);
    sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  }

  // withdrawal
  if (event.params.to.toHexString() == NO_ADDR) {
    handleWithdraw(fromBalance, share, token);
    sett.netDeposit = sett.netDeposit.minus(token);
    sett.grossWithdraw = sett.grossWithdraw.plus(token);
    sett.netShareDeposit = sett.netShareDeposit.minus(share);
    sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
  }

  // transfer
  if (isValidUser(event.params.from.toHexString()) && isValidUser(event.params.to.toHexString())) {
    handleWithdraw(fromBalance, share, token);
    handleDeposit(toBalance, share, token);
  }

  to.save();
  from.save();
  sett.save();
}
