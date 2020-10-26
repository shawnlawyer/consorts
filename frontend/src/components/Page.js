import React, { Component } from 'react';
import LeftMenu from './LeftMenu';
import RightFloatingChat from './RightFloatingChat';
import { Layout } from 'antd';
const { Content, Footer } = Layout;

export default function Page(props) {
  return (
    <Layout style={{ background:'#fff' }}>
        { props.header ?
            <div>
            {props.header}
            </div>
        : null }
        <Content className="site-layout" style={{ paddingTop: '.5em', marginTop: props.header ? '3em' : '0', background:'#fff'}}>
            {props.children}
        </Content>
        { props.footer ?
            <Footer style={{ background:'#fff'}}>
                {props.footer}
            </Footer>
        : null }
    </Layout>
  );
}
