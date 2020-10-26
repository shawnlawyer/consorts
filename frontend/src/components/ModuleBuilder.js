import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { useStore } from '../Hooks'
import { deleteModule, fitModule, loadModule, updateModule, saveModule, clearModule, downloadModule, moduleJSON } from '../actions/modules';
import ModuleIntent from './ModuleIntent';
import IntentForm from './IntentForm';
import ModuleForm from './ModuleForm';
import ModuleJSONForm from './ModuleJSONForm';
import ContextHead from './ContextHead';
import ListOrEmpty from './ListOrEmpty';
import Loads from './Loads';
import Page from './Page';
import auth0Client from '../Auth';
import { Layout, Button, Spin, Space, Tooltip, Popconfirm, Menu } from 'antd';
import { AppstoreOutlined, LoadingOutlined, CloudDownloadOutlined, DeleteFilled, EyeFilled } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default function ModuleBuilder(props){

    const [state, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const { name, intents, is_locked, uuid } = state.module;
    const { module } = state;
    const [codeVisible, setCodeVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [settingNoise, setSettingNoise] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const callbacks = {
            final: () => { setLoaded(true) }
        }
        dispatch(loadModule(props.match.params.uuid, callbacks))
        return function cleanup () {
            dispatch(clearModule());
        }
    },[props.match.params.uuid]);

    const dele = () => {
        const callbacks = {
            final: () => {
                setDeleted(true);
                setButtonsDisabled(false);
            },
            error: () => {
                setDeleting(false);
                setButtonsDisabled(false);
            }
        };
        setDeleting(true);
        setButtonsDisabled(true);
        setTimeout(() => {
            dispatch(deleteModule(uuid, callbacks));
        }, 0);
    }

    const download = () => {
        const callbacks = {
            final: () => {
                setDownloading(false);
                setButtonsDisabled(false);
            },
            error: () => {
                setDownloading(false);
                setButtonsDisabled(false);
            }
        };
        setDownloading(true);
        setButtonsDisabled(true);
        dispatch(downloadModule(uuid, callbacks))
    }

    const code = () => {
        return moduleJSON(state.module)
    }

    const contextHead = () => {
        return (
                loaded ?
                <ContextHead>
                    <Menu mode="horizontal" theme="light" style={{margin:'-.2em 0 0 0', padding:0, border:0, height:'3.3em'}}>
                        <SubMenu key="options" icon={ <AppstoreOutlined /> } title={ `Module > ${name}` } style={{margin:0, padding:0}}>
                        { auth0Client.hasPermission('update:modules') &&
                            <Menu.Item key="view" icon={<EyeFilled />} onClick={ () => setCodeVisible(!codeVisible) } disabled={buttonsDisabled}>
                                { !is_locked && auth0Client.hasPermission('update:modules') ?
                                    !codeVisible ? "Edit JSON" : "Edit Visually"
                                 :
                                    !codeVisible ? "View JSON" : "View Visually"
                                }
                            </Menu.Item>
                        }
                        { !module.is_locked && auth0Client.hasPermission('update:modules') &&
                            ( deleting ?
                                <Menu.Item key="delete" icon={<LoadingOutlined spin /> }>
                                    <Link>Deleting</Link>
                                </Menu.Item>
                                  :
                                <Menu.Item key="delete" icon={<DeleteFilled/> }>
                                    <Popconfirm disabled={buttonsDisabled} title="Confirming Delete?" placement="left" onConfirm={dele} okText="Confirm" cancelText="Cancel">
                                        <Link disabled={buttonsDisabled} type="danger">Delete</Link>
                                    </Popconfirm>
                                </Menu.Item>
                            )
                        }
                        { downloading ?
                            <Menu.Item key="download" icon={<LoadingOutlined spin /> }>
                                <Link><LoadingOutlined spin /> Download</Link>
                            </Menu.Item>
                          :
                            <Menu.Item key="download" icon={<CloudDownloadOutlined/> }>
                                <Link disabled={buttonsDisabled} onClick={download}>Download</Link>
                            </Menu.Item>
                        }
                        { auth0Client.hasPermission('read:agents') && module.agent_uuid &&
                            <Menu.Item key="agent" icon={<EyeFilled/> }>
                                <Link to={'/agent/' + module.agent_uuid}>
                                    View Agent
                                </Link>
                            </Menu.Item>
                        }
                        </SubMenu>
                    </Menu>
                </ContextHead>
                :
                <ContextHead icon={ <AppstoreOutlined /> } title={ `Module > Loading` } />
        );
    }


    return (
        <Page header={contextHead()}>
        {deleted && <Redirect to="/modules" />}
            <Loads loaded={loaded}>
                <Content style={{background:'#fff'}}>
                    <Layout style={{background:'#fff'}}>
                    { !codeVisible ?
                         !is_locked ?
                            <Space direction="vertical" style={{width:'100%', padding:'.5em'}}>
                                <b>Name</b>
                                <ModuleForm is_locked={is_locked} uuid={uuid} name={name}/>
                            </Space>
                        :
                        null
                    :
                        <ModuleJSONForm uuid={uuid} is_locked={is_locked} code={code()} modified={ false } />
                    }
                    { !codeVisible &&
                        <Space direction="vertical" style={{width:'100%', padding:'.5em'}}>
                            <div className="head">
                                <div className="list"><b>Intents</b></div>
                            </div>
                            { !is_locked &&
                                <IntentForm module_uuid={uuid}/>
                            }
                            <ListOrEmpty
                                items={intents}
                                description={`Intents Empty`}>
                            {intents.map((intent, index) => (
                                <ModuleIntent agent_type={module.type} key={intent.id} intent={intent} is_locked={is_locked}/>
                            ))}
                            </ListOrEmpty>
                        </Space>
                    }
                    </Layout>
                </Content>
            </Loads>
        </Page>
    );
}
