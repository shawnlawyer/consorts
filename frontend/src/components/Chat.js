import React, { useState } from 'react';
import { useStore } from '../Hooks'
import auth0Client from '../Auth';
import AgentIcon from './AgentIcon';
import Page from './Page';
import ContextHead from './ContextHead';
import { AGENT_TYPES } from '../actions/agents';
import axios from 'axios';
import { Layout, Menu, Space } from 'antd';
import { CommentOutlined, SendOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../stylesheets/App.css';

const API_URL = window.location.origin + '/api'

const { Content, Sider } = Layout;

export default function Chat(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const { type } = props;
    const { identifier } = props.identifier || props.match.params.identifier;
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    const chat = (event) => {
        event.preventDefault();
        axios.post(`${API_URL}/chat/${props.identifier || props.match.params.identifier}`, {message: message})
         .then((response) => {
            setResponse(response.data.response);
            setMessage("");
         });
    }

    const form = () => {
      return (
           <form className="grid" onSubmit={chat}>
                <div className="component terraced">
                    <input name="message" className="chat-input" onChange={handleChange} value={message} placeholder="Type here."/>
                    <div className="options">
                        <div onClick={chat} className="chat-input-send"><SendOutlined /> </div>
                    </div>
                </div>
           </form>
      );
    }

    const page = () => {
        return (
        <Page
            footer={<div className="footer">{form()}</div>}
            header={ <ContextHead icon={<AgentIcon type={2}/>} title={ `${AGENT_TYPES[2]['name'][1]} > Chat` } /> }>

            <Layout style={{background:'#fff'}}>
            <div className="chat-responses" style={{margin:'1em'}}>
                {response.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })}
            </div>

            </Layout>
        </Page>
        );
    }

    const inline = () => {
        return (
            <div className="component terraced" style={{ background:'#fff', height:'100%' }}>
                <div className="list no-margin-padding-border" style={{ height:'100%' }}>
                    <Space align="center" style={{padding: 0, height:'3.5em', border:0}}>
                        <span style={{marginLeft:'1em'}}><AgentIcon type={2} /> Chat</span>
                    </Space>
                    <Content style={{ background:'#fff'}}>
                        <div className="chat-responses" style={{margin:'1em'}}>
                        {response.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br/></span>
                        })}
                        </div>
                    </Content>
                    {form()}
                </div>
            </div>
        );
    }

    switch(type){
        case "inline":
            return inline()
        case "page" :
        default:
            return page()
    }
}
