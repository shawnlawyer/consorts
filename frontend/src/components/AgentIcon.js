import React from 'react';
import { CommentOutlined, ShareAltOutlined } from '@ant-design/icons';

export default function AgentIcon(props) {
    const {type} = props;
    switch(type){
        case 1:
           return ( <ShareAltOutlined rotate={270}/> );
        case 2:
           return ( <CommentOutlined /> );
        default:
           return null;
    }
}
