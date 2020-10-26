import React, { Component } from 'react';
import auth0Client from '../Auth';
import Page from './Page';
import ContextHead from './ContextHead';
import Chat from './Chat';

export default function HomePage() {
    return (<Page
            header={<ContextHead title="Consorts" />}
            footer={<div className="footer">Consorts By Shawn Lawyer 331 Wilson Ave, Swannanoa NC 28778</div>} />

    );
}
