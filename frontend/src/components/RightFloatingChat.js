import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth0Client from '../Auth';
import Chat from './Chat';
import { AGENT_TYPES } from '../actions/agents';
import { Layout, Button } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

function RightFloatingChat(props) {
    const [collapsed, setCollapsed] = useState(true);

    const signOut = () => {
        auth0Client.signOut();
        props.history.replace('/');
    };

    const collapse = () => {
        setCollapsed(true);
    };



    return (
        <Sider
         collapsed={collapsed}
         defaultCollapsed={true}
         zeroWidthTriggerStyle={{position:'fixed', right: '2.5em', background:'none', top:'-.1em'}}
         breakpoint="xxl"
         width="98vw"
         collapsedWidth={0}
         theme="light"
         trigger={<Button size="small" shape="circle" icon={<CommentOutlined />} type="primary" style={{}} />}
         style={{bottom: '1vh', zIndex:'1002', position: 'fixed', height:'90vh', right: collapsed ? 0 : '1vw', background:'none'}}
         onCollapse={(collapsed, type) => {
            setCollapsed(collapsed);
         }}
         >
            <Chat identifier="main" type="inline"/>
        </Sider>
    );
}

export default withRouter(RightFloatingChat);
