import { createAuthenticationVirtualMachine } from '../../virtual-machine';

import { createInstructionSetXEC } from './xec-instruction-set';

/**
 * Initialize a virtual machine using the XEC instruction set.
 *
 * @param standard - If `true`, the additional `isStandard` validations will be
 * enabled. Transactions that fail these rules are often called "non-standard"
 * and can technically be included by miners in valid blocks, but most network
 * nodes will refuse to relay them. (Default: `true`)
 */
export const createVirtualMachineXEC = (standard = true) =>
  createAuthenticationVirtualMachine(createInstructionSetXEC(standard));
