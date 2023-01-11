import Web3 from 'web3';

const companyAddr = [
    {"account":{"address":"0x00000","privKey":"0x00000"}},
]

eachAddress(); // auto minting

async function autoMint(address : any, privateKey : any){
    try{
        const web3 : any = new Web3(new Web3.providers.HttpProvider(''));
        const contractAddress: string = "0x00000";
        const contractABI: any = await require(`../contractABI/0x00000.json`);
        const contract = await new web3.eth.Contract(contractABI, contractAddress);

        const mintingInformation = await contract.methods.mintingInformation().call();
        const price = mintingInformation[9]; // _publicMintPrice
        const balance : any = await web3.eth.getBalance(address);

        console.log(`-- Minting...`);
        console.log(`[NFT Price: ${web3.utils.fromWei(price, 'ether')}]`);
        
        let qty = getRandomInt(1, 5);
        if(await web3.utils.fromWei(balance, 'ether') < 0.6){
            qty = Math.floor(await web3.utils.fromWei(balance, 'ether') / await web3.utils.fromWei(price, 'ether'));
        }
        
        if(await web3.utils.fromWei(balance, 'ether') < 0.14){
            return false;
        }
        
        const encodeABI = await contract.methods.publicMint(1).encodeABI();
        const resultPrice = price * 1;

        console.log(`Quantity: ${1}`);
        console.log(`Result Price: ${resultPrice}`);

        const estimateGas = await web3.eth.estimateGas({
            to: contractAddress,
            from: address,
            value: web3.utils.toHex(resultPrice.toString()),
            data: encodeABI,
        })

        const randGwei = getRandomInt(80, 90);
        const gwei = getRandomGwei(10000000, 99999999);
        console.log(`${randGwei}.${gwei}`);
        const transactionParameters = {
            // gasPrice: web3.utils.toHex(gasPrice.toString()),
            gasLimit: web3.utils.toHex(estimateGas.toString()),
            maxFeePerGas: web3.utils.toHex(web3.utils.toWei(`${randGwei}.${gwei}`,'gwei')),
            maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei(`${randGwei}.${gwei}`,'gwei')),
            to: contractAddress,
            from: address,
            value: web3.utils.toHex(resultPrice.toString()),
            data: encodeABI,
        }

        console.log(`[Gas Limit: ${estimateGas}]`);
        // console.log(`[Estimate Gas: ${estimateGas}]`);

        // Transaction Signing
        const res = await web3.eth.accounts.signTransaction(transactionParameters, privateKey);
        const raw = res.rawTransaction

        console.log(raw);
        // send Transaction
        web3.eth.sendSignedTransaction(raw, (error : any, txHash : any) => {
            if (error) {
                // throw new Error(`-- Send Transaction ${error}`);
                console.log(`-- Send Transaction ${error}`);
            }
            console.log(`Hash: ${txHash}`);
        });
    }
    catch(err){
        console.log(err);
    }
}

function eachAddress(){
    try{
        companyAddr.map((account, index) => {
            setTimeout(async () => {
                // console.log(new Date());
                const addr = account.account.address;
                const privateKey = account.account.privKey;
                await autoMint(addr, privateKey);
            }, ((500) * index));
            // }, getRandomInt(2000, 8000) * index);
        })
    }catch(err){
        console.log(err);
    }
}

function getRandomInt(min : number, max : number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function getRandomGwei(min : number, max : number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}