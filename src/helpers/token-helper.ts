import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/schema';
import { ERC20 } from '../../generated/templates/SettVault/ERC20';
import { ContractReader } from './contract-reader';

export class TokenHelper extends ContractReader {
  load(address: Address): Token {
    const contract = ERC20.bind(address);
    let token = Token.load(address.toHexString());

    if (token === null) {
      token = new Token(address.toHexString());
      token.name = this.readValue<string>(contract.try_name(), '');
      token.symbol = this.readValue<string>(contract.try_symbol(), '');
      token.decimals = BigInt.fromI32(this.readValue<i32>(contract.try_decimals(), 18));
      token.totalSupply = this.readValue<BigInt>(contract.try_totalSupply(), BigInt.fromI32(0));
      token.save();
    }

    return token as Token;
  }
}
