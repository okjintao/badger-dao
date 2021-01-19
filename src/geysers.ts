import {
  Staked,
  Unstaked
} from "../generated/sBTCCRVGeyser/BadgerGeyser";
import { getOrCreateGeyser } from "./loader";

export function handleStaked(event: Staked): void {
  let geyser = getOrCreateGeyser(event.address);
  geyser.netShareDeposit = geyser.netShareDeposit.plus(event.params.amount);
  geyser.grossShareDeposit = geyser.grossShareDeposit.plus(event.params.amount);
  geyser.save();
}

export function handleUnstaked(event: Unstaked): void {
  let geyser = getOrCreateGeyser(event.address);
  geyser.netShareDeposit = geyser.netShareDeposit.minus(event.params.amount);
  geyser.grossShareWithdraw = geyser.grossShareWithdraw.plus(event.params.amount);
  geyser.save();
}
