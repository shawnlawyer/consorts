import React, {useState, useEffect} from 'react';
import { useStore } from '../Hooks'
import { bindAgentPushListeners } from '../actions/agents'

export default function PushListeners(props) {
    const [state, dispatch] = useStore();
    const {agents, loaded} = state.agents

    useEffect(() => {
        if(loaded){
            dispatch(bindAgentPushListeners(agents))
        }
    },[agents]);

    return (
        <></>
    );
}
