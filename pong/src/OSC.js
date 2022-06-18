import { Client } from 'node-osc';
import { OSC_ADDRESS, OSC_PORT } from './config';

export default class OSC_Client {
    constructor() {
        this.address = OSC_ADDRESS;
        this.port = OSC_PORT;
        
        this.client = new Client(this.address, this.port);
        this.bundle;
    }


    send(){
        this.client.send(this.bundle);
    }

    setBundle(bundle){
        this.bundle = bundle;
    }
}