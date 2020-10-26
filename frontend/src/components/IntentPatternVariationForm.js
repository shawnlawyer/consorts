import React, { useState, useEffect } from 'react';
import { saveIntentPattern, deleteIntentPattern, getIntentPatternVariations } from '../actions/modules';
import { useStore } from '../Hooks';
import Loads from './Loads';
import { Space, Button, Popconfirm, Select  } from 'antd';
import { SaveFilled, PlusOutlined, DeleteFilled, LoadingOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Option } = Select;

export default function IntentPatternVariationForm(props){

    const [, dispatch] = useStore();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const { uuid, intent_uuid, reset } = props;
    const [modified, setModified] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [text, setText] = useState('');
    const [variations, setVariations] = useState([])

    useEffect(() => {
        if(!loaded){
            const callbacks = {
                success: (response) => { setVariations(response.data)},
                error: () => { setVariations([]) },
                final: () => { setLoaded(true) },
            }
            setLoaded(false);
            dispatch(getIntentPatternVariations(uuid, callbacks));
        }
    },[uuid]);

    const handleChange = (id, key) => {
        let nextVariations = [...variations];
        let nextText = '';
        nextVariations[key][0] = variations[key][1][id];
        setVariations(nextVariations);
        nextVariations.map(variation => {
            nextText += ` ${variation[0]}`
        });
        setText(nextText);
        setModified(true);
    }

    const save = (event) => {
        const callbacks = {
            success: () => {;
                reset()
            },
            error: () => {;
                setButtonsDisabled(false);
                setSaving(false);
            },
            final : () => {
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
        dispatch(saveIntentPattern({intent_uuid: intent_uuid, text: text}, callbacks));
    }

    return (
            <form className="grid no-margin-padding-border" onSubmit={save}>
            <Loads loaded={loaded} size="small">
                <Space size="small">
                    <DownloadOutlined rotate="180" style={{marginRight:'.35em'}}/>
                    {variations.map((word, key) =>
                        word[1].length == 0
                        ? (
                            <div>{word[0]}</div>
                        ) : (
                            <Select
                                bordered={false}
                                //showArrow={false}
                                onChange={(id) => {handleChange(id, key)}}
                                value={word[0]}
                                placeholder={word[0]}
                                name={`name_${key}`}
                                size="small"
                                dropdownMatchSelectWidth={false}
                                >
                                {word[1].map((_word, id) => (
                                <Option value={id}>{_word}</Option>
                                ))}
                            </Select>
                        )
                    )}
                </Space>
                <div className="options">
                    <Space size="small">
                        <span>&nbsp;</span>
                        { modified &&
                            (saving ?
                                <Button type="primary" shape="circle" size="small" icon={ <LoadingOutlined spin /> } />
                              :
                                <Button disabled={buttonsDisabled} htmlType="submit" type="primary" shape="circle" size="small" icon={ <PlusOutlined /> } />
                            )
                        }
                        <Button type="danger" shape="circle" size="small" onClick={reset} icon={ <CloseOutlined />} />
                    </Space>
                </div>
        </Loads>
            </form>
    );
}
