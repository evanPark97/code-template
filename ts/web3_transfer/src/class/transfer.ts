import Provider from "./provider";
import Spender from "./spender";

import { TransactionReceipt, TransactionConfig } from "web3-core";

class Transfer {
    transactionConfig: TransactionConfig;

    constructor(transactionConfig: TransactionConfig) {
        this.transactionConfig = transactionConfig;
    }

    /**
     * 네트워크 코인 전송
     * 
     * @return 전송 성공여부
     */
    async sendTransaction() {
        return await this.transfer(this.transactionConfig);
    }

    private async transfer(transaction: TransactionConfig) {
        const spender = new Spender();

        const provider = new Provider();
        const web3 = provider.getProvider();

        const signTransaction = await web3.eth.accounts.signTransaction(transaction, spender.address.private);
        if(signTransaction.rawTransaction != null)
            web3.eth.sendSignedTransaction(signTransaction.rawTransaction).on('confirmation', (confNumber: number, receipt: TransactionReceipt) => {
                console.log(`Confirm Count: ${confNumber}`);

                if(confNumber >= 24){
                    const { transactionHash } = receipt;
                    console.log(transactionHash);
                    return transactionHash;
                }
            })
        else
            throw 'Transactoin fail!';           
    }
}

export default Transfer;