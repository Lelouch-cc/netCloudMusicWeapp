import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtNavBar, AtIcon } from 'taro-ui'
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import {
  asyncInitBannerData,
  asyncInitRecommendList,
  asyncLoadMoreList
} from '../../actions/indexData'

import './index.scss'

type PageStateProps = {
  indexData: {
    bannerData: Array<any>,
    recommendList: Array<any>
  }
}

type PageDispatchProps = {
  asyncInitBannerData: (type: number) => any
  asyncInitRecommendList: (limit: number, cat?: string) => any
  asyncLoadMoreList: (limit: number, before: number, cat?: string) => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ indexData }) => ({
  indexData
}), (dispatch) => ({
  asyncInitBannerData (type: number) {
    dispatch(asyncInitBannerData(type))
  },
  asyncInitRecommendList (limit: number, order?: string) {
    dispatch(asyncInitRecommendList(limit, order))
  },
  asyncLoadMoreList (limit: number, before: number, cat?: string) {
    dispatch(asyncLoadMoreList(limit, before, cat))
  }
}))
class Index extends Component {
  config: Config = {
    enablePullDownRefresh: true,
  }

  componentWillMount () {
    const token: string = Taro.getStorageSync('user_token')
    if (!token) {
      Taro.redirectTo({
        url: '/pages/login/index'
      })
    } else {
      this.props.asyncInitBannerData(2)
      this.props.asyncInitRecommendList(18)
    }
  }

  componentDidMount () {}

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  onClickSearch = (): void => {
    console.log('点击了搜索')
  }

  onClickMenu = (): void => {
    console.log('点击了菜单')
  }

  onClickToPlaylistDetailPage = (id: number): void => {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${id}`
    })
  }

  onScrollToUpper = async (e: any): Promise<any> => {
    console.log('滑动到顶部', e, e.detail)
    Taro.showToast({
      title: '正在加载',
      icon: 'none'
    })
    await this.props.asyncInitRecommendList(18)
    Taro.hideToast()
  }

  onScrollToLower = async (e: any): Promise<any> => {
    console.log('滑动到底部', e, e.detail)
    const { recommendList } = this.props.indexData
    Taro.showToast({
      title: '正在加载...',
      icon: 'none'
    })
    await this.props.asyncLoadMoreList(18, recommendList[recommendList.length - 1].updateTime)
    setTimeout(() => {
      Taro.hideToast()
    }, 1000)
  }

  render () {
    const { bannerData, recommendList } = this.props.indexData

    return (
      <View className="index">
        <ScrollView
          className="index-scroll"
          scrollY
          scrollWithAnimation
          onScrollToUpper={this.onScrollToUpper}
          onScrollToLower={this.onScrollToLower}
        >
          {/* 导航栏 */}
          <View className="index-navbar">
            <AtNavBar
              fixed
              leftIconType='menu'
              onClickRgIconSt={this.onClickSearch}
              onClickLeftIcon={this.onClickMenu}
              color='#a3a3a3'
              title='发现'
              rightFirstIconType='search'
            />
          </View>

          {/* 轮播图 */}
          <View className='index-slide'>
            <Swiper
              className='index-swiper'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay>
              {bannerData.map(banner =>
                <SwiperItem key={banner.bannerId}>
                  <Image
                    style='width: 100%;height: 100%;'
                    src={banner.pic}
                  />
                </SwiperItem>
              )}
            </Swiper>
          </View>

          {/* 二级导航 */}
          <View className="index-nav">
            <View className="index-nav-item">
              <View className="index-nav-item-icon-wrap">
                <AtIcon className="index-nav-item-icon at-icon at-icon-calendar" value="" />
              </View>
              <Text className="index-nav-item-text">每日推荐</Text>
            </View>
            <View className="index-nav-item">
              <View className="index-nav-item-icon-wrap">
                <AtIcon className="index-nav-item-icon at-icon at-icon-list" value="" />
              </View>
              <Text className="index-nav-item-text">歌单</Text>
            </View>
            <View className="index-nav-item">
              <View className="index-nav-item-icon-wrap">
                <AtIcon className="index-nav-item-icon at-icon at-icon-eye" value="" />
              </View>
              <Text className="index-nav-item-text">排行榜</Text>
            </View>
            <View className="index-nav-item">
              <View className="index-nav-item-icon-wrap">
                <AtIcon className="index-nav-item-icon at-icon at-icon-streaming" value="" />
              </View>
              <Text className="index-nav-item-text">电台</Text>
            </View>
          </View>

          {/* 推荐歌单 */}
          <View className="recommend-playList">
            <View className="recommend-playList-title .at-article__h2">
              推荐歌单
            </View>
            <View className="playList">
              {recommendList.map(list =>
                <View
                  className="playList-item"
                  key={list.id}
                  onClick={this.onClickToPlaylistDetailPage.bind(this, list.id)}
                >
                  <Image
                    className="playList-item-img"
                    src={list.coverImgUrl}
                  />
                  <Text className="playList-item-desc">
                    {list.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>
