import TronWeb from 'tronweb';
import { getWithdrawHistory, updateWithdrawHistory, getNow } from './db_connection.mjs';
import { RPC, WalletConstant, ContractConstant, StatusConstant } from './config.mjs';

const tronWeb = new TronWeb ({
    fullNode : RPC.url, 
    solidityNode : RPC.url, 
    eventServer : RPC.url,
    privateKey : WalletConstant.privateKey, // private key
});
const contract = await tronWeb.contract().at(ContractConstant.address);


const withdraw = async () => {
    try{
        const rows = await getWithdrawHistory();
        if(rows.length == 0){
            console.log('List is empty');
        } else {
            const history = rows[0];
            const { id, user_id ,address, tx_id, before_amount, amount, status } = history;
        
            const transaction = await transfer(address, amount);
            await updateWithdrawHistory(id, StatusConstant.withdraw.process, transaction); // 히스토리에 transaction hash 저장
            await transactionMonitor(transaction); // 저장된 transaction의 confirm까지 조회
            await updateWithdrawHistory(id, StatusConstant.withdraw.success, transaction); // confirm확인이 완료되면 업데이트
        }
    }
    catch(err){
        console.error(err);
    }
    finally{
        setTimeout(withdraw, 3000); // 3초의 딜레이 이후 다음 출금 내역 실행
    }
}

const transfer = async (recepient, amount) => {
    const balanceOfUSDT = await checkBalanceForUSDT();
    const balanceOfTRX = await checkBalanceForTRX();
    const minimumFee = tronWeb.toSun(100);
    const transferAmount = tronWeb.toSun(amount);

    console.log('#############################');
    console.log(`Recepient Address: ${recepient}`);
    console.log(`USDT: ${balanceOfUSDT}(${tronWeb.fromSun(balanceOfUSDT)}) | TransferAmount: ${transferAmount}(${amount})`);
    console.log(`TRX: ${balanceOfTRX}(${tronWeb.fromSun(balanceOfTRX)}) | MINIMUM TRX: ${minimumFee}(${tronWeb.fromSun(minimumFee)})`);
    console.log('#############################');

    // Tron 수수료 확인
    if(minimumFee > balanceOfTRX){
        throw 'less fee balance';
    }
    // USDT 잔량 확인
    if(amount > balanceOfUSDT){
        throw 'less usdt balance';
    }

    const transaction = await contract.transfer(recepient, transferAmount).send({feeLimit: 10000000, shouldPollResponse: false});
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

// USDT Balance Check
const checkBalanceForUSDT = async () => {
    const balanceOf = await contract.balanceOf(WalletConstant.address).call();
    return balanceOf;
}

// TRX Balance Check
const checkBalanceForTRX = async () => {
    const balanceOf = await tronWeb.trx.getBalance(WalletConstant.address);
    return balanceOf;
}

withdraw();