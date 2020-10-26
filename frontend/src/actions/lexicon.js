import axios from 'axios';
import { notification } from 'antd';
import { xhr } from '../XHR'

import { handleCallbacks } from '../Callbacks'
import auth0Client from '../Auth';

export function getTextVariations(text, callbacks={}){
    return function(dispatch, getState){
        const { success, error, final } = callbacks;
        const type = 'post';
        const endpoint = `/lexicon/variations`;

        dispatch(xhr({
            type: type,
            endpoint: endpoint,
            data:{text:text},
            success : (response) => {
                success(response)
            },
            errorCallback: error,
            finalCallback: final,
        }));
    }
};


