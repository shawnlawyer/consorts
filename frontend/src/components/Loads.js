import React from 'react';
import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Content} = Layout;
export default function Loads(props){
    const size = props.size || 'large'

    const className = `loading-${size}`;
    return props.loaded ? props.children : (
        <div className="head">
            <div className={className}>
                <LoadingOutlined spin />
            </div>
        </div>
    );
}
