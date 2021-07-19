import { Transfer } from '../../generated/templates/SettVault/BadgerSett';
import { loadSett } from '../entities/badger-sett';
import { isValidUser, loadUser } from '../entities/user';
import { depositBalance, loadUserBalance, withdrawBalance } from '../entities/user-sett-balance-helper';
import { depositSett, withdrawSett } from '../utils/setts';
import { NO_ADDR, NORMALIZER } from './../constants';

export function handleTransfer(event: Transfer): void {
  // get relevant entities
  const sett = loadSett(event.address);

  const from = loadUser(event.params.from);
  const to = loadUser(event.params.to);

  // get share and token values
  const share = event.params.value;
  const token = share.times(sett.pricePerFullShare).div(NORMALIZER);

  // get user balances
  const fromBalance = loadUserBalance(from, sett);
  const toBalance = loadUserBalance(to, sett);

  // deposit
  if (event.params.from.toHexString() == NO_ADDR) {
    depositBalance(toBalance, share, token);
    depositSett(sett, share, token);
  }

  // withdrawal
  if (event.params.to.toHexString() == NO_ADDR) {
    withdrawBalance(fromBalance, share, token);
    withdrawSett(sett, share, token);
  }

  // transfer
  if (isValidUser(from.id) && isValidUser(to.id)) {
    withdrawBalance(fromBalance, share, token);
    depositBalance(toBalance, share, token);
  }
}
