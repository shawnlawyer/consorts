import Pusher from 'pusher-js';

class Push {

    constructor() {
        this.pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: process.env.REACT_APP_PUSHER_CLUSTER,
            encrypted: true
        });
        this.channels = {}
    }

    subscribe(channel){
        if (!(channel in this.channels)){
            this.channels[channel] = {
                channel: this.pusher.subscribe(channel),
                bindings: []
            }
        }
    }

    bindAction(channel, key, callback){
        this.subscribe(channel)
        if (!(this.channels[channel].bindings.includes(key))){
            this.channels[channel].bindings.push(key)
            this.channels[channel].channel.bind(key, data => {
              callback(data)
            });
        }
    }

}

const push = new Push();

export default push;
