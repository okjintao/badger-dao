import { Transfer } from "../generated/sBTCCRV/BadgerSett"
import { getOrCreateSett, getOrCreateSettBalance, getOrCreateUser } from "./loader";
import { NORMALIZER, NO_ADDR, GEYSERS } from "./constants"
import { handleSettDeposit, handleSettWithdraw } from "./util/sett-util";

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
    handleSettDeposit(toBalance, share, token);
    sett.netDeposit = sett.netDeposit.plus(token);
    sett.grossDeposit = sett.grossDeposit.plus(token);
    sett.netShareDeposit = sett.netShareDeposit.plus(share);
    sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  }

  // withdrawal
  if (event.params.to.toHexString() == NO_ADDR) {
    handleSettWithdraw(fromBalance, share, token);
    sett.netDeposit = sett.netDeposit.minus(token);
    sett.grossWithdraw = sett.grossWithdraw.plus(token);
    sett.netShareDeposit = sett.netShareDeposit.minus(share);
    sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
  }

  // transfer
  if (isValidUser(event.params.from.toHexString()) && isValidUser(event.params.to.toHexString())) {
    handleSettWithdraw(fromBalance, share, token);
    handleSettDeposit(toBalance, share, token);
  }

  to.save();
  from.save();
  sett.save();
}
