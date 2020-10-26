import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { useStore } from '../Hooks'
import { storeAgents } from '../actions/agents'
import Page from './Page';
import Module from './Module';
import ModuleForm from './ModuleForm';
import ModuleJSONForm from './ModuleJSONForm';
import auth0Client from '../Auth';
import { Layout, Menu, Spin, Space, Upload, message, Button, Tooltip } from 'antd';
import { AppstoreOutlined, LoadingOutlined, CloudUploadOutlined, PlusOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Content} = Layout;

export default function ModuleForms(props) {
    const [codeVisible, setCodeVisible] = useState(false);
    const [, dispatch] = useStore()

    const upload_props = {
      multiple: true,
      showUploadList: false,
      name: 'file',
      action: `/api/agents/${props.agent.uuid}/modules/upload`,
      ...auth0Client.apiAuthHeaders(),
      onChange(info) {
         console.log(info)
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
            <Content style={{background:'#fff'}}>
                { auth0Client.hasPermission('create:modules') &&
                    <Space align="center" theme="light" style={{ padding: 0, border:0, minHeight:'1.4em' }} >
                        <span style={{marginLeft:'1em'}}><AppstoreOutlined /> Create </span>
                        { codeVisible ?
                            <Tooltip title="Add with Name">
                                <Button onClick={() => setCodeVisible(false)}>Name</Button>
                            </Tooltip>
                            :
                            <Tooltip title="Add with Template">
                                <Button onClick={() => setCodeVisible(true)}>{"{JSON}"}</Button>
                            </Tooltip>
                        }
                        <Upload {...upload_props}>
                            <Button>Upload<CloudUploadOutlined   /></Button>
                        </Upload>
                    </Space>
                }
                { !codeVisible ?
                <Layout style={{background:'#fff', margin:'.5em 0 0 0'}}>
                   <div className="list">
                        { auth0Client.hasPermission('create:modules') &&
                            <ModuleForm {...props} />
                        }
                    </div>
                </Layout>
                :
                <div className="list" style={{margin:'.5em 0 0 0'}}>
                <div className="component terraced" style={{padding:0}}>
                    <Layout style={{background:'#fff'}}>
                        <ModuleJSONForm {...props} />
                    </Layout>
                </div>
                </div>
                }
            </Content>
    );
}
