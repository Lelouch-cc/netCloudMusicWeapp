import Api from '../service/api'
import {
  INIT_BANNER_DATA,
  INIT_RECOMMEND_LIST,
  LOAD_MORE_LIST
} from '../constants/indexData'

const initBannerData = (data: any) => {
  return {
    type: INIT_BANNER_DATA,
    data
  }
}

const initRecommendList = (data: any) => {
  return {
    type: INIT_RECOMMEND_LIST,
    data
  }
}

const loadMoreList = (data: any) => {
  return {
    type: LOAD_MORE_LIST,
    data
  }
}

export const asyncInitBannerData = (type: number) => {
  return (dispatch) => {
    Api.get('/banner', { type })
    .then((res) => {
      dispatch(initBannerData(res.data.banners))
    })
  }
}

export const asyncInitRecommendList = (limit: number, cat: string = '全部') => {
  return (dispatch) => {
    Api.get('/top/playlist/highquality', { limit, cat })
      .then((res) => {
        dispatch(initRecommendList(res.data.playlists))
      })
  }
}

export const asyncLoadMoreList = (limit: number, before: number, cat: string = '全部') => {
  return (dispatch) => {
    Api.get('/top/playlist/highquality', { limit, before, cat })
      .then((res) => {
        dispatch(loadMoreList(res.data.playlists))
      })
  }
}
