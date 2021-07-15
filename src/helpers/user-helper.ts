import { Address } from '@graphprotocol/graph-ts';
import { User } from '../../generated/schema';
import { GEYSERS, NO_ADDR } from '../constants';

export class UserHelper {
  isValidUser(address: string): boolean {
    return address != NO_ADDR && !GEYSERS.includes(address);
  }

  load(address: Address): User {
    let user = User.load(address.toHexString());

    if (user == null) {
      user = new User(address.toHexString());
    }

    return user as User;
  }
}
