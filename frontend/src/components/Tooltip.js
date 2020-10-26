import React, {useState} from 'react';
import { useStore } from '../Hooks'
import {Link} from 'react-router-dom';
import { Tooltip as AntdTooltip } from 'antd';

export default function Tooltip(props) {

    const { title } = props;

    return (
        <AntdTooltip mouseLeaveDelay={0}  title={props.title}>
            {props.children}
        </AntdTooltip>
    );
}
