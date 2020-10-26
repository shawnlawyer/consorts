import React, { useState } from 'react';
import { useStore } from '../Hooks'
import {
    deleteAgent,
    buildAgent,
    copyAgent,
    setAgentMainFlag,
    setAgentTemplateFlag,
    setAgentLockedFlag
} from '../actions/agents';

import AgentForm from './AgentForm';
import AgentModules from './AgentModules';
import AgentIcon from './AgentIcon';
import Chat from './Chat';
import Classify from './Classify';
import auth0Client from '../Auth';
import { Layout, Menu, Space, Button, Popconfirm, Upload, message, Row, Col } from 'antd';
import Tooltip from './Tooltip';
import {
    HomeFilled,
    HomeOutlined,
    BuildFilled,
    DeleteFilled,
    CaretUpFilled,
    CaretDownFilled,
    LockFilled,
    UnlockFilled,
    LockOutlined,
    UnlockOutlined,
    LoadingOutlined,
    CopyOutlined,
    FileTextOutlined,
    FileTextFilled,
    UploadOutlined
} from '@ant-design/icons';

const { Content } = Layout;

export default function Agent(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const {agent} = props;
    const [detailVisibility, setDetailVisibility] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [settingMain, setSettingMain] = useState(false);
    const [settingMainFlag, setSettingMainFlag] = useState(false);
    const [settingLockFlag, setSettingLockFlag] = useState(false);
    const [settingTemplateFlag, setSettingTemplateFlag] = useState(false);
    const [copying, setCopying] = useState(false);

    const dele = () => {
        const callbacks = {
            error: () => {
                setDeleting(false);
                setButtonsDisabled(false);
            }
        };
        setDeleting(true);
        setButtonsDisabled(true);
        setTimeout(() => {
            dispatch(deleteAgent(agent.uuid, callbacks));
        }, 0);
    }

    const copy = () => {
        const callbacks = {
            final: () => {
                setCopying(false);
                setButtonsDisabled(false);
            },
            error: () => {
                setCopying(false);
                setButtonsDisabled(false);
            }
        };
        setCopying(true);
        setButtonsDisabled(true);
        setTimeout(() => {
            dispatch(copyAgent(agent.uuid, callbacks));
        }, 0);
    }

    const setMainFlag = () => {
        const callbacks = {
            final: () => {
                setSettingMainFlag(false);
                setButtonsDisabled(false);
            },
            error: () => {
                setSettingMainFlag(false);
                setButtonsDisabled(false);
            }
        };
        setSettingMainFlag(true);
        setButtonsDisabled(true);
        dispatch(setAgentMainFlag({
            uuid: agent.uuid,
            flag: !agent.is_main
        }
        , callbacks));
    }

    const setLockFlag = () => {
        const callbacks = {
            final: () => {
                setSettingLockFlag(false);
                setButtonsDisabled(false);
            },
            error: () => {
                setSettingLockFlag(false);
                setButtonsDisabled(false);
            }
        };
        setSettingLockFlag(true);
        setButtonsDisabled(true);
        dispatch(setAgentLockedFlag({
            uuid: agent.uuid,
            flag: !agent.is_locked
        }
        , callbacks));
    }

    const setTemplateFlag = () => {
        const callbacks = {
            final: () => {
                setSettingTemplateFlag(false);
                setButtonsDisabled(false);
            },
            error: () => {
                setSettingTemplateFlag(false);
                setButtonsDisabled(false);
            }
        };
        setSettingTemplateFlag(true);
        setButtonsDisabled(true);
        dispatch(setAgentTemplateFlag({
            uuid: agent.uuid,
            flag: !agent.is_template
        }
        , callbacks));
    }

    const interactors = () =>{
        switch(agent.type){
            case 1:
                return (
                    <Classify uuid={agent.uuid} type="inline"/>
                    );
            case 2:
                return (
                    <div className="head">
                        <div className="list">
                            <Chat identifier={agent.uuid} type="inline"/>
                            <Classify uuid={agent.uuid} type="inline"/>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="component terraced">
            <div className="list no-margin-padding-border">
                <div className="grid no-margin-padding-border" style={{ whiteSpace: 'nowrap'}}>
                    <Space>
                        {<AgentIcon type={agent.type}/>}
                        {agent.name}
                        { agent.is_locked &&
                            <Tooltip title="Agent Locked" overlayStyle={{borderRadius:'.5em'}}>
                                <LockFilled />
                            </Tooltip>
                        }
                        { agent.is_main &&
                            <Tooltip title="Main Agent">
                                <HomeFilled />
                            </Tooltip>
                        }
                        { agent.is_template &&
                            <Tooltip title="Template">
                                <FileTextFilled />
                            </Tooltip>
                        }
                    </Space>
                    <Space size="small">
                        <span>&nbsp;</span>
                        { !agent.is_locked && auth0Client.hasPermission('delete:agents') &&
                            (deleting  ?
                                <Tooltip title="Deleting Agent">
                                    <Button type="danger" shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                </Tooltip>
                              :
                                <Tooltip title="Delete Agent">
                                    <Popconfirm disabled={buttonsDisabled} title="Confirming Delete?" placement="left" onConfirm={dele} okText="Confirm" cancelText="Cancel">
                                         <Button disabled={buttonsDisabled} type="danger" shape="circle" size="small" icon={ <DeleteFilled />} />
                                    </Popconfirm>
                                </Tooltip>
                            )
                        }
                        { auth0Client.hasPermission('create:agents') &&
                            (copying  ?
                                <Tooltip title="Making Copy">
                                    <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                </Tooltip>
                              :
                                <Tooltip title="Make Copy">
                                    <Button disabled={buttonsDisabled} shape="circle" size="small" onClick={copy} icon={ <CopyOutlined />} />
                                </Tooltip>
                            )
                        }
                        { auth0Client.hasPermission('lock:agents') &&
                            (settingMainFlag ?
                                <Tooltip title={!agent.is_main ? "Making Main" : "Making Not Main"}>
                                    <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                </Tooltip>
                              :
                                <Tooltip title={agent.is_main ? "Make Not Main" : "Make Main"}>
                                    <Button disabled={buttonsDisabled} size="small" shape="circle" onClick={setMainFlag} icon={ agent.is_main ? <HomeFilled /> : <HomeOutlined />}/>
                                </Tooltip>
                            )
                        }
                        { auth0Client.hasPermission('lock:agents') &&
                            (settingLockFlag ?
                                <Tooltip title={agent.is_locked ? "Unlocking Agent" : "Locking Agent"}>
                                    <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                </Tooltip>
                              :
                                <Tooltip title={agent.is_locked ? "Unlock Agent" : "Lock Agent"}>
                                    <Button disabled={buttonsDisabled} size="small" shape="circle" onClick={setLockFlag} icon={ agent.is_locked ? <UnlockOutlined /> : <LockOutlined />}/>
                                </Tooltip>
                            )
                        }
                        { auth0Client.hasPermission('lock:agents') &&
                            (settingTemplateFlag ?
                                <Tooltip title={!agent.is_template ? "Making Template" : "Making Not Template"}>
                                    <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                </Tooltip>
                              :
                                <Tooltip title={agent.is_template ? "Make Not Template" : "Make Template"}>
                                    <Button disabled={buttonsDisabled} size="small" shape="circle" onClick={setTemplateFlag} icon={ !agent.is_template ? <FileTextFilled /> : <FileTextOutlined />}/>
                                </Tooltip>
                            )
                        }
                        { auth0Client.hasPermission('update:agents') &&
                            ( agent.is_building ?
                                <Tooltip title="Building Agent">
                                    <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                </Tooltip>
                              :
                                <Tooltip title="Build Agent">
                                    <Button disabled={buttonsDisabled} shape="circle" size="small" onClick={() => dispatch(buildAgent(agent.uuid))} icon={<BuildFilled />}/>
                                </Tooltip>
                            )
                        }
                        <Button size="small" onClick={() => setDetailVisibility(!detailVisibility)} icon={!detailVisibility ? <CaretDownFilled/> : <CaretUpFilled/>}/>
                    </Space>
                </div>
                { detailVisibility && !agent.is_locked && auth0Client.hasPermission('update:agents') &&

                    <Space direction="vertical" style={{margin:'.5em 0'}}>
                        <b>Name</b>
                        <AgentForm type={agent.type} uuid={agent.uuid} name={agent.name}/>
                        <b>Identifier</b>
                        <div className="component">{agent.uuid}</div>
                    </Space>
                }
                { detailVisibility &&
                    <Space direction="vertical" style={{margin:'.5em 0'}}>
                        <AgentModules agent={agent}/>
                        { (agent.modules.length) ?
                            <Classify uuid={agent.uuid} type="inline"/>
                          : null
                        }
                        { (agent.modules.length) && agent.type == 2 ?
                            <Chat identifier={agent.uuid} type="inline"/>
                          : null
                        }
                    </Space>
                }
            </div>
        </div>
    );
}
