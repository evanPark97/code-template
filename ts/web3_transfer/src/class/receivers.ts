interface IReceiver {
    address: string;
    value: number;
}

class Receivers {
    receivers: IReceiver[];

    constructor(...receiver: IReceiver[]) {
        this.receivers = [...receiver];
    }

    enqueue(receiver: IReceiver) {
        this.receivers.push(receiver);
    }

    dequeue(){
        return this.receivers.shift();
    }

    getReceiver() {
        return this.receivers;
    }

    clear() {
        this.receivers = [];
    }

    length() {
        return this.receivers.length;
    }
}

export default Receivers;