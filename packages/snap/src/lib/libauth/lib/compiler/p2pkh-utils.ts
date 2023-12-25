import { lockingBytecodeToCashAddress } from '../address/address';
import type {
  AuthenticationTemplate,
  CashAddressNetworkPrefix,
} from '../lib';
import { importAuthenticationTemplate } from '../schema/schema';

import { authenticationTemplateToCompilerBCH } from './compiler-bch/compiler-bch';
import { authenticationTemplateP2pkh } from './standard/standard';

/**
 * Derive the P2PKH locking bytecode at the provided index of the provided HD
 * private key.
 */
export const hdPrivateKeyToP2pkhLockingBytecode = ({
  addressIndex,
  hdKey,
}: {
  /**
   * An encoded HD private key, e.g.
   * `xprv9s21ZrQH143K2JbpEjGU94NcdKSASB7LuXvJCTsxuENcGN1nVG7QjMnBZ6zZNcJaiJogsRaLaYFFjs48qt4Fg7y1GnmrchQt1zFNu6QVnta`
   *
   * HD private keys may be encoded for either mainnet or testnet (the network
   * information is ignored).
   */
  hdKey: string;
  /**
   * The address index at which to derive the address.
   */
  addressIndex: number;
}) => {
  const compiler = authenticationTemplateToCompilerBCH(
    importAuthenticationTemplate(
      authenticationTemplateP2pkh
    ) as AuthenticationTemplate
  );
  const lockingBytecode = compiler.generateBytecode({
    data: { hdKeys: { addressIndex, hdPrivateKeys: { owner: hdKey } } },
    scriptId: 'lock',
  }) as { bytecode: Uint8Array; success: true };
  return lockingBytecode.bytecode;
};

/**
 * Derive the P2PKH address at the provided index of the provided HD
 * private key.
 */
export const hdPrivateKeyToP2pkhAddress = ({
  addressIndex,
  hdKey,
  prefix = 'bitcoincash',
}: {
  /**
   * An encoded HD private key, e.g.
   * `xprv9s21ZrQH143K2JbpEjGU94NcdKSASB7LuXvJCTsxuENcGN1nVG7QjMnBZ6zZNcJaiJogsRaLaYFFjs48qt4Fg7y1GnmrchQt1zFNu6QVnta`
   *
   * HD private keys may be encoded for either mainnet or testnet (the network
   * information is ignored).
   */
  hdKey: string;
  /**
   * The address index at which to derive the address.
   */
  addressIndex: number;
  /**
   * The {@link CashAddressNetworkPrefix} to use when encoding the address.
   * (Default: `bitcoincash`)
   */
  prefix?: `${CashAddressNetworkPrefix}`;
}) =>
  lockingBytecodeToCashAddress(
    hdPrivateKeyToP2pkhLockingBytecode({ addressIndex, hdKey }),
    prefix
  ) as string;
