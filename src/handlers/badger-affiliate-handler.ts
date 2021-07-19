import { BigInt } from '@graphprotocol/graph-ts';
import {
  Burn,
  Deposit,
  Mint,
  Transfer,
  UpdateGuestList,
  Withdraw,
} from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { loadAffiliateSett } from '../entities/affiliate-sett';
import { loadUser } from '../entities/user';
import { depositBalance, loadUserBalance, withdrawBalance } from '../entities/user-sett-balance-helper';
import { withdrawSett, depositSett } from '../utils/setts';

export function handleBurn(event: Burn): void {
  const account = loadUser(event.params.account);
  const sett = loadAffiliateSett(event.address);
  const share = event.params.shares;
  withdrawSett(sett, share, BigInt.fromI32(0));

  const balance = loadUserBalance(account, sett);
  withdrawBalance(balance, share, BigInt.fromI32(0));
}

export function handleDeposit(event: Deposit): void {
  const account = loadUser(event.params.account);
  const sett = loadAffiliateSett(event.address);
  const token = event.params.amount;
  depositSett(sett, BigInt.fromI32(0), token);

  const balance = loadUserBalance(account, sett);
  depositBalance(balance, BigInt.fromI32(0), token);
}

export function handleMint(event: Mint): void {
  const account = loadUser(event.params.account);
  const sett = loadAffiliateSett(event.address);
  const share = event.params.shares;
  depositSett(sett, share, BigInt.fromI32(0));

  const balance = loadUserBalance(account, sett);
  depositBalance(balance, share, BigInt.fromI32(0));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleTransfer(event: Transfer): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleUpdateGuestList(event: UpdateGuestList): void {}

export function handleWithdraw(event: Withdraw): void {
  const account = loadUser(event.params.account);
  const sett = loadAffiliateSett(event.address);
  const token = event.params.amount;
  withdrawSett(sett, BigInt.fromI32(0), token);

  const balance = loadUserBalance(account, sett);
  withdrawBalance(balance, BigInt.fromI32(0), token);
}
