import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { BadgerSett } from '../../generated/templates/SettVault/BadgerSett';
import { ZERO } from '../constants';
import { SettHelper } from './sett-helper';
import { TokenHelper } from './token-helper';

export class BadgerSettHelper extends SettHelper {
  load(address: Address): Sett {
    const contract = BadgerSett.bind(address);
    const tokenHelper = new TokenHelper();
    let sett = Sett.load(address.toHexString());

    if (sett == null) {
      sett = new Sett(address.toHexString());
      sett.name = this.readValue<string>(contract.try_name(), sett.name);
      sett.symbol = this.readValue<string>(contract.try_symbol(), sett.symbol);
      const token = this.readValue<Address>(contract.try_token(), Address.fromString(sett.token));
      sett.token = tokenHelper.load(token).id;
      sett.netDeposit = ZERO;
      sett.grossDeposit = ZERO;
      sett.grossWithdraw = ZERO;
      sett.netShareDeposit = ZERO;
      sett.grossShareDeposit = ZERO;
      sett.grossShareWithdraw = ZERO;
    }

    sett.pricePerFullShare = this.readValue<BigInt>(contract.try_getPricePerFullShare(), sett.pricePerFullShare);
    sett.balance = this.readValue<BigInt>(contract.try_balance(), sett.balance);
    sett.totalSupply = this.readValue<BigInt>(contract.try_totalSupply(), sett.totalSupply);

    return sett as Sett;
  }
}
