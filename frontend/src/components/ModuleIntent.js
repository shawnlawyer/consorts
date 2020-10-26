import React, { useState } from 'react';
import { useStore } from '../Hooks'
import { deleteIntent } from '../actions/modules';
import IntentPatternsList from './IntentPatternsList';
import IntentResponsesList from './IntentResponsesList';
import IntentForm from './IntentForm';
import auth0Client from '../Auth';
import { Layout, Menu, Space, Button, Popconfirm, Divider} from 'antd';
import {
    CommentOutlined,
    HomeOutlined,
    AppstoreOutlined,
    SettingOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    DeleteFilled,
    CaretUpFilled,
    CaretDownFilled,
    LockFilled,
    UnlockFilled,
    LoadingOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';


export default function ModuleIntent(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const {agent_type, intent, is_locked} = props;
    const [listVisibility, setListVisibility] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const dele = () => {
        const callback = () => {setDeleting(false)};
        setDeleting(true);
        setTimeout(() => {
          dispatch(deleteIntent(intent.uuid));
        }, 0);
    }

    return (
        <div className="component terraced">
            <div className="list no-margin-padding-border">
                <div className="component">
                    <div onClick={() => setListVisibility(!listVisibility)}>
                        {intent.name}
                    </div>
                    <div className="options">
                        <Space size="small">
                             { !is_locked && auth0Client.hasPermission('delete:agents') &&
                                (
                                    ! deleting ?
                                        <Popconfirm disabled={buttonsDisabled} title="Confirming Delete?" placement="left" onConfirm={dele} okText="Confirm" cancelText="Cancel">
                                            <Button type="danger" shape="circle" size="small" icon={ <DeleteFilled />} />
                                        </Popconfirm>
                                    :
                                        <Button type="danger" shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                )
                             }
                             <Button size="small" onClick={() => setListVisibility(!listVisibility)} icon={ listVisibility ? <CaretUpFilled /> :  <CaretDownFilled />} />
                        </Space>
                    </div>
                </div>
                { listVisibility &&
                <Space direction="vertical">
                {  !is_locked &&
                    <Space direction="vertical" style={{width:'100%', padding:'.5em 0'}}>
                        <b>Label</b>
                        <IntentForm is_locked={is_locked} uuid={intent.uuid} name={intent.name} />
                    </Space>
                }
                <IntentPatternsList is_locked={is_locked} patterns={intent.patterns} intent_uuid={intent.uuid} />
                {  agent_type === 2 &&
                    <IntentResponsesList is_locked={is_locked} responses={intent.responses} intent_uuid={intent.uuid} />
                }
                </Space>
                }
            </div>
        </div>
    );

}
