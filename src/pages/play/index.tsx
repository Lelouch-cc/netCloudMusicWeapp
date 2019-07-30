import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Image } from '@tarojs/components'
import { AtFloatLayout } from "taro-ui"
import Api from '../../service/api'
import { getGlobalData, getSingers } from '../../util'
import { changePlayState, changeCurrentIndex } from '../../actions/playlist'
import stylusImg from '../../assets/image/stylus.png'

import './index.scss'

type PageStateProps = {
  playList: {
    playState: number,
    playOrder: number,
    currentIndex: number,
    playList: Array<any>
  }
}

type PageDispatchProps = {
  changePlayState: (state: number) => any
  changeCurrentIndex: (index: number) => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Play {
  props: IProps;
}

@connect(({ playList }) => ({
  playList
}), (dispatch) => ({
  changePlayState (state: number) {
    dispatch(changePlayState(state))
  },
  changeCurrentIndex (index: number) {
    dispatch(changeCurrentIndex(index))
  }
}))
class Play extends Component {
  state: { musicInfo: any, isOpenPlayList: boolean } = {
    musicInfo: {},
    isOpenPlayList: false
  }

  private audio: Taro.BackgroundAudioManager = getGlobalData('backgroundAudioManager')

  componentWillMount () {
    const { name, singer, id } = this.$router.params
    if (name) {
      Taro.setNavigationBarTitle({ title: `${name} - ${singer}` })
    }
    if (id) {
      this.getPlayInfo(id)
    }
    this.onAudioPlayComplete()
  }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  /**
   * 获取播放的详细信息
   * @param {number} id 歌曲的ID
   */
  getPlayInfo = (id: number): void => {
    this.getMusicDetail(id)
      .then((res) => {
        Taro.setNavigationBarTitle({ title: `${res.name} - ${getSingers(res)}` })
        this.audio.title = res.name
        this.audio.singer = getSingers(res)
        this.audio.epname = res.al.name
        this.audio.coverImgUrl = res.al.picUrl
        this.setState({
          musicInfo: res
        })
        this.getMusicUrl(id)
          .then((res) => {
            if (!res.url) {
              this.audio.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            } else {
              this.audio.src = res.url
            }
            this.audio.seek(0)
            this.audio.play()
            this.props.changePlayState(1)
          })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  getMusicDetail = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      Api.get('/song/detail', { ids: id })
        .then((res) => {
          resolve(res.data.songs[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getMusicUrl = (id: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      Api.get('/song/url', { id })
        .then((res) => {
          resolve(res.data.data[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /**
   * 改变播放状态
   */
  playOrPause = (): void => {
    const { playState } = this.props.playList
    playState === 0 ? this.audio.play() : this.audio.pause()
    this.props.changePlayState(playState === 0 ? 1 : 0)
  }

  /**
   * 播放下一首歌曲
   * @param {number} type 1为播放下一曲，-1为播放上一曲
   */
  playNext = (type: number): void => {
    const { playList, playOrder } = this.props.playList
    let { currentIndex } = this.props.playList
    if (playList.length <= 0) {
      return
    }

    if (type === 1) {
      if (playOrder === 0 && currentIndex === playList.length - 1) {
        return
      }
      if (currentIndex === playList.length - 1) {
        currentIndex = -1
      }
      this.audio.pause()
      this.props.changePlayState(0)
      const id:number = playList[currentIndex + 1].id
      this.getPlayInfo(id)
      this.props.changeCurrentIndex(currentIndex + 1)
    }

    if (type === -1) {
      if (playOrder === 0 && currentIndex === 0) {
        return
      }
      if (currentIndex === 0) {
        currentIndex = playList.length
      }
      this.audio.pause()
      this.props.changePlayState(0)
      const id:number = playList[currentIndex - 1].id
      this.getPlayInfo(id)
      this.props.changeCurrentIndex(currentIndex - 1)
    }
  }

  onAudioPlayComplete = (): void => {
    this.audio.onEnded(() => {
      const { playOrder } = this.props.playList
      if (playOrder !== 3) {
        this.playNext(1)
      }
    })
  }

  onClickPlayOrPause = (): void => {
    this.playOrPause()
  }

  onClickOpenPlayList = (): void => {
    this.setState({
      isOpenPlayList: true
    })
  }

  onClickPlayListSong = (index: number): void => {
    const { playList } = this.props.playList
    this.audio.pause()
    this.props.changePlayState(0)
    const id:number = playList[index].id
    this.getPlayInfo(id)
    this.props.changeCurrentIndex(index)
    this.setState({
      isOpenPlayList: false
    })
  }

  render () {
    const { playState, playList } = this.props.playList
    const { musicInfo, isOpenPlayList } = this.state

    return (
      <View className="playPage">
        <View className="playPage-albumArt">
          <View className={`playPage-albumArt-box ${playState === 0 ? 'animate-stop' : ''}`}>
            <Image
              className="playPage-albumArt-box-cover"
              src={musicInfo.al.picUrl}
            />
            <View
              className="playPage-albumArt-box-border"
            ></View>
          </View>
          <View className={`playPage-albumArt-stylus ${playState === 1 ? 'stylus-rotate' : ''}`}>
            <Image
              className="playPage-albumArt-stylus-img"
              src={stylusImg}
            />
          </View>
        </View>
        <View className="playPage-extra">
          <View className="playPage-extra-top">
            <Text className="iconfont icon-xiai playPage-extra-top-icon" />
            <Text className="iconfont icon-download1 playPage-extra-top-icon" />
            <Text className="iconfont icon-pinglun playPage-extra-top-icon" />
            <Text className="iconfont icon-icon-more playPage-extra-top-icon" />
          </View>
          <View className="playPage-extra-progress">
            <Text className="playPage-extra-progress-nowTime">
              00:00
            </Text>
            <View className="playPage-extra-progress-bar"></View>
            <Text className="playPage-extra-progress-totalTime">
              03:45
            </Text>
          </View>
          <View className="playPage-extra-control">
            <Text className="iconfont icon-shunxubofang playPage-extra-control-icon" />
            <Text
              className="iconfont icon-shangyiqu101 playPage-extra-control-icon"
              onClick={this.playNext.bind(this, -1)}
            />
            <Text
              className={`iconfont ${playState === 0 ? 'icon-bofang1' : 'icon-suspend_icon'} playPage-extra-control-icon playOrPause`}
              onClick={this.onClickPlayOrPause}
            />
            <Text
              className="iconfont icon-xiayiqu101 playPage-extra-control-icon"
              onClick={this.playNext.bind(this, 1)}
            />
            <Text
              className="iconfont icon-play-list-fill playPage-extra-control-icon"
              onClick={this.onClickOpenPlayList.bind(this)}
            />
          </View>
        </View>

        {/* 播放列表弹层 */}
        <AtFloatLayout
          className="playPage-playlist"
          isOpened={isOpenPlayList}
          title={`播放列表${playList.length > 0 ? `（${playList.length}）` : ''}`}
          onClose={() => {this.setState({ isOpenPlayList: false })}}
        >
          {
            playList && playList.length > 0
            ? playList.map((song, index) => (
              <View
                className="playPage-playlist-item"
                key={song.id}
                onClick={this.onClickPlayListSong.bind(this, index)}
              >
                <View className="playPage-playlist-item-name">
                  {song.name}
                </View>
                <View className="playPage-playlist-item-singer">
                  {` - ${getSingers(song)}`}
                </View>
              </View>
            ))
            : ''
          }
        </AtFloatLayout>
      </View>
    )
  }
}

export default Play as ComponentClass<PageOwnProps, PageState>
