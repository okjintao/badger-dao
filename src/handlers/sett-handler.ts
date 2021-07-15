import { Transfer } from '../../generated/templates/SettVault/BadgerSett';
import { BadgerSettHelper } from '../helpers/badger-sett-helper';
import { UserHelper } from '../helpers/user-helper';
import { UserSettBalanceHelper } from '../helpers/user-sett-balance-helper';
import { NO_ADDR, NORMALIZER } from './../constants';

export function handleTransfer(event: Transfer): void {
  // get relevant entities
  const settHelper = new BadgerSettHelper();
  const sett = settHelper.load(event.address);

  const userHelper = new UserHelper();
  const from = userHelper.load(event.params.from);
  const to = userHelper.load(event.params.to);

  // get share and token values
  const share = event.params.value;
  const token = share.times(sett.pricePerFullShare).div(NORMALIZER);

  // get user balances
  const balanceHelper = new UserSettBalanceHelper();
  const fromBalance = balanceHelper.load(from, sett);
  const toBalance = balanceHelper.load(to, sett);

  // deposit
  if (event.params.from.toHexString() == NO_ADDR) {
    balanceHelper.deposit(toBalance, share, token);
    settHelper.deposit(sett, share, token);
  }

  // withdrawal
  if (event.params.to.toHexString() == NO_ADDR) {
    balanceHelper.withdraw(fromBalance, share, token);
    settHelper.withdraw(sett, share, token);
  }

  // transfer
  if (userHelper.isValidUser(from.id) && userHelper.isValidUser(to.id)) {
    balanceHelper.withdraw(fromBalance, share, token);
    balanceHelper.deposit(toBalance, share, token);
  }
}
