import { BigInt } from "@graphprotocol/graph-ts"
import {
  Burn,
  Deposit,
  Mint,
  Transfer,
  UpdateGuestList,
  Withdraw
} from "../generated/AffiliateVault/AffiliateVault"
import { getOrCreateAffiliateSett, getOrCreateSett, getOrCreateSettBalance, getOrCreateUser } from "./loader";
import { handleSettDeposit, handleSettWithdraw } from "./util/sett-util";

export function handleBurn(event: Burn): void {
  let sett = getOrCreateAffiliateSett(event.address);
  let account = getOrCreateUser(event.params.account);
  let share = event.params.shares;

  let balance = getOrCreateSettBalance(account, sett);
  handleSettWithdraw(balance, share, BigInt.fromI32(0));
  sett.netShareDeposit = sett.netShareDeposit.minus(share);
  sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);

  sett.save();
  account.save();
}

export function handleDeposit(event: Deposit): void {
  let sett = getOrCreateAffiliateSett(event.address);
  let account = getOrCreateUser(event.params.account);
  let token = event.params.amount;

  let balance = getOrCreateSettBalance(account, sett);
  handleSettDeposit(balance, BigInt.fromI32(0), token);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.grossDeposit = sett.grossDeposit.plus(token);

  sett.save();
  account.save();
}

export function handleMint(event: Mint): void {
  let sett = getOrCreateAffiliateSett(event.address);
  let account = getOrCreateUser(event.params.account);
  let share = event.params.shares;

  let balance = getOrCreateSettBalance(account, sett);
  handleSettDeposit(balance, share, BigInt.fromI32(0));
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);

  sett.save();
  account.save();
}

export function handleTransfer(event: Transfer): void {}

export function handleUpdateGuestList(event: UpdateGuestList): void {}

export function handleWithdraw(event: Withdraw): void {
  let sett = getOrCreateAffiliateSett(event.address);
  let account = getOrCreateUser(event.params.account);
  let token = event.params.amount;

  let balance = getOrCreateSettBalance(account, sett);
  handleSettWithdraw(balance, BigInt.fromI32(0), token);
  sett.netDeposit = sett.netDeposit.minus(token);
  sett.grossWithdraw = sett.grossWithdraw.plus(token);

  sett.save();
  account.save();
}
