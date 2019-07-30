import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text } from '@tarojs/components'
import { savePlayList, changeCurrentIndex } from '../../actions/playlist'

import './index.scss'

type PageStateProps = {
  playList: {
    playList: Array<any>,
    currentIndex: number
  }
}

type PageDispatchProps = {
  savePlayList: (list: Array<any>) => any
  changeCurrentIndex: (index: number) => any
}

type PageOwnProps = {
  musicList: Array<any>
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MusicList {
  props: IProps;
}

@connect(({ playList }) => ({
  playList
}), (dispatch) => ({
  savePlayList (list: Array<any>) {
    dispatch(savePlayList(list))
  },
  changeCurrentIndex (index: number) {
    dispatch(changeCurrentIndex(index))
  }
}))
class MusicList extends Component {
  static externalClasses = ['mv-icon', 'more-icon']

  componentWillMount () {}

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}


  /**
   * 处理歌手信息函数
   * @function getSingersAndAlbum
   * @param {object} songInfo 歌曲详细信息
   *
   * @returns {string}  返回歌手、专辑字符串
   */
  getSingersAndAlbum = (songInfo: any): string => {
    let singers:string = ''
    if (songInfo) {
      songInfo.ar.map((singer, index) => {
        if (index === songInfo.ar.length - 1) {
          singers += singer.name
        } else {
          singers += `${singer.name}/`
        }
      })
      singers += ` - ${songInfo.al.name}`
    }
    return singers
  }

  getSingers = (songInfo: any): string => {
    let singers: string = ''
    if (songInfo) {
      songInfo.ar.map((singer, index) => {
        if (index === songInfo.ar.length - 1) {
          singers += singer.name
        } else {
          singers += `${singer.name}/`
        }
      })
    }
    return singers ? singers : '未知'
  }

  onClickToPlayMusic = async (songInfo: any, index: number): Promise<any> => {
    await this.props.savePlayList(this.props.musicList)
    await this.props.changeCurrentIndex(index)
    Taro.navigateTo({
      url: `/pages/play/index?id=${songInfo.id}&name=${songInfo.name}&singer=${this.getSingers(songInfo)}`
    })
  }

  render () {
    const { musicList } = this.props

    return (
      <View className="music-list">
        {musicList && musicList.map((song, index) => (
          <View
            className="music-list-item"
            key={song.id}
            onClick={this.onClickToPlayMusic.bind(this, song, index)}
          >
            <Text className="music-list-item-index">
              {index + 1}
            </Text>
            <View className="music-list-item-music">
              <Text className="music-list-item-music-name">
                {song.name}
              </Text>
              <Text className="music-list-item-music-singer">
                {this.getSingersAndAlbum(song)}
              </Text>
            </View>
            <Text className="mv-icon music-list-item-mv" />
            <Text className="more-icon music-list-item-more" />
          </View>
        ))}
      </View>
    )
  }
}

export default MusicList as ComponentClass<PageOwnProps, PageState>
