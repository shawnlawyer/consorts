import React, { useState } from 'react';
import { saveIntentResponse, deleteIntentResponse } from '../actions/modules';
import { useStore } from '../Hooks';
import { Space, Button, Popconfirm } from 'antd';
import { SaveFilled, PlusOutlined, DeleteFilled, LoadingOutlined, CloseOutlined, UploadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default function IntentResponseForm(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const {uuid, intent_uuid} = props
    const [text, setText] = useState(props.text || "")
    const [modified, setModified] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false);

    const handleChange = (event) => {
        setText(event.target.value);
        setModified((event.target.value !== props.text && event.target.value !== "") ? true : false);
    }

    const reset = () => {
        setButtonsDisabled(false);
        setText(props.text || "");
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
            dispatch(saveIntentResponse({uuid: uuid, text: text}, callbacks));
        }else{
            dispatch(saveIntentResponse({intent_uuid: intent_uuid, text: text}, callbacks));
        }
    }

    const dele = () => {
        const callbacks = {
            error: () => {;
                setButtonsDisabled(false);
                setDeleting(false);
            }
        };
        setButtonsDisabled(true);
        setDeleting(true);
        setTimeout(() => {
          dispatch(deleteIntentResponse(uuid));
        }, 0);
    }

    return (
        <div className="component terraced">
            <form className="grid no-margin-padding-border" onSubmit={save}>
                <div className="component">
                    <Space size="small" style={{maxHeight:'1.4em'}}>
                        <UploadOutlined rotate="180"/>
                    </Space>
                    <textarea rows={text.split(/\r*\n/).length} name="text" onChange={handleChange} value={text} placeholder={uuid ? "Response" : "New Response"} />
                    <div className="options">
                        <Space size="small">
                            <span>&nbsp;</span>
                            { modified &&
                                (saving ?
                                    <Button type="primary" shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                  :
                                    <Button disabled={buttonsDisabled} htmlType="submit" type="primary" shape="circle" size="small" icon={ uuid ? <SaveFilled /> : <PlusOutlined /> } />

                                )
                            }
                            { modified ?
                                <Button type="danger" shape="circle" size="small" onClick={reset} icon={ <CloseOutlined />} />
                              :
                                (uuid) &&
                                (
                                    deleting  ?
                                        <Button shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                                      :
                                        <Popconfirm disabled={buttonsDisabled} title="Confirming Delete?" placement="left" onConfirm={dele} okText="Confirm" cancelText="Cancel">
                                            <Button disabled={buttonsDisabled}  type="danger" shape="circle" size="small" icon={ <DeleteFilled />} />
                                        </Popconfirm>
                                )
                            }
                        </Space>
                    </div>
                </div>
            </form>
        </div>
    );
}

