import React from 'react';
import { Space, Empty } from 'antd';

export default function ListOrEmpty(props){
    const items = props.items || 0
    const description = props.description || null

    return items.length > 0
        ?
        <Space direction="vertical" style={{width:'100%'}}>{props.children}</Space>
        :
        <div className="terraced" style={{padding:'.5em'}}><Empty description={<div><b>{description}</b></div>} /></div> ;
}
