import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import { ZERO } from '../constants';
import { readValue } from '../utils/contracts';
import { loadToken } from './token';

export function loadSett(address: Address): Sett {
  const contract = BadgerSett.bind(address);
  let sett = Sett.load(address.toHexString());

  if (sett == null) {
    sett = new Sett(address.toHexString());
    sett.name = readValue<string>(contract.try_name(), sett.name);
    sett.symbol = readValue<string>(contract.try_symbol(), sett.symbol);
    const token = readValue<Address>(contract.try_token(), Address.fromString(sett.token));
    log.info('Read deposit token{}', [token.toHexString()]);
    sett.token = loadToken(token).id;
    log.info('Found token{}', [sett.token]);
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
  }

  sett.pricePerFullShare = readValue<BigInt>(contract.try_getPricePerFullShare(), sett.pricePerFullShare);
  sett.balance = readValue<BigInt>(contract.try_balance(), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  return sett as Sett;
}
