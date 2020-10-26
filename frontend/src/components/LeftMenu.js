import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import auth0Client from '../Auth';
import { AGENT_TYPES } from '../actions/agents';
import { Layout, Menu } from 'antd';
import { CommentOutlined, HomeOutlined, AppstoreOutlined, SettingOutlined, ShareAltOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

function LeftMenu(props) {
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
         zeroWidthTriggerStyle={{top:0}}
         breakpoint="xxl"
         collapsedWidth={0}
         theme="light"
         style={{zIndex:'1000', position: 'fixed', height: '100vh', top: 0 , left: 0 , bottom: 0 }}
         onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            setCollapsed(collapsed);
          }}
         >
            <Menu mode="inline" theme="light" style={{ top:0, bottom: 0, width: '100%', height: '100%' }} onClick={collapse}>
                <Menu.Item key="home" icon={<HomeOutlined />}><Link to='/'>Consorts Home</Link></Menu.Item>
                { auth0Client.hasPermission('read:agents') &&
                <Menu.Item key="classifiers" icon={<ShareAltOutlined rotate={270}/>}>
                    <Link to='/classifiers'>{AGENT_TYPES[1]['name'][1]}</Link>
                </Menu.Item>
                }
                { auth0Client.hasPermission('read:agents') &&
                <Menu.Item key="chatbots" icon={<CommentOutlined/>}>
                    <Link to='/chatbots'>{AGENT_TYPES[2]['name'][1]}</Link>
                </Menu.Item>
                }
                { auth0Client.isAuthenticated() ?
                <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {signOut()}}>
                    Sign Out
                </Menu.Item>
                :
                <Menu.Item key="login" icon={<LoginOutlined />} onClick={auth0Client.signIn}>
                    Sign In
                </Menu.Item>
                }
            </Menu>
        </Sider>
    );
}

export default withRouter(LeftMenu);
