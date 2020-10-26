import React, {useState} from 'react';
import { useStore } from '../Hooks'
import {Link} from 'react-router-dom';
import { Space, Button, Popconfirm} from 'antd';
import Tooltip from './Tooltip';
import { BuildFilled, DeleteFilled, EyeFilled, MenuFoldOutlined, MenuUnfoldOutlined, LockFilled, LoadingOutlined, CloudDownloadOutlined, AppstoreOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import auth0Client from '../Auth';
import { deleteModule, setModuleNoiseFlag, downloadModule } from '../actions/modules';

export default function Module(props) {

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const { module } = props;
    const [deleting, setDeleting] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [settingNoiseFlag, setSettingNoiseFlag] = useState(false);

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
            dispatch(deleteModule(module.uuid, callbacks));
        }, 0);
    }

    const setNoiseFlag = () => {
        const callbacks = {
            final: () => {
                setSettingNoiseFlag(false);
                setButtonsDisabled(false);
            },
            error: () => {
                setSettingNoiseFlag(false);
                setButtonsDisabled(false);
            }
        };
        setSettingNoiseFlag(true);
        setButtonsDisabled(true);
        dispatch(setModuleNoiseFlag({
            uuid: module.uuid,
            flag: !module.is_noise
        }
        , callbacks));
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
        dispatch(downloadModule(module.uuid, callbacks))
    }

    return (
      <div className="component terraced">
        <Space>
            <span style={{marginLeft:'1em'}}><AppstoreOutlined /></span>
            <div>{module.name}</div>
            { module.is_noise &&
                <Tooltip title="Training Noise">
                    <MenuUnfoldOutlined />
                </Tooltip>
            }
        </Space>
        <div className="options">
            <Space size="small">
                <span>&nbsp;</span>
            { !module.is_locked && auth0Client.hasPermission('update:modules') &&
                (
                    deleting ?
                        <Tooltip title="Deleting Module">
                            <Button type="danger" shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                        </Tooltip>
                      :
                        <Tooltip title="Delete Module">
                            <Popconfirm disabled={buttonsDisabled} title="Confirming Delete?" placement="left" onConfirm={dele} okText="Confirm" cancelText="Cancel">
                                <Button disabled={buttonsDisabled}  type="danger" shape="circle" size="small" icon={ <DeleteFilled />} />
                            </Popconfirm>
                        </Tooltip>
                )
            }
            { auth0Client.hasPermission('update:agents') &&
               (
                   settingNoiseFlag ?
                         <Tooltip title={module.is_noise ? "Setting as Training Noise" : "Setting as not Training Noise"}>
                            <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                         </Tooltip>
                      :
                         <Tooltip title={module.is_noise ? "Set as not Training Noise" : "Set as Training Noise"}>
                             <Button disabled={buttonsDisabled} shape="circle" size="small" onClick={setNoiseFlag} icon={module.is_noise ? <MenuFoldOutlined /> : <MenuUnfoldOutlined /> } />
                         </Tooltip>
                )
            }
            { auth0Client.hasPermission('read:modules') &&
               (
                   downloading ?
                         <Tooltip title="Fetching">
                            <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                         </Tooltip>
                      :
                         <Tooltip title="Download">
                            <Button disabled={buttonsDisabled} shape="circle" size="small" onClick={download} icon={ <CloudDownloadOutlined /> } />
                         </Tooltip>
                )
            }
            { auth0Client.hasPermission('read:modules') &&
                <Link to={'/module/' + module.uuid}>
                    <Tooltip title="View">
                         <Button disabled={buttonsDisabled} shape="circle" size="small" icon={<EyeFilled />} />
                    </Tooltip>
                </Link>
            }
            </Space>
        </div>
      </div>
    );
}


