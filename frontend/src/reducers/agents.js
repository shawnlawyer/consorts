const initialState = {
  agents:{},
  loaded:false
}

export default function reducer(state = initialState, action) {

    switch (action.type) {
        case 'STORE_AGENTS':
            return {
            ...state,
            agents: {...state.agents, ...action.payload},
            loaded:true
            }

        case 'CLEAR_AGENT':
            let agents = { ...state.agents }
            delete agents[action.payload]
            return {
            ...state,
            agents: agents
            }

        default:
            return {
            ...state
            }
    }

}
