import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Token } from '../../generated/schema';
import { ERC20 } from '../../generated/templates/SettVault/ERC20';
import { readValue } from '../utils/contracts';

export function loadToken(address: Address): Token {
  let token = Token.load(address.toHexString());
  const contract = ERC20.bind(address);

  if (token === null) {
    token = new Token(address.toHexString());
    token.name = readValue<string>(contract.try_name(), '');
    token.symbol = readValue<string>(contract.try_symbol(), '');
    token.decimals = readValue<BigInt>(contract.try_decimals(), BigInt.fromI32(18));
    token.totalSupply = readValue<BigInt>(contract.try_totalSupply(), BigInt.fromI32(0));
    token.save();
  }

  return token as Token;
}
