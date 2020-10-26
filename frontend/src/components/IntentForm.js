import React, { useState } from 'react';
import { saveIntent } from '../actions/modules';
import { useStore } from '../Hooks';
import { Space, Button, Spin } from 'antd';
import { SaveFilled, PlusOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default function IntentForm(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const {uuid, module_uuid} = props;
    const [name, setName] = useState(props.name || "");
    const [modified, setModified] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (event) => {
        let nextName = event.target.value;
        nextName = nextName.replace(/[&\^@`!=;|\[\]/\\#,+()$~%.'":*?<>{}]/g,'');
        nextName = nextName.replace(/[\-\s]/g,'_');
        setName(nextName);
        setModified((nextName !== props.name && nextName !== "") ? true : false);
    }

    const reset = () => {
        setButtonsDisabled(false);
        setName(props.name || "");
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
        if(!modified){
            return;
        }
        setButtonsDisabled(true);
        setSaving(true);
        if(uuid){
            dispatch(saveIntent({uuid: uuid, name: name}, callbacks));
        }else{
            dispatch(saveIntent({module_uuid: module_uuid, name: name}, callbacks));
        }
    }

    return (
        <div className="component terraced">
            <form className="grid no-margin-padding-border" onSubmit={save}>
                <div className="component">
                    <input type="text" name="name" onChange={handleChange} value={name} placeholder={uuid ? "Intent Name" : "New Intent Name"} />
                    <div className="options">
                        <Space size="small" style={{height: '1em'}} align="center">
                        { modified &&
                            (!saving ?
                                <Button htmlType="submit" type="primary" shape="circle" size="small" icon={uuid ? <SaveFilled /> : <PlusOutlined />} />
                            :
                                <Button type="primary" shape="circle" size="small" icon={<LoadingOutlined spin />} />
                            )
                        }
                        { modified &&
                            <Button disabled={buttonsDisabled}  type="danger" shape="circle" size="small" onClick={reset} icon={<CloseOutlined />} />
                        }
                        </Space>
                    </div>
                </div>
            </form>
        </div>
    );
}
