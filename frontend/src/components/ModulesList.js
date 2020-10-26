import React from 'react';
import Module from './Module';

import { Space } from 'antd';

export default function ModulesList(props) {
    const { modules } = props;
    return (

        <Space direction="vertical" style={{width:'100%'}}>
        { Object.values(modules).map((module, ind) => (
            <Module key={module.id} module={module}/>
        ))}
        </Space>
    );
}
