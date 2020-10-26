import { combineReducers } from 'redux'
import agent from './agent'
import agents from './agents'
import modules from './modules'
import module from './module'

export default combineReducers({
  agents,
  agent,
  modules,
  module
})
