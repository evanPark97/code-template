import dotenv from 'dotenv';

dotenv.config({path: './.env.dev'});

export const DBConstant = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
}

export const StatusConstant = {
    transfer: {
        pending: process.env.PENDING_TRANSFER,
        process: process.env.PROCESS_TRANSFER,
        success: process.env.SUCCESS_TRANSFER,
        fail: process.env.FAIL_TRANSFER,
    },
    deposit: {
        pending: process.env.PENDING_DEPOSIT,
        process: process.env.PROCESS_DEPOSIT,
        success: process.env.SUCCESS_DEPOSIT,
        fail: process.env.FAIL_DEPOSIT,
    },
    withdraw: {
        pending: process.env.PENDING_WITHDRAW,
        process: process.env.PROCESS_WITHDRAW,
        success: process.env.SUCCESS_WITHDRAW,
        fail: process.env.FAIL_WITHDRAW,
    }
}

export const RPC = {
    url: process.env.TRON_NETWORK_RPC,
}

export const WalletConstant = {
    address: process.env.WALLET_ADDRESS,
    privateKey: process.env.WALLET_PRIVATE_KEY,
}

export const ContractConstant = {
    address: process.env.CONTRACT_ADDRESS,
}

console.log('#####################################');
console.log('Config');
console.log('#####################################');
console.log(DBConstant);
console.log(StatusConstant);
console.log(RPC);
console.log(WalletConstant);
console.log(ContractConstant);
console.log('#####################################');