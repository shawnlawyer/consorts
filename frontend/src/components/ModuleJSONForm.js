import React, { useState } from 'react';
import auth0Client from '../Auth'
import { useStore } from '../Hooks';
import { saveModule, validateJSON } from '../actions/modules';
import { Layout, Menu, Space, Button, Spin } from 'antd';
import { FileTextFilled, SaveFilled, PlusOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

const { Content, Sider } = Layout;

export default function ModuleJSONForm(props) {

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const {uuid, agent} = props;
    const [code, setCode] = useState(props.code || "");
    const [modified, setModified] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (value) => {
        setCode(value);
        setModified((value !== props.code && value !== "") ? true : false);
    }

    const reset = () => {
        setButtonsDisabled(false);
        setCode(props.code || "");
        setModified(false);
        setSaving(false);
    }

    const save = (event) => {
        const callbacks = {
            error: () => {;
                setButtonsDisabled(false);
                setSaving(false);
            },
            final: !uuid
                ? reset
                : () => {
                    setButtonsDisabled(false);
                    setModified(false);
                    setSaving(false);
                }
        };

        event.preventDefault();
        if(buttonsDisabled || !modified || !validateJSON(code)){
            return;
        }
        setButtonsDisabled(true);
        setSaving(true);
        if(uuid){
            dispatch(saveModule({uuid: uuid, ...JSON.parse(code)}, callbacks));
        }else{
            dispatch(saveModule({agent_uuid: agent.uuid, ...JSON.parse(code)}, callbacks));
        }
    }

    return (
      <Layout style={{background:'#fff', height:'100%'}}>
            <Space align="center" style={{position: 'relative', overflow:'hidden', padding: 0, zIndex: 100, width: '100%', height:'3em', background:'#fff', border: 0, borderBottom: '1px solid #f0f0f0'}}>
               <Space style={{marginLeft:'1.5em'}}><FileTextFilled /> JSON Template</Space>
                { auth0Client.hasPermission('create:modules') &&
                     <div style={{position:'absolute', right: '.5em', top:'.5em' }}>
                          { ! saving ?
                          <Button size="small" shape="circle" disabled={(buttonsDisabled === true || modified === false )} onClick={save} type="primary" icon={<SaveFilled/>} />

                          :
                          <Button size="small" shape="circle" type="primary" icon={<LoadingOutlined spin/>} />

                          }
                     </div>
                }
            </Space>
            <Content style={{background:'#fff', width:'100%', height:'100%', overflow:'hidden', padding:0}}>
                <AceEditor
                    mode="javascript"
                    theme="github"
                    onChange={handleChange}
                    fontSize={14}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                    name="code"
                    width="100%"
                    value={code}
                    setOptions={{
                        showLineNumbers: true,
                        tabSize: 2,
                        wrap: true
                    }}
                />
            </Content>
      </Layout>
    );
}
