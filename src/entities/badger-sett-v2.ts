import { Address, BigInt, log } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerSettV2 } from '../../generated/templates/SettVaultV2/BadgerSettV2';
import { ZERO } from '../constants';
import { readValue } from '../utils/contracts';
import { loadToken } from './token';

export function loadSettV2(address: Address): Sett {
  log.warning('Loading {}', [address.toHexString()]);
  let contract = BadgerSettV2.bind(address);
  let id = address.toHexString();
  log.warning('Connected to contract {}', [id]);
  let sett = Sett.load(id);
  log.warning('Loaded sett: {}', [sett === null ? 'null' : sett.id]);

  if (sett == null) {
    log.warning('Does not exist, Create {}', [id]);
    sett = new Sett(id);
    log.warning('name: {}', [readValue<string>(contract.try_name(), sett.name)]);
    log.warning('symbol: {}', [readValue<string>(contract.try_symbol(), sett.symbol)]);
    sett.name = 'TEST'; // readValue<string>(contract.try_name(), sett.name);
    sett.symbol = 'TEST'; // readValue<string>(contract.try_symbol(), sett.symbol);
    // const token = readValue<Address>(contract.try_token(), Address.fromString(sett.token));
    // log.warning('token: {}', [token.toHexString()]);
    sett.token = 'TEST'; // loadToken(token).id;
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
  }

  log.warning('Update {}', [id]);
  sett.pricePerFullShare = readValue<BigInt>(contract.try_pricePerShare(), sett.pricePerFullShare);
  sett.balance = readValue<BigInt>(contract.try_totalAssets(), sett.balance);
  sett.totalSupply = readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

  return sett as Sett;
}
