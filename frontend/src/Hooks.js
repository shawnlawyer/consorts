import React, {useContext, useState, useEffect} from 'react';
import {ReactReduxContext} from 'react-redux';

export function useStore() {
  const { store } = useContext(ReactReduxContext);
  const { getState, dispatch, subscribe } = store;

  const [ storeState, setStoreState ] = useState(getState());

  useEffect(() => subscribe(() => {
    setStoreState(getState());
  }, []));

  return [storeState, dispatch];
}

export function useSelectors(...selectors) {
  const [state] = useStore();
  return selectors.map(selector => selector(state));
}

export function useDispatch(...creators) {
  const [, dispatch] = useStore();
  return creators.map(creator => (...param) => dispatch(creator(...param)))
}
