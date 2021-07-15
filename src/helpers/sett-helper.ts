import { BigInt } from '@graphprotocol/graph-ts';
import { Sett } from '../../generated/schema';
import { ContractReader } from './contract-reader';

export abstract class SettHelper extends ContractReader {
  deposit(sett: Sett, share: BigInt, token: BigInt): void {
    sett.netShareDeposit = sett.netShareDeposit.plus(share);
    sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
    sett.netDeposit = sett.netDeposit.plus(token);
    sett.grossDeposit = sett.grossDeposit.plus(token);
    sett.save();
  }

  withdraw(sett: Sett, share: BigInt, token: BigInt): void {
    sett.netShareDeposit = sett.netShareDeposit.minus(share);
    sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
    sett.netDeposit = sett.netDeposit.minus(token);
    sett.grossWithdraw = sett.grossWithdraw.plus(token);
    sett.save();
  }
}
