import Provider from "./class/provider";
import Receivers from "./class/receivers";
import Spender from "./class/spender";
import Transfer from "./class/transfer";

import { TransactionConfig } from "web3-core";

const setup = async () => {
    let HTTP;
    const ACCOUNT_PUBLIC_KEY = process.env.ACCOUNT_PUBLIC_KEY;
    const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
    const CONTRACT = process.env.CONTRACT;

    if(process.env.NODE_ENV === 'product')
        HTTP = process.env.MAINNET_HTTP;
    else
        HTTP = process.env.TESTNET_HTTP;


    const provider = new Provider();
    provider.setProvider(HTTP);

    const spender = new Spender();
    spender.setSpender({public: ACCOUNT_PUBLIC_KEY, private: ACCOUNT_PRIVATE_KEY});
}

const run = async () => {
    await setup();


    // 코인과 토큰을 분리하여 transactionConfig를 생성
    const transactionConfig = transactionConfigSetup();

    if(transactionConfig === undefined)
        throw new Error('Transaction config is undefined!');

    const transfer = new Transfer(transactionConfig);
}

/**
 * 
 * Transaction Config Creation
 * 
 * @param {string} from - from address or contract spender(owner)
 * @param {string} to - to address or contract address
 * @param {string} value - transfer value only use coin transfer
 * @param {string} data - contract encode data only use contract transfer or using method
 * 
 * @return {TransactionConfig} transaction config data
 */
const transactionConfigSetup = (from: string, to: string, value: string, data?: string): TransactionConfig | undefined => {
    
    if(process.env.TRANSFER_TYPE === 'COIN')
        return {
            // maxFee: ,
            // maxFeePerGas: ,
            // maxPriorityFeePerGas: ,
            from: from,
            to: to,
            value: value,
        }
    
    else
        return {
            // maxFee: ,
            // maxFeePerGas: ,
            // maxPriorityFeePerGas: ,
            from: from,
            to: to,
            value: value,
            data: data,
        }
}


