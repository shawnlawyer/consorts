import axios from 'axios';
import { notification } from 'antd';
import { xhr } from '../XHR'

import { handleCallbacks } from '../Callbacks'
import auth0Client from '../Auth';
import { loadAgents, loadAgent } from './agents';

export function loadingModules(){
  return {
    type: 'LOADING_MODULES',
    payload: null
  }
};

export function storeModules(response){
  const results = {}
  response.data.results.map((result) => {results[result.uuid]=result})
  return {
    type: 'STORE_MODULES',
    payload: results
  }
};

export function storeModule(response){
  return {
    type: 'STORE_MODULE',
    payload: response.data.result
  }
};

export function clearModule(){
  return {
    type: 'CLEAR_MODULE',
    payload: null
  }
};

export function loadModules(callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const type = 'get';
        const endpoint = `/modules`;
        dispatch(loadingModules);
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                dispatch(storeModules(response))
            },
            successCallback: success,
            error: err => {
                dispatch(storeModules({data:{results:[]}}));
            },
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function loadModule(uuid, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const type = 'get';
        const endpoint = `/modules/${uuid}`;
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                dispatch(storeModule(response))
            },
            successCallback: success,
            error: err => {
                dispatch(storeModule({data:{results:[]}}));
            },
            errorCallback: error,
            finalCallback: final
        }));
    }
};

function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
};

/*
function download(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
};

modules = data.data.map((module) => {
    let intents = [];
    module.paragraphs.map((paragraph) => {
        paragraph.qas.map((intent) => {
          let result = {name: intent.id};
          result['patterns'] = intent.patterns.map((pattern) => { return {text: pattern.text} });
          result['responses'] = intent.responses.map((response) => { return {text: response.text} });
          intents.push(result);
        })
    })
    download(JSON.stringify({
        name: module.title,
        intents: intents
    }, null, 2), `${module.title}.json`, "text/plain")
});

*/
export function moduleJSON(module){
    const {name, intents, type} = module;

    const data = {
        name: name,
        intents: intents.map((intent) => {
            let result = {name: intent.name};
            if (typeof(intent.patterns) === 'object' && intent.patterns.length){
                result['patterns'] = intent.patterns.map((pattern) => { return {text: pattern.text} });
            }
            switch(type){
                case 1:
                    break;
                case 2:
                default:
                    if (typeof(intent.responses) === 'object' && intent.responses.length){
                        result['responses'] = intent.responses.map((response) => { return {text: response.text} });
                    }

                    break;

            }
            return result;
        })
    };
    return JSON.stringify(data, null, 2)
}

export function downloadModule(uuid, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const type = 'get';
        const endpoint = `/modules/${uuid}`;
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                download(moduleJSON(response.data.result), `${response.data.result.name.replace(' ','_')}.json`, "text/plain");
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function saveModule(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const { uuid } = data;
        const type = uuid ? 'patch' : 'post';
        const endpoint = uuid ? `/modules/${uuid}` : `/modules`;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {data},
            success : (response) => {
                dispatch(storeModule(response))
                dispatch(loadModules({final: final}))
                dispatch(loadAgent(data.agent_uuid))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function saveIntent(data, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const { uuid } = data;
        const type = uuid ? 'patch' : 'post';
        const endpoint = uuid ? `/intents/${uuid}` : `/intents`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {data},
            success : (response) => {
                dispatch(loadModule(module.uuid, callbacks))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function saveIntentPattern(data, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const { uuid } = data;
        const type = uuid ? 'patch' : 'post';
        const endpoint = uuid ? `/intent/patterns/${uuid}` : `/intent/patterns`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {data},
            success : (response) => {
                dispatch(loadModule(module.uuid, callbacks))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function saveIntentResponse(data, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const { uuid } = data;
        const type = uuid ? 'patch' : 'post';
        const endpoint = uuid ? `/intent/responses/${uuid}` : `/intent/responses`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data: {data},
            success : (response) => {
                dispatch(loadModule(module.uuid, callbacks))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function deleteModule(uuid, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'delete';
        const endpoint = `/modules/${uuid}`;
        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                dispatch(loadModules({final:final}))
            },
            successCallback: success,
            errorCallback: error
        }));

    }
};

export function deleteIntent(uuid, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'delete';
        const endpoint = `/intents/${uuid}`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                dispatch(loadModule(module.uuid, {final:final}))
            },
            successCallback: success,
            errorCallback: error
        }));

    }
};

export function deleteIntentPattern(uuid, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'delete';
        const endpoint = `/intent/patterns/${uuid}`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                dispatch(loadModule(module.uuid, {final:final}))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function deleteIntentResponse(uuid, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'delete';
        const endpoint = `/intent/responses/${uuid}`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                dispatch(loadModule(module.uuid, {final:final}))
            },
            successCallback: success,
            errorCallback: error
        }));
    }
};

export function setModuleNoiseFlag(data, callbacks={}){
    return function(dispatch){
        const { success, error, final } = callbacks;
        const endpoint = `/modules/${data.uuid}/noise/${data.flag}`;
        const type = 'patch';
        dispatch(xhr({
            endpoint: endpoint,
            type: type,
            data: {},
            success : (response) => {
                //dispatch(loadModules({final:final}))
            },
            successCallback: success,
            errorCallback: error,
            finalCallback: final
        }));
    }
};

export function validateJSON(text, silent=false){
    try {
        JSON.parse(text);
    } catch (e) {
        if(!silent){
            validateJSONNotification()
        }
        return false;
    }
    return true;
};

export function validateJSONNotification(data){
    notification['error']({
        message: 'Error',
        description:
          `The template is not properly formatted JSON`,
    });
};


export function getIntentPatternVariations(uuid, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'get';
        const endpoint = `/intent/patterns/${uuid}/variations`;
        const module = getState().module;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            success : (response) => {
                success(response)
            },
            errorCallback: error,
            finalCallback: final,
        }));
    }
};


