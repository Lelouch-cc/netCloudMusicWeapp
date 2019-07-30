import Api from '../service/api'
import {
  GET_ALBUMLIST_INFO,
  EMPTY_ALBUMLIST,
  SAVE_PLAYLIST,
  CHANGE_PLAY_STATE,
  CHANGE_CURRENT_INDEX
} from '../constants/playlist'

const getPlaylistDetail = (data: any) => {
  return {
    type: GET_ALBUMLIST_INFO,
    data
  }
}

export const emptyAlbumList = () => {
  return {
    type: EMPTY_ALBUMLIST,
    data: {}
  }
}

export const savePlayList = (list: Array<any>) => {
  return {
    type: SAVE_PLAYLIST,
    data: list
  }
}

export const changePlayState = (state: number) => {
  return {
    type: CHANGE_PLAY_STATE,
    data: state
  }
}

export const changeCurrentIndex = (index: number) => {
  return {
    type: CHANGE_CURRENT_INDEX,
    data: index
  }
}

export const asyncGetAlbumListDetail = (id: number) => {
  return (dispatch) => {
    Api.get('/playlist/detail', { id })
      .then((res) => {
        dispatch(getPlaylistDetail(res.data.playlist))
      })
  }
}
