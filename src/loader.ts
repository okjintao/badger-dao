import { Address, BigInt } from '@graphprotocol/graph-ts';
import { BadgerSett } from '../generated/sBTCCRV/BadgerSett';
import { ERC20 } from '../generated/sBTCCRV/ERC20';
import { Sett, Token, User, UserSettBalance } from '../generated/schema';
import { AffiliateVault } from '../generated/YFI-WBTC/AffiliateVault';
import { ZERO } from './constants';

export function getOrCreateUser(address: Address): User {
  let user = User.load(address.toHexString());

  if (user == null) {
    user = new User(address.toHexString());
  }

  return user as User;
}

export function getOrCreateSett(address: Address): Sett {
  let sett = Sett.load(address.toHexString());
  const contract = BadgerSett.bind(address);

  if (sett == null) {
    sett = new Sett(address.toHexString());
    sett.name = '';
    sett.symbol = '';
    sett.token = '';
    sett.pricePerFullShare = ZERO;
    sett.balance = ZERO;
    sett.totalSupply = ZERO;
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
  }

  const name = contract.try_name();
  const symbol = contract.try_symbol();
  const token = contract.try_token();
  const pricePerFullShare = contract.try_getPricePerFullShare();
  const balance = contract.try_balance();
  const totalSupply = contract.try_totalSupply();
  sett.name = !name.reverted ? name.value : sett.name;
  sett.symbol = !symbol.reverted ? symbol.value : sett.symbol;
  sett.token = !token.reverted ? getOrCreateToken(token.value).id : sett.token;
  sett.pricePerFullShare = !pricePerFullShare.reverted ? pricePerFullShare.value : sett.pricePerFullShare;
  sett.balance = !balance.reverted ? balance.value : sett.balance;
  sett.totalSupply = !totalSupply.reverted ? totalSupply.value : sett.totalSupply;

  return sett as Sett;
}

export function getOrCreateSettBalance(user: User, sett: Sett): UserSettBalance {
  const settBalanceId = user.id.concat('-').concat(sett.id);
  let settBalance = UserSettBalance.load(settBalanceId);

  if (settBalance == null) {
    settBalance = new UserSettBalance(settBalanceId);
    settBalance.sett = sett.id;
    settBalance.user = user.id;
    settBalance.netDeposit = ZERO;
    settBalance.grossDeposit = ZERO;
    settBalance.grossWithdraw = ZERO;
    settBalance.netShareDeposit = ZERO;
    settBalance.grossShareDeposit = ZERO;
    settBalance.grossShareWithdraw = ZERO;
  }

  return settBalance as UserSettBalance;
}

export function getOrCreateToken(address: Address): Token {
  let token = Token.load(address.toHexString());

  if (token == null) {
    const tokenContract = ERC20.bind(address);
    const decimals = tokenContract.try_decimals();
    const name = tokenContract.try_name();
    const symbol = tokenContract.try_symbol();
    const totalSupply = tokenContract.try_totalSupply();

    token = new Token(address.toHexString());
    token.decimals = !decimals.reverted ? BigInt.fromI32(decimals.value) : token.decimals;
    token.name = !name.reverted ? name.value : token.name;
    token.symbol = !symbol.reverted ? symbol.value : token.symbol;
    token.totalSupply = !totalSupply.reverted ? totalSupply.value : token.totalSupply;
    token.save();
  }

  return token as Token;
}

export function getOrCreateAffiliateSett(address: Address): Sett {
  let sett = Sett.load(address.toHexString());
  const contract = AffiliateVault.bind(address);

  if (sett == null) {
    sett = new Sett(address.toHexString());
    sett.name = '';
    sett.symbol = '';
    sett.token = '';
    sett.pricePerFullShare = ZERO;
    sett.balance = ZERO;
    sett.totalSupply = ZERO;
    sett.netDeposit = ZERO;
    sett.grossDeposit = ZERO;
    sett.grossWithdraw = ZERO;
    sett.netShareDeposit = ZERO;
    sett.grossShareDeposit = ZERO;
    sett.grossShareWithdraw = ZERO;
  }

  const name = contract.try_name();
  const symbol = contract.try_symbol();
  const token = contract.try_token();
  const pricePerFullShare = contract.try_pricePerShare();
  const balance = contract.try_totalVaultBalance(address);
  const totalSupply = contract.try_totalSupply();
  sett.name = !name.reverted ? name.value : sett.name;
  sett.symbol = !symbol.reverted ? symbol.value : sett.symbol;
  sett.token = !token.reverted ? getOrCreateToken(token.value).id : sett.token;
  sett.pricePerFullShare = !pricePerFullShare.reverted ? pricePerFullShare.value : sett.pricePerFullShare;
  sett.balance = !balance.reverted ? balance.value : sett.balance;
  sett.totalSupply = !totalSupply.reverted ? totalSupply.value : sett.totalSupply;

  return sett as Sett;
}
