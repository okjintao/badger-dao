import { Address, BigInt, log } from "@graphprotocol/graph-ts"
import { 
  User,
  Sett,
  UserSettBalance,
  Token,
  Geyser
 } from "../generated/schema"
 import { BadgerSett } from "../generated/sBTCCRV/BadgerSett"
 import { BadgerGeyser } from "../generated/sBTCCRVGeyser/BadgerGeyser"
 import { ERC20 } from "../generated/sBTCCRV/ERC20"
 import { BADGER, NO_ADDR, ZERO } from "./constants"

export function getOrCreateUser(address: Address): User {
  let user = User.load(address.toHexString());

  if (user == null) {
    user = new User(address.toHexString());
  }

  return user as User;
}

export function getOrCreateSett(address: Address): Sett {
  let sett = Sett.load(address.toHexString());
  let contract = BadgerSett.bind(address);

  if (sett == null) {
    sett = new Sett(address.toHexString());
    sett.name = "";
    sett.symbol = "";
    sett.token = "";
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

  let name = contract.try_name();
  let symbol = contract.try_symbol();
  let token = contract.try_token();
  let pricePerFullShare = contract.try_getPricePerFullShare();
  let balance = contract.try_balance();
  let totalSupply = contract.try_totalSupply();
  sett.name = !name.reverted ? name.value : sett.name;
  sett.symbol = !symbol.reverted ? symbol.value : sett.symbol;
  sett.token = !token.reverted ? getOrCreateToken(token.value).id : sett.token;
  sett.pricePerFullShare = !pricePerFullShare.reverted ? pricePerFullShare.value : sett.pricePerFullShare;
  sett.balance = !balance.reverted ? balance.value : sett.balance;
  sett.totalSupply = !totalSupply.reverted ? totalSupply.value : sett.totalSupply;

  return sett as Sett;
}

export function getOrCreateSettBalance(user: User, sett: Sett): UserSettBalance {
  let settBalanceId = user.id.concat("-").concat(sett.id);
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
    let tokenContract = ERC20.bind(address);
    let decimals = tokenContract.try_decimals();
    let name = tokenContract.try_name();
    let symbol = tokenContract.try_symbol();
    let totalSupply = tokenContract.try_totalSupply();

    token = new Token(address.toHexString());
    token.decimals = !decimals.reverted ? BigInt.fromI32(decimals.value) : token.decimals;
    token.name = !name.reverted ? name.value : token.name;
    token.symbol = !symbol.reverted ? symbol.value : token.symbol;
    token.totalSupply = !totalSupply.reverted ? totalSupply.value : token.totalSupply;
    token.save();
  }

  return token as Token;
};

export function getOrCreateGeyser(address: Address): Geyser {
  let geyser = Geyser.load(address.toHexString());
  let contract = BadgerGeyser.bind(address);

  if (geyser == null) {
    geyser = new Geyser(address.toHexString());
    geyser.netShareDeposit = ZERO;
    geyser.grossShareDeposit = ZERO;
    geyser.grossShareWithdraw = ZERO;
    geyser.rewardToken = NO_ADDR;
    geyser.stakingToken = NO_ADDR;
    geyser.cycleRewardTokens = ZERO;
    geyser.cycleDuration = ZERO;
  }

  let rewardToken = contract.getDistributionTokens();
  geyser.rewardToken = getOrCreateToken(rewardToken[0]).id;
  let stakingToken = contract.getStakingToken();
  geyser.stakingToken = getOrCreateToken(stakingToken).id;
  let unlockSchedules = contract.getUnlockSchedulesFor(Address.fromString(BADGER));

  let totalTokens = BigInt.fromI32(0);
  let start = BigInt.fromI32(0);
  let end = BigInt.fromI32(0);
  for (let i = 0; i < unlockSchedules.length; i++) {
    let schedule = unlockSchedules[i];
    totalTokens = totalTokens.plus(schedule.initialLocked);
    if (start == BigInt.fromI32(0) || start > schedule.startTime) {
      start = schedule.startTime;
    }
    if (end == BigInt.fromI32(0) || end < schedule.endAtSec) {
      end = schedule.endAtSec;
    }
  }
  geyser.cycleRewardTokens = totalTokens;
  geyser.cycleDuration = end.minus(start);

  return geyser as Geyser;
}
