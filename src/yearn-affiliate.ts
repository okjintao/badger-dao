import { BigInt } from '@graphprotocol/graph-ts';
import { Burn, Deposit, Mint, Transfer, UpdateGuestList, Withdraw } from '../generated/YFI-WBTC/AffiliateVault';
import { getOrCreateAffiliateSett, getOrCreateSettBalance, getOrCreateUser } from './loader';
import { handleSettDeposit, handleSettWithdraw } from './utils/sett-util';

export function handleBurn(event: Burn): void {
  const sett = getOrCreateAffiliateSett(event.address);
  const account = getOrCreateUser(event.params.account);
  const share = event.params.shares;

  const balance = getOrCreateSettBalance(account, sett);
  handleSettWithdraw(balance, share, BigInt.fromI32(0));
  sett.netShareDeposit = sett.netShareDeposit.minus(share);
  sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);

  sett.save();
  account.save();
}

export function handleDeposit(event: Deposit): void {
  const sett = getOrCreateAffiliateSett(event.address);
  const account = getOrCreateUser(event.params.account);
  const token = event.params.amount;

  const balance = getOrCreateSettBalance(account, sett);
  handleSettDeposit(balance, BigInt.fromI32(0), token);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.grossDeposit = sett.grossDeposit.plus(token);

  sett.save();
  account.save();
}

export function handleMint(event: Mint): void {
  const sett = getOrCreateAffiliateSett(event.address);
  const account = getOrCreateUser(event.params.account);
  const share = event.params.shares;

  const balance = getOrCreateSettBalance(account, sett);
  handleSettDeposit(balance, share, BigInt.fromI32(0));
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);

  sett.save();
  account.save();
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleTransfer(event: Transfer): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleUpdateGuestList(event: UpdateGuestList): void {}

export function handleWithdraw(event: Withdraw): void {
  const sett = getOrCreateAffiliateSett(event.address);
  const account = getOrCreateUser(event.params.account);
  const token = event.params.amount;

  const balance = getOrCreateSettBalance(account, sett);
  handleSettWithdraw(balance, BigInt.fromI32(0), token);
  sett.netDeposit = sett.netDeposit.minus(token);
  sett.grossWithdraw = sett.grossWithdraw.plus(token);

  sett.save();
  account.save();
}
