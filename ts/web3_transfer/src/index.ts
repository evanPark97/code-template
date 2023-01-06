import Provider from "./class/provider";
import Receivers from "./class/receivers";
import Spender from "./class/spender";
import Transfer from "./class/transfer";

const setup = async () => {
    const provider = new Provider();
    provider.setProvider('');

    const spender = new Spender();
    spender.setSpender({public: '', private: ''});
}

const run = () => {
    // 코인과 토큰을 분리하여 transactionConfig를 생성

    const transactionConfig = {
        maxFee: ,
        maxFeePerGas: ,
        maxPriorityFeePerGas: ,
        from: ,
        to: ,
        value: ,
        data: ,
    }

    const transfer = new Transfer(transactionConfig);
}


