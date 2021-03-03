import { DownOutlined, LogoutOutlined } from '@ant-design/icons'
import { AuthContext } from '@tmtsoftware/esw-ts'
import { Button, Dropdown, Menu } from 'antd'
import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TMTLogo from '../../assets/images/TMT_Logo.png'
import { HOME } from '../../routes/RoutesConfig'
import styles from './headerBar.module.css'

const HeaderBar = (): JSX.Element => {
  const { auth, login, logout } = useContext(AuthContext)
  const [username, setUsername] = useState<string | undefined>(undefined)

  useEffect(() => {
    !!auth &&
      !!auth.isAuthenticated() &&
      setUsername(auth.tokenParsed()?.preferred_username)
  }, [auth])

  const menu = (
    <Menu>
      <Menu.Item key='1' danger icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  const Logout = () => (
    <>
      <Dropdown trigger={['click']} overlay={menu}>
        <Button type={'text'}>
          {username?.toUpperCase()} <DownOutlined />
        </Button>
      </Dropdown>
    </>
  )

  const Login = () => (
    <Button type='text' onClick={login}>
      Login
    </Button>
  )

  return (
    <>
      {auth?.isAuthenticated() ? <Logout /> : <Login />}
      {/* TODO should we use history.push ? */}
      <Link to={HOME}>
        <img role='tmt_logo' src={TMTLogo} className={styles.logo} />
      </Link>
    </>
  )
}

export default HeaderBar
