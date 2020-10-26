import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { useStore } from '../Hooks'
import { Link } from 'react-router-dom';
import ModulesList from './ModulesList'
import ModuleForms from './ModuleForms'
import Module from './Module';
import { postAgentModule, deleteAgentModule, updateAgent, AGENT_TYPES } from '../actions/agents';
import { loadModules } from '../actions/modules';
import auth0Client from '../Auth';
import { Layout, Space, Button, Spin, Select, Divider } from 'antd';
import {
    AppstoreOutlined,
    SettingOutlined,
    MinusOutlined,
    EyeFilled,
    LoadingOutlined

} from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Option } = Select;
const { Content } = Layout;

export default function AgentModules(props){
    const [state, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const { agent } = props;
    const { modules, loaded } = state.modules;
    const [codeVisible, setCodeVisible] = useState(false);

    return (
        <Space direction="vertical" style={{width:'100%', padding:'.5em 0'}}>
            <Divider plain><AppstoreOutlined /> Modules</Divider>
            { !agent.is_locked && auth0Client.hasPermission('update:agents') ?
                <ModuleForms code={AGENT_TYPES[agent.type]['code']} agent={agent} />
            : null
            }
            { agent.modules.length !== 0 &&
                <ModulesList modules={agent.modules} />
            }
        </Space>
    );

}
