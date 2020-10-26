const initialState = {
  modules:[],
  loaded:false
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case 'STORE_MODULES':
      return {
        ...state,
        modules: action.payload,
        loaded:true
      }
    default:
      return {
        ...state
      }
  }
}
