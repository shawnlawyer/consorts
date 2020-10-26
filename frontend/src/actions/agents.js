import React from 'react'
import push from '../Pusher';
import { message } from 'antd';
import { xhr } from '../XHR'
import { CommentOutlined, LoadingOutlined, ShareAltOutlined } from '@ant-design/icons';

export const AGENT_TYPES = {
    1: {
        name:["Classifier", "Classifiers"],
        code: JSON.stringify({
            "name": "example",
            "intents": [
                {
                    "name": "greeting",
                    "patterns": [
                        {
                          "text": "Hello"
                        }
                    ]
                }
            ]
        }, null, 2)
    },
    2: {name:["Chat Bot", "Chat Bots"],
        code: JSON.stringify({
            "name": "example",
            "intents": [
                {
                    "name": "greeting",
                    "patterns": [
                        {
                          "text": "Hello"
                        }
                    ],
                    "responses": [
                        {
                          "text": "Hello World"
                        }
                    ]
                }
            ]
        }, null, 2)}
}

export function loadingAgents(){
  return {
    type: 'LOADING_AGENTS',
    payload: null
  }
};

export function storeAgents(results){
  let payload = {};
  results.map((result) => { payload[result.uuid] = result})
  return {
    type: 'STORE_AGENTS',
    payload: payload
  }
};

export function storeAgent(response){
  return {
    type: 'STORE_AGENT',
    payload: {[response.data.result.uuid]:response.data.result}
  }
};

export function clearAgent(uuid){
  return {
    type: 'CLEAR_AGENT',
    payload: uuid
  }
};

export function loadAgents(callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents`;
        const type = 'get';
        dispatch(loadingAgents);
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            success : (response) => {
                dispatch(storeAgents(response.data.results))
                //dispatch(bindAgentPushListeners())
            },
            successCallback: success,
            error: err => {
                console.log(err)
                dispatch(storeAgents([]));
            },
            errorCallback: error,
            finalCallback: final,
        }));
    }
};

export function loadAgent(uuid, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/${uuid}`;
        const type = 'get';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            success : (response) => {
                dispatch(storeAgents([response.data.result]))
                dispatch(bindAgentPushListeners())
            },
            successCallback: success,
            error: err => {
                dispatch(storeAgents([]));
            },
            errorCallback: error,
            finalCallback: final,
        }));
    }
};

export function saveAgent(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const { uuid } = data;
        const type = uuid ? 'patch' : 'post';
        const endpoint = uuid ? `/agents/${uuid}` : `/agents`;
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {data},
            success : (response) => {
                dispatch(loadAgents({final: final}))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function copyAgent(uuid, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const type = 'post';
        const endpoint = `/agents/${uuid}/copy`;
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {},
            success : (response) => {
                dispatch(storeAgents([response.data.result]))
            },
            successCallback: success,
            errorCallback: error,
            finalCallback:final
        }));
    }
};

export function deleteAgent(uuid, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/${uuid}`;
        const type = 'delete';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            success : (response) => {
                dispatch(clearAgent(uuid))
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function postAgentModule(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/${data.uuid}/modules`;
        const type = 'post';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            data: {data},
            success : (response) => {
                dispatch(loadAgents({final: final}))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function deleteAgentModule(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/modules/${data.uuid}`;
        const type = 'delete';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            success : (response) => {
                dispatch(loadAgents({final: final}))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function setAgentTemplateFlag(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/${data.uuid}/template/${data.flag}`;
        const type = 'patch';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            data: {},
            success : (response) => {
                dispatch(storeAgents([response.data.result]))
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function setAgentLockedFlag(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/${data.uuid}/locked/${data.flag}`;
        const type = 'patch';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            data: {},
            success : (response) => {
                dispatch(storeAgents([response.data.result]))
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function setAgentMainFlag(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/agents/${data.uuid}/main/${data.flag}`;
        const type = 'patch';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            data: {},
            success : (response) => {
                dispatch(storeAgents(response.data.results))
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function buildAgent(uuid, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'post';
        const endpoint = `/agents/${uuid}/build`;
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {},
            success : (response) => {
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function bindAgentPushListeners(agents){
  return function(dispatch, getState){
    Object.values(agents).map((agent) => {
        push.bindAction(agent.uuid, 'start', (data) => {dispatch(buildStartMessage(data))})
        push.bindAction(agent.uuid, 'complete', (data) => {dispatch(buildCompleteMessage(data))})
        push.bindAction(agent.uuid, 'error', (data) => {dispatch(buildErrorMessage(data))})
        push.bindAction(agent.uuid, 'reload', (data) => {dispatch(loadAgent(data.uuid))})
        push.bindAction(agent.uuid, 'store', (data) => {dispatch(storeAgents(data.results))})
        push.bindAction(agent.uuid, 'clear', (data) => {dispatch(clearAgent(data.uuid))})
    })
  }
}

export function buildStartMessage(data){
  return function(dispatch, getState){
    message.success(`Agent ${data.name} build started.`);
    dispatch(storeAgents([data]))
  }
};

export function buildCompleteMessage(data){
  return function(dispatch, getState){
     message.success(`Agent ${data.name} build complete.`);
     dispatch(storeAgents([data]))
  }
};

export function buildErrorMessage(data){
  return function(dispatch, getState){
     message.error(`There was an error building agent ${data.name}.`);
     dispatch(storeAgents([data]))
  }
};
