import React, { useState } from 'react';
import TextExpander from './TextExpander';
import { Layout, Button, Drawer } from 'antd';
import { NodeExpandOutlined } from '@ant-design/icons';

const { Sider } = Layout;

export default function BottomDrawerTextExpander(props) {
    const [collapsed, setCollapsed] = useState(false);

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
            setCollapsed(collapsed);
         }}
         >
            <div className="component terraced" style={{minHeight:'1.4em'}}>
                <TextExpander />
            </div>
        </Sider>
    );

}



