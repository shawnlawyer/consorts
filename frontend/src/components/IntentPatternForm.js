import React, { useState } from 'react';
import { useStore } from '../Hooks';
import { saveIntentPattern, deleteIntentPattern } from '../actions/modules';
import IntentPatternVariationForm from './IntentPatternVariationForm';
import { Space, Button, Popconfirm } from 'antd';
import { SaveFilled, PlusOutlined, DeleteFilled, LoadingOutlined, CloseOutlined, NodeExpandOutlined, DownloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default function IntentPatternForm(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const {uuid, intent_uuid} = props
    const [text, setText] = useState(props.text || "")
    const [modified, setModified] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false);
    const [viewExpandable, setViewExpandable] = useState(false);

    const handleChange = (event) => {
        setText(event.target.value);
        setModified((event.target.value !== props.text && event.target.value !== "") ? true : false);
    }

    const reset = () => {
        setButtonsDisabled(false);
        setText(props.text || "");
        setModified(false);
        setSaving(false);
        setViewExpandable(false);
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
            dispatch(saveIntentPattern({uuid: uuid, text: text}, callbacks));
        }else{
            dispatch(saveIntentPattern({intent_uuid: intent_uuid, text: text}, callbacks));
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
          dispatch(deleteIntentPattern(uuid));
        }, 0);
    }

    return (
            <div className="component terraced">
            { !viewExpandable ?
                <form className="grid no-margin-padding-border" onSubmit={save}>
                    <div className="component">
                        <Space size="small">
                            <DownloadOutlined rotate="180"/>
                        </Space>
                        <input type="text" name="text" onChange={handleChange} value={text} placeholder={uuid ? "Pattern" : "New Pattern"} />
                        <div className="options">
                            <Space size="small">
                                <span>&nbsp;</span>
                                { uuid &&
                                        <Button disabled={buttonsDisabled} shape="circle" size="small" icon={ <NodeExpandOutlined /> }  onClick={setViewExpandable}/>
                                }
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
            :
                <IntentPatternVariationForm uuid={uuid} intent_uuid={intent_uuid} reset={reset} />
            }
            </div>
    );
}
