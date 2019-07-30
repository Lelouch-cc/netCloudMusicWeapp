import { combineReducers } from 'redux'
import counter from './counter'
import indexData from './indexData'
import playList from './playlist'

export default combineReducers({
  counter,
  indexData,
  playList
})
