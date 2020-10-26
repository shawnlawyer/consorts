const initialState = {
  id:null,
  name:"",
  description:"",
  modules:[],
  selected_module_id:null
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case 'UPDATE_AGENT':
      return { ...state, ...action.payload }
    case 'STORE_AGENT':
      return { ...state, ...action.payload }
    default:
      return {
        ...state
      }
  }
}
