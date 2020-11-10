import React, { useState, useEffect } from 'react';
import { useStore } from '../Hooks';
import { getTextVariations } from '../actions/lexicon';
import { Button, Space, Select } from 'antd';
import { NodeExpandOutlined, LoadingOutlined, CloseOutlined, CommentOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function TextExpander(props) {
    const [, dispatch] = useStore();
    const [collapsed, setCollapsed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [text, setText] = useState(props.text || '');
    const [modified, setModified] = useState(false);
    const [variations, setVariations] = useState([]);
    const [autoSubmit, setAutoSubmit] = useState(false);

    const expand = (event=null) => {
        if(event){
            event.preventDefault()
        }
        if (text == '' ) return;
        const callbacks = {
            success: (response) => { setVariations(response.data.results)},
            error: () => { setVariations([]) },
            final: () => { setLoaded(true) },
        }
        setLoaded(false);
        dispatch(getTextVariations(text, callbacks));
    };

    const save = (event=null) => {
        if(event){
            event.preventDefault();
        }
        if(props.save){
            props.save({...props.data, text: text});
        }
    };

    const textChange = (event) => {
        let nextText = event.target.value
        nextText = nextText.replace('’', '\'').replace('’', '\'').replace(' ?', '?').replace(' .', '.').replace(' !', '!').replace(' ,', ',').replace(' \'', '\'').replace(' "', '"')
        setText(nextText);
        setModified((nextText !== props.text && nextText !== "") ? true : false);
    }

    useEffect(() => {
        clearTimeout(autoSubmit)
        setAutoSubmit(setTimeout(expand, 300))
    },[text]);

    const variationChange = (id, key, line) => {
        let nextVariations = [...variations];
        nextVariations[line][key][0] = variations[line][key][1][id];
        setVariations(nextVariations);
        let nextLines = [];
        nextVariations.map((line, line_key) => {
            nextLines[line_key]=[]
            line.map(variation => {
                nextLines[line_key].push(variation[0])
            });
        });
        let nextText = nextLines.map((line, line_key) => {
            return line.join(' ').trim()

        }).join('\n');
        nextText = nextText.replace('’', '\'').replace('’', '\'').replace(' ?', '?').replace(' .', '.').replace(' !', '!').replace(' ,', ',').replace(' \'', '\'').replace(' "', '"')
        setText(nextText);
        setModified(true);
    }

    const reset = () => {
        if(props.reset){
            props.reset();
        }
        setText(props.text || '');
        setModified(false);
        setVariations([]);
    };

    return (
            <Space direction="vertical" style={{width:'100%'}}>
                { variations.length !== 0 &&
                <div className="head" style={{borderBottom:'1px solid #ccc'}}>
                    { variations.map((line, line_key) => (
                        <div style={{display:'flex', flexWrap:'wrap'}}>
                            { line.length !== 0 && line.map((word, word_key) => (
                                word[1].length == 0
                                    ? (
                                        <div style={{ padding:'1px 0 0 0', margin:'0 .25em 0 0'}}> {word[0]} </div>
                                    ) : (
                                        <Select
                                            bordered={false}
                                            showArrow={false}
                                            onChange={(id) => {variationChange(id, word_key, line_key)}}
                                            value={word[0]}
                                            placeholder={word[0]}
                                            name={`name_${word_key}_${line_key}`}
                                            size="small"
                                            dropdownMatchSelectWidth={false}
                                            style={{borderBottom:'3px green solid', padding:0, margin:'0 .25em 0 0'}}
                                            >
                                            {word[1].map((_word, id) => (
                                            <Option value={id}>{_word}</Option>
                                            ))}
                                        </Select>
                                    )
                            ))}
                            <br/>
                        </div>
                    ))}
                </div>
                }
                <form className="grid no-margin-padding-border" onSubmit={save}>
                    <div className="component">
                        <textarea rows={text.split(/\r*\n/).length} name="text" onChange={textChange} value={text} placeholder={"Text"}/>
                        <div className="options">
                            <Space size="small">
                                <span>&nbsp;</span>
                                { modified && props.save &&
                                    <Button type="primary" shape="circle" size="small" onClick={save}  icon={ <PlusOutlined /> }/>
                                }
                                { modified &&
                                    <Button type="danger" shape="circle" size="small" onClick={reset} icon={ <CloseOutlined />} />
                                }
                            </Space>
                        </div>
                    </div>
                </form>
            </Space>
    );

}



