import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import Api from '../../service/api'

import './index.scss'
import loginBg from '../../assets/image/bg_login.png'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  showLoading: boolean
  phone: string
  password: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Login {
  props: IProps;
}

@connect(() => ({}))
class Login extends Component {
  state: PageState = {
    showLoading: false,
    phone: '',
    password: ''
  }

  componentWillMount () {}

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () {}

  componentDidShow () {}

  componentDidHide () {}

  onPhoneChange = (e) => {
    this.setState({
      phone: e.detail.value
    })
  }

  onPasswordChange = (e) => {
    this.setState({
      password: e.detail.value
    })
  }

  login = (): void => {
    const { phone, password, showLoading } = this.state
    if (showLoading || !phone || !password) {
      return
    }
    this.setState({
      showLoading: true
    })
    Api.get('/login/cellphone', { phone, password })
      .then((res) => {
        if (res.statusCode === 200) {
          Taro.setStorageSync('user_token', res.cookies[0])
          Taro.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000
          })
          setTimeout(() => {
            Taro.redirectTo({
              url: '/pages/index/index'
            })
          }, 1200)
        } else if (res.statusCode === 501) {
          Taro.showToast({
            title: `登录失败，${res.data.msg}`,
            icon: 'none',
            duration: 1000
          })
        } else {
          Taro.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 1000
          })
        }
        this.setState({
          showLoading: false
        })
      })
      .catch((err) => {
        console.log(err)
        Taro.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 1000
        })
        this.setState({
          showLoading: false
        })
      })
  }

  render () {
    const { showLoading, phone, password } = this.state

    return (
      <View
        className="login"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <View className="login-con">
          <Text className="login-title">
            Sign In
          </Text>
          <Input
            className="login-input login-phone"
            type='number'
            placeholder='手机号码'
            adjustPosition
            onInput={this.onPhoneChange.bind(this)}
            value={phone}
          />
          <Input
            className="login-input login-password"
            type='text'
            password
            placeholder='密码'
            adjustPosition
            onInput={this.onPasswordChange.bind(this)}
            value={password}
          />
          <AtButton
            loading={showLoading}
            className="login-btn"
            onClick={this.login.bind(this)}
          >
            Sign in
          </AtButton>
        </View>
      </View>
    )
  }
}

export default Login as ComponentClass<PageOwnProps, PageState>
