interface ISpender {
    public: string;
    private: string;
}

class Spender {
    address: {
        public: string;
        private: string;
    }

    constructor() {}

    setSpender(spender: ISpender) {
        this.address = spender;
    }

    getSpender() {
        return this.address;
    }
}

export default Spender;