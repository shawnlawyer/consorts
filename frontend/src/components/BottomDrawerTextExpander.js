import React, { useState, useEffect } from 'react';
import { useStore } from '../Hooks';
import { getTextVariations } from '../actions/lexicon';
import { Layout, Button, Drawer, Space, Select, Grid, Divider } from 'antd';
import { NodeExpandOutlined, LoadingOutlined, CloseOutlined, CommentOutlined } from '@ant-design/icons';


const { Option } = Select;
const { Sider } = Layout;

export default function BottomDrawerTextExpander(props) {
    const [, dispatch] = useStore();
    const [collapsed, setCollapsed] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [text, setText] = useState('');
    const [modified, setModified] = useState(false);
    const [variations, setVariations] = useState([]);
    const [autoSubmit, setAutoSubmit] = useState(false);

    const expand = (event=null) => {
        if(event){
            event.preventDefault()
        }
        const callbacks = {
            success: (response) => { setVariations(response.data.results)},
            error: () => { setVariations([]) },
            final: () => { setLoaded(true) },
        }
        setLoaded(false);
        dispatch(getTextVariations(text, callbacks));
    };

    const textChange = (event) => {
        let nextText = event.target.value
        nextText = nextText.replace('’', '\'').replace('’', '\'').replace(' ?', '?').replace(' .', '.').replace(' !', '!').replace(' ,', ',').replace(' \'', '\'').replace(' "', '"')
        setText(nextText);
        setModified((nextText !== props.text && nextText !== "") ? true : false);
    }

    useEffect(() => {
        if(modified){
            if(modified){clearTimeout(autoSubmit)}
            setAutoSubmit(setTimeout(expand, 300))
        }
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

    const collapse = () => {
        setCollapsed(true);
    };

    const show = () => {
        setCollapsed(false);
    };

    const reset = () => {
        setText('');
        setModified(false);
        setVariations([]);
    };

    return (
        <Sider
         collapsed={collapsed}
         defaultCollapsed={true}
         zeroWidthTriggerStyle={{position:'fixed', right: '4.5em', background:'none', top:'-.1em'}}
         breakpoint="xxl"
         width="98vw"
         collapsedWidth={0}
         theme="light"
         trigger={<Button size="small" shape="circle" icon={<NodeExpandOutlined />} type="primary" style={{}} />}
         style={{ zIndex:'1000', position: 'fixed', bottom:'1vh', right: collapsed ? 0 : '1vw'}}
         onCollapse={(collapsed, type) => {
            setText('');
            setCollapsed(collapsed);
         }}
         >
            <div className="component terraced" style={{minHeight:'1.4em'}}>
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
                <form className="grid no-margin-padding-border" onSubmit={expand}>
                    <div className="component">
                        <textarea rows={text.split(/\r*\n/).length} name="text" onChange={textChange} value={text} placeholder={"Text"}/>
                        <div className="options">
                            <Space size="small">
                                <span>&nbsp;</span>
                                { modified &&
                                    <Button htmlType="submit" type="primary" shape="circle" size="small" icon={ <NodeExpandOutlined /> }  onClick={expand}/>
                                }
                                { modified &&
                                    <Button type="danger" shape="circle" size="small" onClick={reset} icon={ <CloseOutlined />} />
                                }
                            </Space>
                        </div>
                    </div>
                </form>
            </Space>
        </div>
        </Sider>
    );

}



