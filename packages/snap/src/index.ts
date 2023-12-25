import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getAddress, showWIF, getPublicKey, signTransaction, signTransactionForArg, switchAddress } from './rpc';
import { assertIsGetAddressParams, assertIsSignTransactionParams } from "./rpc-types";

export * from './rpc-types';
export const onRpcRequest: OnRpcRequestHandler = async ({ request, origin }) => {
  switch (request.method) {
    case 'bch_getAddress':
      console.log('call rpc bch_getAddress!', request.params);
      assertIsGetAddressParams(request.params)
      return await getAddress(origin, request.params);
    case 'bch_showWIF':
      console.log('call rpc bch_showWif!', request.params);
      assertIsGetAddressParams(request.params)
      return await showWIF(origin, request.params);
    case 'bch_getPublicKey':
      console.log('call rpc bch_getPublicKey!', request.params);
      assertIsGetAddressParams(request.params)
      return await getPublicKey(origin, request.params);
    case 'bch_signTransaction':
      console.log('call rpc bch_signTransaction!', request.params);
      assertIsSignTransactionParams(request.params)
      return await signTransaction(origin, request.params);
    case 'bch_signTransactionForArg':
      console.log('call rpc bch_signTransactionForArg!', request.params);
      assertIsSignTransactionParams(request.params)
      return await signTransactionForArg(origin, request.params);
    case 'bch_switchAddress':
      console.log('call rpc bch_switchAddress!', request.params);
      assertIsGetAddressParams(request.params)
      return await switchAddress(origin, request.params);
    default:
      throw new Error('Method not found.');
  }
};
