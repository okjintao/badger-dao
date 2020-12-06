import { Address, BigInt } from "@graphprotocol/graph-ts";
import { 
  Transfer,
  DepositAllCall,
  DepositCall,
  WithdrawCall,
  WithdrawAllCall,
  BadgerSett
} from "../generated/sBTCCRV/BadgerSett"
import { getOrCreateSett, getOrCreateSettBalance, getOrCreateUser } from "./loader";
import { NORMALIZER, NO_ADDR, REWARD, ZERO } from "./constants"
import { ERC20 } from "../generated/sBTCCRV/ERC20";
import { UserSettBalance, Deposit, Withdraw } from "../generated/schema";

export function handleDeposit(call: DepositCall): void {
  let sett = getOrCreateSett(call.to);
  let token = call.inputs._amount;
  let share = token.div(sett.pricePerFullShare.div(NORMALIZER));
  handleDespositCall(call.to, call.from, token, share);
}

export function handleDepositAll(call: DepositAllCall): void {
  let contract = BadgerSett.bind(call.to);
  let sett = getOrCreateSett(call.to);
  let share = contract.balanceOf(call.from);
  let token = share.times(sett.pricePerFullShare.div(NORMALIZER));
  handleDespositCall(call.to, call.from, token, share);
}

function handleDespositCall(to: Address, from: Address, token: BigInt, share: BigInt): void {
  let sett = getOrCreateSett(to);
  sett.netDeposit = sett.netDeposit.plus(token);
  sett.netShareDeposit = sett.netShareDeposit.plus(share);
  sett.grossDeposit = sett.grossDeposit.plus(token);
  sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
  sett.save();

  let fromUser = getOrCreateUser(from);
  let fromBalance = getOrCreateSettBalance(fromUser, sett);
  fromBalance.netDeposit = fromBalance.netDeposit.plus(token);
  fromBalance.grossDeposit = fromBalance.grossDeposit.plus(token);
  fromBalance.netShareDeposit = fromBalance.netShareDeposit.plus(share);
  fromBalance.grossShareDeposit = fromBalance.grossShareDeposit.plus(share);
  fromBalance.save();
  fromUser.save();
}

export function handleWithdraw(call: WithdrawCall): void {
  let sett = getOrCreateSett(call.to);
  let share = call.inputs._shares;
  let token = share.times(sett.pricePerFullShare.div(NORMALIZER));
  handleWithdrawCall(call.to, call.from, token, share);
}

export function handleWithdrawAll(call: WithdrawAllCall): void {
  let sett = getOrCreateSett(call.to);
  let fromUser = getOrCreateUser(call.from); 
  let fromSettBalance = getOrCreateSettBalance(fromUser, sett);
  let token = fromSettBalance.netDeposit;
  let share = fromSettBalance.netShareDeposit;
  handleWithdrawCall(call.to, call.from, token, share);
}

function handleWithdrawCall(to: Address, from: Address, token: BigInt, share: BigInt): void {
  let sett = getOrCreateSett(to);
  sett.netDeposit = sett.netDeposit.minus(token);
  sett.netShareDeposit = sett.netShareDeposit.minus(share);
  sett.grossWithdraw = sett.grossWithdraw.plus(token);
  sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
  sett.save();

  let fromUser = getOrCreateUser(from);
  let fromBalance = getOrCreateSettBalance(fromUser, sett);
  fromBalance.netDeposit = fromBalance.netDeposit.minus(token);
  fromBalance.grossWithdraw = fromBalance.grossWithdraw.plus(token);
  fromBalance.netShareDeposit = fromBalance.netShareDeposit.minus(share);
  fromBalance.grossShareWithdraw = fromBalance.grossShareWithdraw.plus(share);
  fromBalance.save();
  fromUser.save();
}

// function handleWithdraw(id: string, userBalance: UserSettBalance, share: BigInt, token: BigInt): boolean {
//   let transfer = Withdraw.load(id);
//   if (transfer != null) {
//     return false;
//   }
//   transfer = new Withdraw(id);
//   transfer.save();

//   userBalance.netDeposit = userBalance.netDeposit.minus(token);
//   userBalance.grossWithdraw = userBalance.grossWithdraw.plus(token);
//   userBalance.netShareDeposit = userBalance.netShareDeposit.minus(share);
//   userBalance.grossShareWithdraw = userBalance.grossShareWithdraw.plus(share);
//   userBalance.save();
//   return true;
// }

// function handleDeposit(id: string, userBalance: UserSettBalance, share: BigInt, token: BigInt): boolean {
//   let transfer = Deposit.load(id);
//   if (transfer != null) {
//     return false;
//   }
//   transfer = new Deposit(id);
//   transfer.save();

//   userBalance.netDeposit = userBalance.netDeposit.plus(token);
//   userBalance.grossDeposit = userBalance.grossDeposit.plus(token);
//   userBalance.netShareDeposit = userBalance.netShareDeposit.plus(share);
//   userBalance.grossShareDeposit = userBalance.grossShareDeposit.plus(share);
//   userBalance.save();
//   return true;
// }

// function isValid(address: Address): boolean {
//   return address.toHexString() != NO_ADDR && address.toHexString() != REWARD;
// }

// export function handleTransfer(event: Transfer): void {
//   // get relevant entities
//   let sett = getOrCreateSett(event.address);
//   let from = getOrCreateUser(event.params.from);
//   let to = getOrCreateUser(event.params.to);

//   // get share and token values
//   let share = event.params.value;
//   let token = share.times(sett.pricePerFullShare).div(NORMALIZER);

//   // get user balances
//   let fromBalance = getOrCreateSettBalance(from, sett);
//   let toBalance = getOrCreateSettBalance(to, sett);

//   // deposit
//   if (event.params.from.toHexString() == NO_ADDR) {
//     handleDeposit(event.transaction.hash.toHexString(), toBalance, share, token);
//     sett.netDeposit = sett.netDeposit.plus(token);
//     sett.grossDeposit = sett.grossDeposit.plus(token);
//     sett.netShareDeposit = sett.netShareDeposit.plus(share);
//     sett.grossShareDeposit = sett.grossShareDeposit.plus(share);
//   }

//   // withdrawal
//   if (event.params.to.toHexString() == NO_ADDR) {
//     handleWithdraw(event.transaction.hash.toHexString(), fromBalance, share, token);
//     sett.netDeposit = sett.netDeposit.minus(token);
//     sett.grossWithdraw = sett.grossWithdraw.plus(token);
//     sett.netShareDeposit = sett.netShareDeposit.minus(share);
//     sett.grossShareWithdraw = sett.grossShareWithdraw.plus(share);
//   }

//   // transfer
//   if (isValid(event.params.from) && isValid(event.params.to)) {
//     handleWithdraw(fromBalance, share, token);
//     handleDeposit(toBalance, share, token);
//   }

//   to.save();
//   from.save();
//   sett.save();
// }
