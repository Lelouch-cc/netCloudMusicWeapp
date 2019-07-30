import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { asyncGetAlbumListDetail, emptyAlbumList } from '../../actions/playlist'
import MusicList from '../../components/MusicList/index'

import './index.scss'

type PageStateProps = {
  playList: {
    albumList: any
  }
}

type PageDispatchProps = {
  asyncGetAlbumListDetail: (id: number) => any
  emptyAlbumList: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface PlayListDetail {
  props: IProps;
}

@connect(({ playList }) => ({
  playList
}), (dispatch) => ({
  asyncGetAlbumListDetail (id: number) {
    dispatch(asyncGetAlbumListDetail(id))
  },
  emptyAlbumList () {
    dispatch(emptyAlbumList())
  }
}))
class PlayListDetail extends Component {
  config = {
    navigationBarTitleText: '歌单'
  }

  componentWillMount () {}

  componentDidMount () {
    const id: number = this.$router.params.id
    this.props.asyncGetAlbumListDetail(id)
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () {
    console.log('组件即将被卸载')
    this.props.emptyAlbumList()
  }

  componentDidShow () {}

  componentDidHide () {}

  onScrollToUpper = (e: any): void => {
    console.log('滑动到顶部', e, e.detail)
  }

  onScrollToLower = (e: any): void => {
    console.log('滑动到底部', e, e.detail)
  }



  render () {
    const playlistDetail = this.props.playList.albumList

    return (
      <View className="playList-detail">

        {/* 歌单信息 */}
        <View className="playlist-info">

          {/* 歌单封面 */}
          <View className="playlist-info-left">
            <Image
              className="playlist-info-left-img"
              src={playlistDetail.coverImgUrl || ''}
            />
          </View>

          {/* 歌单文字信息 */}
          <View className="playlist-info-right">
            <Text className="playlist-info-right-name at-article__h3">
              {playlistDetail.name || ''}
            </Text>
            <View className="playlist-info-right-author">
              <Image
                className="playlist-info-right-author-avatar"
                src={playlistDetail.creator.avatarUrl || ''}
              />
              <Text className="playlist-info-right-author-name at-article__info">
                {playlistDetail.creator.nickname ? `${playlistDetail.creator.nickname} >` : ''}
              </Text>
            </View>
            <Text className="playlist-info-right-describe">
              {playlistDetail.description || ''}
            </Text>
          </View>
        </View>

        {/* 歌单按钮 */}
        <View className="playlist-buttons">
          <View className="playlist-buttons-item">
            <Text className="iconfont icon-pinglun playlist-buttons-item-icon" />
            <Text className="playlist-buttons-item-text">
              {playlistDetail.commentCount || 0}
            </Text>
          </View>
          <View className="playlist-buttons-item">
            <Text className="iconfont icon-fenxiang playlist-buttons-item-icon" />
            <Text className="playlist-buttons-item-text">
              {playlistDetail.shareCount || 0}
            </Text>
          </View>
          <View className="playlist-buttons-item">
            <Text className="iconfont icon-download1 playlist-buttons-item-icon" />
            <Text className="playlist-buttons-item-text">下载</Text>
          </View>
          <View className="playlist-buttons-item">
            <Text className="iconfont icon-md-checkmark-circle- playlist-buttons-item-icon" />
            <Text className="playlist-buttons-item-text at-article__info">多选</Text>
          </View>
        </View>

        <View className="playlist-wrap">
          {/* 歌单信息 */}
          <View className="playlist-wrap-title">
            <View className="playlist-wrap-title-left">
              <Text className="iconfont icon-zanting playlist-wrap-title-icon" />
              <Text className="playlist-wrap-title-playAll-text">
                播放全部
              </Text>
              <Text className="playlist-wrap-title-playAll-tip">
                （共{playlistDetail.tracks.length || 0}首）
              </Text>
            </View>
            <View className="playlist-wrap-title-right">
              <View className="playlist-wrap-title-collect">
                <Text className="iconfont icon-jiahao playlist-wrap-title-collect-icon" />
                <Text className="playlist-wrap-title-collect-text">
                  收藏（{playlistDetail.trackCount || 0}）
                </Text>
              </View>
            </View>
          </View>

          {/* 歌曲列表 */}
          <View className="playlist-wrap-list">
            <ScrollView
              className="playlist-wrap-list-scroll"
              scrollY
              scrollWithAnimation
              onScrollToUpper={this.onScrollToUpper}
              onScrollToLower={this.onScrollToLower}
            >
              <MusicList
                mv-icon="iconfont icon-Video"
                more-icon="iconfont icon-moreif"
                musicList={playlistDetail.tracks || []}
              />
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}

export default PlayListDetail as ComponentClass<PageOwnProps, PageState>
