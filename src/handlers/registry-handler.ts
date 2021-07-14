import { Address } from '@graphprotocol/graph-ts';
import { SettVault } from '../../generated/templates';
import { NewVault, PromoteVault, RemoveVault } from '../../generated/VaultRegistry/VaultRegistry';
import { getOrCreateSett } from '../loader';

function registerVault(vault: Address): void {
  SettVault.create(vault);
  getOrCreateSett(vault).save();
}

// TODO: consider how to differentiate on author
export function handleNewVault(event: NewVault): void {
  registerVault(event.params.vault);
}

// TODO: potentially use for upgrading vault state vs. registering new vaults
export function handlePromoteVault(event: PromoteVault): void {
  registerVault(event.params.vault);
}

// TODO: consider vault state (active, deprecated, guarded) via new / promote
// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars-experimental
export function handleRemoveVault(event: RemoveVault): void {}
