import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { AtNavBar, AtIcon } from 'taro-ui'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import {
  asyncInitBannerData,
  asyncInitRecommendList
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
  asyncInitRecommendList: (limit: number, order?: string) => any
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
  }
}))
class Index extends Component {
  componentDidMount () {
    this.props.asyncInitBannerData(2)
    this.props.asyncInitRecommendList(18)
  }

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

  render () {
    const { bannerData, recommendList } = this.props.indexData

    return (
      <View className="index">
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

      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>
