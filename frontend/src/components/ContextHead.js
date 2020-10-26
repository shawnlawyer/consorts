import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import auth0Client from '../Auth';
import { Space, Layout, Button, Avatar } from 'antd';
import { CommentOutlined, HomeOutlined, AppstoreOutlined, SettingOutlined, ShareAltOutlined, MenuOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { AGENT_TYPES } from '../actions/agents';

const { Header } = Layout;

function ContextHead(props) {

    const signOut = () => {
        auth0Client.signOut();
        props.history.replace('/');
    };

    return (
        <div className="list no-margin-padding">
            <div className="grid no-margin-padding" style={{ borderBottom: '1px solid #f0f0f0', background:'#fff', zIndex:'999', whiteSpace: 'nowrap', position: 'fixed', top:'0', left:'0', paddingLeft:'3em', paddingRight:'.6em'}}>
                { props.children ||
                    <Space size="small" align="center" style={{height: '3em'}}>
                        { props.icon }
                        { props.title }
                    </Space>
                }{ auth0Client.isAuthenticated() &&
                <Space align="center">
                    <Avatar size="medium">
                        { auth0Client.getProfile().name.charAt(0).toUpperCase() }
                    </Avatar>
                </Space>
                }
            </div>
        </div>

    );
}

export default withRouter(ContextHead);
