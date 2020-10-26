import React, { useState } from 'react';
import { useStore } from '../Hooks'
import auth0Client from '../Auth';
import AgentIcon from './AgentIcon';
import axios from 'axios';
import { Layout, Menu, Space } from 'antd';
import { CommentOutlined, SendOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '../stylesheets/App.css';

const API_URL = window.location.origin + '/api'

const { Content, Sider } = Layout;

export default function Classify(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const { uuid, type } = props;
    const [input, setInput] = useState("");
    const [results, setResults] = useState("Waiting for input.");

    const handleChange = (event) => {
        setInput(event.target.value);
    }

    const classify = (event) => {
        event.preventDefault();
        axios.post(`${API_URL}/classify/${uuid}`, {input: input})
         .then((response) => {
            setResults(JSON.stringify(response.data, null , 2));
            setInput("");
         });
    }

    const form = () => {
      return (
           <form className="grid" onSubmit={classify}>
                <div className="component terraced">
                    <input name="input" className="chat-input" onChange={handleChange} value={input} placeholder="Type here."/>
                    <div className="options">
                        <div onClick={classify} className="chat-input-send"><SendOutlined /> </div>
                    </div>
                </div>
           </form>
      );
    }

    const page = () => {
        return (
            <div className="component">
                <Space align="center" style={{ background:'#fff', padding: 0, height:'3.5em', border:0}}>
                    <span style={{marginLeft:'1em'}}><AgentIcon type={1} /> Classify</span>
                </Space>
                <Content>
                    <div className="classifier-results" style={{marginLeft:'1rem', marginRight:'1rem'}}><pre>{results}</pre></div>
                </Content>
                <div className="footer">
                    {form()}
                </div>
            </div>
        );
    }

    const inline = () => {
        return (
            <div className="component terraced">
                <div className="list no-margin-padding-border">
                    <Space align="center" style={{ background:'#fff', padding: 0, height:'3.5em', border:0}}>
                        <span style={{marginLeft:'1em'}}><AgentIcon type={1} /> Classify</span>
                    </Space>
                    { !results.length == 0 &&
                        <div className="list">
                            <div className="component ">
                                <div className="component ">
                                    <div className="classifier-results"><pre>{results}</pre></div>
                                </div>
                            </div>
                        </div>
                    }
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
