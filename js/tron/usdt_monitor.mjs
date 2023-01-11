import TronWeb from 'tronweb';
import { getDepositHistory, updateDepositHistory, getNow } from './db_connection.mjs';
import { RPC, WalletConstant, StatusConstant } from './config.mjs';

const tronWeb = new TronWeb ({
    fullNode : RPC.url, 
    solidityNode : RPC.url, 
    eventServer : RPC.url,
    privateKey : WalletConstant.privateKey, // private key
});

const monitor = async () => {
    const rows = await getDepositHistory();
    if(rows.length == 0){
        console.log('List is empty');
    } else {
        const { id, user_id, address, tx_id, amount, status } = rows[0];
    
        // validator
        const isAddress = tronWeb.isAddress(address);
        console.log(isAddress);
        if(isAddress){
            await updateDepositHistory(id, StatusConstant.transfer.process);
            if(tx_id == null || tx_id == '' || tx_id == undefined){
                // Transaction Hash가 없는경우 해당 내용의 확인이 불가능하기 때문에 실패 처리
                await updateDepositHistory(id, StatusConstant.deposit.fail);
            } else {
                await transactionChecked(id, tx_id);
            }
    
        } else {
            console.error(`'${address}' is not tron address!`);
        }
    }
    
    setTimeout(monitor, 3000); // 다음 호출까지 딜레이
}

// Transaction의 실패, 성공 여부를 확인
// 입금처리가 확인된 내역에 대해서는 Laravel에서 별도의 스케쥴러가 처리됨
// DAPP에서 입금관련처리가 모두 완료된 경우에는 상태값은 200
async function transactionChecked(id, tx_id) {
    try{
        const confired = await tronWeb.trx.getConfirmedTransaction(tx_id);
        console.log(confired);
        if(confired.ret[0].contractRet == 'SUCCESS'){
            await updateDepositHistory(id, StatusConstant.deposit.success); // 입금처리 완료 - 수당처리 대기 상태
        }
    }
    catch(err){
        console.log(err);
        await updateDepositHistory(id, StatusConstant.deposit.fail); // 실패 - 트랜잭션 실패
    }
}

monitor();