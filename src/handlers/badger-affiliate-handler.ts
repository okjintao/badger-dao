import { BigInt } from '@graphprotocol/graph-ts';
import {
  Burn,
  Deposit,
  Mint,
  Transfer,
  UpdateGuestList,
  Withdraw,
} from '../../generated/templates/AffiliateSettVault/BadgerAffiliateSett';
import { AffiliateSettHelper } from '../helpers/affiliate-sett-helper';
import { UserHelper } from '../helpers/user-helper';
import { UserSettBalanceHelper } from '../helpers/user-sett-balance-helper';

export function handleBurn(event: Burn): void {
  const userHelper = new UserHelper();
  const account = userHelper.load(event.params.account);
  const settHelper = new AffiliateSettHelper();
  const sett = settHelper.load(event.address);
  const share = event.params.shares;
  settHelper.withdraw(sett, share, BigInt.fromI32(0));

  const balanceHelper = new UserSettBalanceHelper();
  const balance = balanceHelper.load(account, sett);
  balanceHelper.withdraw(balance, share, BigInt.fromI32(0));
}

export function handleDeposit(event: Deposit): void {
  const userHelper = new UserHelper();
  const account = userHelper.load(event.params.account);
  const settHelper = new AffiliateSettHelper();
  const sett = settHelper.load(event.address);
  const token = event.params.amount;
  settHelper.deposit(sett, BigInt.fromI32(0), token);

  const balanceHelper = new UserSettBalanceHelper();
  const balance = balanceHelper.load(account, sett);
  balanceHelper.deposit(balance, BigInt.fromI32(0), token);
}

export function handleMint(event: Mint): void {
  const userHelper = new UserHelper();
  const account = userHelper.load(event.params.account);
  const settHelper = new AffiliateSettHelper();
  const sett = settHelper.load(event.address);
  const share = event.params.shares;
  settHelper.deposit(sett, share, BigInt.fromI32(0));

  const balanceHelper = new UserSettBalanceHelper();
  const balance = balanceHelper.load(account, sett);
  balanceHelper.deposit(balance, share, BigInt.fromI32(0));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleTransfer(event: Transfer): void {}

// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleUpdateGuestList(event: UpdateGuestList): void {}

export function handleWithdraw(event: Withdraw): void {
  const userHelper = new UserHelper();
  const account = userHelper.load(event.params.account);
  const settHelper = new AffiliateSettHelper();
  const sett = settHelper.load(event.address);
  const token = event.params.amount;
  settHelper.withdraw(sett, BigInt.fromI32(0), token);

  const balanceHelper = new UserSettBalanceHelper();
  const balance = balanceHelper.load(account, sett);
  balanceHelper.withdraw(balance, BigInt.fromI32(0), token);
}
