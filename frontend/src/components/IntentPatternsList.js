import React from 'react';
import IntentPatternForm from './IntentPatternForm';
import ListOrEmpty from './ListOrEmpty';
import { Space,     Divider } from 'antd';

export default function IntentPatternsList(props){
    const { intent_uuid, patterns, is_locked } = props;
    return (
            <Space direction="vertical" style={{width:'100%', padding:'.5em 0'}}>
                <div className="head">
                     <Divider plain><b>Patterns</b></Divider>
                </div>
                {!is_locked &&
                <IntentPatternForm intent_uuid={intent_uuid} />
                }
                <ListOrEmpty
                    items={patterns}
                    description={`Patterns Empty`}>
                    {patterns.map((pattern, index) => (
                        !is_locked ?
                            <IntentPatternForm  key={pattern.id} uuid={pattern.uuid} intent_uuid={intent_uuid} text={pattern.text}/>
                          :
                            <div className="component terraced">
                                {pattern.text}
                            </div>

                    ))}
                </ListOrEmpty>
            </Space>
    );
}
