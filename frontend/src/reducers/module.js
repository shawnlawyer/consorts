const initialState = {
  id:null,
  uuid:null,
  name:"",
  intents:[]
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case 'UPDATE_MODULE':
      return { ...state, ...action.payload }
    case 'STORE_MODULE':
      return { ...state, ...action.payload }
    case 'CLEAR_MODULE':
      return { ...initialState }
    default:
      return {
        ...state
      }
  }
}
