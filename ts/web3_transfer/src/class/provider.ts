import Web3 from 'web3';

class Provider {
    httpProvider: string;

    constructor() {}
    
    setProvider(url: string) {
        this.httpProvider = url;
    }

    getProvider() {
        if(this.httpProvider == null){
            throw 'please set httpProvider!';
        }

        const web3 = new Web3(new Web3.providers.HttpProvider(this.httpProvider));
        return web3;
    }

    showHttpProvider(){
        return this.httpProvider;
    }

    resetProvider(){
        this.httpProvider = '';
    }
}

export default Provider;