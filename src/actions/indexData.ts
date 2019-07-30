import Api from '../service/api'
import {
  INIT_BANNER_DATA,
  INIT_RECOMMEND_LIST
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

export const asyncInitBannerData = (type: number) => {
  return (dispatch) => {
    Api.get('/banner', { type })
    .then((res) => {
      dispatch(initBannerData(res.data.banners))
    })
  }
}

export const asyncInitRecommendList = (limit: number, order: string = 'hot') => {
  return (dispatch) => {
    Api.get('/top/playlist', { limit, order })
      .then((res) => {
        dispatch(initRecommendList(res.data.playlists))
      })
  }
}
