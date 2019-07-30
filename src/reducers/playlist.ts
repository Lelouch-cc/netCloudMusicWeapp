import {
  GET_ALBUMLIST_INFO,
  EMPTY_ALBUMLIST,
  SAVE_PLAYLIST,
  CHANGE_PLAY_STATE,
  CHANGE_CURRENT_INDEX
} from '../constants/playlist'

const INITIAL_STATE = {
  // 当前歌单信息
  albumList: {},
  // 当前播放列表
  playList: [],
  // 当前播放歌曲的ID
  nowPlayMusicId: '',
  // 播放顺序 0：顺序 1：列表循环 2：随机播放 3：单曲循环
  playOrder: 0,
  // 随机播放列表
  shuffleList: [],
  // 播放状态 0：暂停 1：播放中
  playState: 0,
  // 当前歌词
  currentLyric: [],
  currentIndex: 0
}

export default function playlistDetail (state = INITIAL_STATE, action) {
  switch (action.type) {
    case EMPTY_ALBUMLIST:
      return {
        ...state,
        albumList: action.data
      }
    case GET_ALBUMLIST_INFO:
      return {
        ...state,
        albumList: action.data
      }
    case SAVE_PLAYLIST:
      return {
        ...state,
        playList: action.data
      }
    case CHANGE_PLAY_STATE:
      return {
        ...state,
        playState: action.data
      }
    case CHANGE_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: action.data
      }
    default:
      return state
  }
}
