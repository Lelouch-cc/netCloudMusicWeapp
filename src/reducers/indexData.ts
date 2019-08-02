import { INIT_BANNER_DATA, INIT_RECOMMEND_LIST, LOAD_MORE_LIST } from '../constants/indexData'

const INITIAL_STATE = {
  bannerData: [],
  recommendList: []
}

export default function indexData (state = INITIAL_STATE, action) {
  switch (action.type) {
    case INIT_BANNER_DATA:
      return {
        ...state,
        bannerData: action.data
      }
    case INIT_RECOMMEND_LIST:
      return {
        ...state,
        recommendList: action.data
      }
    case LOAD_MORE_LIST:
      return {
        ...state,
        recommendList: [...state.recommendList, ...action.data]
      }
    default:
      return state
  }
}
