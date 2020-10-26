import axios from 'axios';
import auth0Client from './Auth';

const API_URL = window.location.origin + '/api'

axios.defaults.baseURL = API_URL

export function xhr(props){
    const {endpoint, type, data, success, error, final, successCallback, errorCallback, finalCallback } = props;

    return function(dispatch){
        let request = false;
        let args = false;
        switch(type){
            case 'get':
                request = axios.get;
                args = [endpoint, auth0Client.apiAuthHeaders()];
                break;
            case 'post':
                request = axios.post;
                args = [endpoint, data, auth0Client.apiAuthHeaders()];
                break;
            case 'patch':
                request = axios.patch;
                args = [endpoint, data, auth0Client.apiAuthHeaders()];
                break;
            case 'delete':
                request = axios.delete;
                args = [endpoint, auth0Client.apiAuthHeaders()];
                break;
            default:
                console.log('error, no type defined on xhr call')
                return;
        }

        request(...args)
        .then((response) => {
            if(typeof(success) === 'function'){
                success(response)
            }
            if(typeof(successCallback) === 'function'){
                successCallback()
            }
        }).catch((err) => {
            if(typeof(error) === 'function'){
                error(err)
            }
            if(typeof(errorCallback) === 'function'){
                errorCallback()
            }
        }).finally(() => {
            if(typeof(final) === 'function'){
                final()
            }
            if(typeof(finalCallback) === 'function'){
                finalCallback()
            }
        })
    }
};
