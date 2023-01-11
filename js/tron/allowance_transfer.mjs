import TronWeb from 'tronweb';
import { getAllowanceHistory, updateAllowanceHistory, getNow } from './db_connection.mjs';
import { RPC, WalletConstant, ContractConstant, StatusConstant } from './config.mjs';

// get allowance list
const tronWeb = new TronWeb ({
    fullNode : RPC.url, 
    solidityNode : RPC.url, 
    eventServer : RPC.url,
    privateKey : WalletConstant.privateKey, // private key
});

const allowance = async () => {
    try{
        const rows = await getAllowanceHistory();
        if(rows.length == 0){
            console.log('List is empty');
        } else {
            const history = rows[0];
            const { id, user_id, to_address, contract, amount, token_qty, tx_id, network, status } = history;
        
            const transaction = await transfer(contract, to_address, token_qty);
            await updateAllowanceHistory(id, StatusConstant.withdraw.process, transaction); // 히스토리에 transaction hash 저장
            await transactionMonitor(transaction); // 저장된 transaction의 confirm까지 조회
            await updateAllowanceHistory(id, StatusConstant.withdraw.success, transaction); // confirm확인이 완료되면 업데이트
        }
    }
    catch(err){
        console.error(err);
    }
    finally{
        setTimeout(allowance, 3000); // 3초의 딜레이 이후 다음 출금 내역 실행
    }
}

const transfer = async (contractAddress, recepient, amount) => {
    const contract = await tronWeb.contract().at(contractAddress);
    const decimal = await contract.decimals().call();
    const name = await contract.name().call();
    const balanceOfToken = await checkBalanceForToken(contract);
    const balanceOfTRX = await checkBalanceForTRX();
    const minimumFee = tronWeb.toSun(100);
    const transferAmount = convertToDecimal(amount, decimal);

    console.log('#############################');
    console.log(`Contract Address: ${contractAddress}`);
    console.log(`Token Name: ${name}`);
    console.log(`Token Decimal: ${decimal}`);
    console.log('#############################');
    console.log(`Recepient Address: ${recepient}`);
    console.log(`${name} Balance: ${balanceOfToken}(${convertFromDecimal(balanceOfToken, decimal)}) | TransferAmount: ${transferAmount}(${amount})`);
    console.log(`TRX: ${balanceOfTRX}(${tronWeb.fromSun(balanceOfTRX)}) | MINIMUM TRX: ${minimumFee}(${tronWeb.fromSun(minimumFee)})`);
    console.log('#############################');

    // Tron 수수료 확인
    if(minimumFee > balanceOfTRX){
        throw 'less fee balance';
    }
    // USDT 잔량 확인
    if(amount > balanceOfToken){
        throw 'less usdt balance';
    }

    const transaction = await contract.transfer(recepient, transferAmount.toString()).send({feeLimit: 10000000, shouldPollResponse: false});
    return transaction;
}

// Transaction의 상태가 SUCCESS가 될 때 까지 Transaction검색
const transactionMonitor = async (transaction) => {
    try{
        const confired = await tronWeb.trx.getConfirmedTransaction(transaction);
        console.log(confired);
        if(confired.ret[0].contractRet == 'SUCCESS'){
            return confired;
        }
    }
    catch(err){
        console.log(`${err}: ${transaction}`);
        return transactionMonitor(transaction);
    }
}

const convertToDecimal = (value, _decimal) => {
    const decimal = 10**_decimal;
    const convertValue = value * decimal;
    return convertValue;
}

const convertFromDecimal = (value, _decimal) => {
    const decimal = 10**_decimal;
    const convertValue = value / decimal;
    return convertValue;
}

// USDT Balance Check
const checkBalanceForToken = async (contract) => {
    const balanceOf = await contract.balanceOf(WalletConstant.address).call();
    return balanceOf;
}

// TRX Balance Check
const checkBalanceForTRX = async () => {
    const balanceOf = await tronWeb.trx.getBalance(WalletConstant.address);
    return balanceOf;
}

allowance();