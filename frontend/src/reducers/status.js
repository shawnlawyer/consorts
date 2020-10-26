const initialState = {
  agents:[]
}

export default function reducer(state = initialState, action) {

  switch (action.type) {
    case 'CREATED_AGENT':
      return {
        ...state,
        agents: [ ...state.agents, action.payload ]
      }
    case 'LOADED_AGENTS':
      return {
        ...state,
        agents: action.payload
      }

    case 'DELETED_AGENT':
      return {
        ...state,
        agents: state.agents.filter((obj, index) => obj.id !== action.payload)
      }
    default:
      return {
        ...state
      }
  }
}
