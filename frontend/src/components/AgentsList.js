import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { useStore } from '../Hooks'
import { loadAgents } from '../actions/agents';
import Agent from './Agent';
import AgentForm from './AgentForm';
import AgentIcon from './AgentIcon';
import ContextHead from './ContextHead';
import ListOrEmpty from './ListOrEmpty';
import Loads from './Loads';
import { AGENT_TYPES } from '../actions/agents';
import auth0Client from '../Auth';
import Page from './Page';
import { Space } from 'antd';

export default function AgentsList(props) {
    const {type} = props;
    const [state, dispatch] = useStore();
    const { loaded } = state.agents;
    const agents = Object.values(state.agents.agents).filter(agent => type ? agent.type == type : true)

    useEffect(() => {
        if (!loaded){
            dispatch(loadAgents());
        }
    },[true]);

    return (
        <Page
            header={<ContextHead icon={<AgentIcon type={type}/>} title={ `${type ? AGENT_TYPES[type]['name'][1] : "All Agents"} > List` } />}>
                <Space direction="vertical" style={{width:'100%', padding:'.5em'}}>
                { type && auth0Client.hasPermission('create:agents') &&
                    <AgentForm type={type} />
                }
                <Loads loaded={loaded}>
                    <ListOrEmpty
                        items={agents}
                        description={`${type ? AGENT_TYPES[type]['name'][1] : "Agents"} Empty`}>
                           { agents.map((agent, key) => (
                               <Agent key={agent.id} agent={agent} />
                           ))}
                    </ListOrEmpty>
                </Loads>
                </Space>
        </Page>
    );
}
