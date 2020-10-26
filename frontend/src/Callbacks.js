export function handleCallbacks(callbacks){
    if (callbacks instanceof Array){
        callbacks.map((callback) => {callback()});
    }else if (typeof callbacks === 'function') {
        callbacks()
    }
};
