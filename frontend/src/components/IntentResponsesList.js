import React from 'react';
import { Layout, Space, Divider } from 'antd';
import IntentResponseForm from './IntentResponseForm';
import ListOrEmpty from './ListOrEmpty';
const { Content } = Layout;

export default function IntentResponsesList(props){
    const { intent_uuid, responses, is_locked } = props;
    return (
            <Space direction="vertical" style={{width:'100%', padding:'.5em 0'}}>

                <div className="head">
                     <Divider plain><b>Responses</b></Divider>
                </div>
                {!is_locked &&
                <IntentResponseForm intent_uuid={intent_uuid} />
                }
                <ListOrEmpty
                    items={responses}
                    description={`Responses Empty`}>
                    {responses.map((response, index) => (
                        !is_locked ?
                            <IntentResponseForm key={response.uuid} uuid={response.uuid} text={response.text}/>
                          :
                            <div key={response.uuid} className="component">
                                <Content>
                                {response.text.split('\n').map((item, key) => {
                                    return <span key={key}>{item}<br/></span>
                                })}
                                </Content>
                            </div>
                    ))}
                </ListOrEmpty>
            </Space>
    );
}
