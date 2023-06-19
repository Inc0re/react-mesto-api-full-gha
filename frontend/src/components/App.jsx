import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import ProtectedRoute from './ProtectedRoute'
import InfoTooltip from './InfoTooltip'

import { CurrentUserContext } from '../contexts/CurrentUserContext'

import api from '../utils/Api'
import authApi from '../utils/AuthApi'

function App() {
  const [currentUser, setCurrentUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isTooltipSuccess, setIsTooltipSuccess] = useState(false)

  function getCurrentUserInfo() {
    api
      .getCurrentUserInfo()
      .then(res => {
        const { name, email, about, avatar, _id } = res.data
        setCurrentUser(currentUser => ({
          ...currentUser,
          name,
          email,
          about,
          avatar,
          _id,
        }))
        setLoggedIn(true)
      })
      .catch(err => console.log(err))
  }

  function handleRegister(userData) {
    authApi
      .register(userData)
      .then(res => {
        setIsTooltipSuccess(true)
        setIsTooltipOpen(true)
      })
      .catch(err => {
        setIsTooltipSuccess(false)
        setIsTooltipOpen(true)
        console.log(err)
      })
  }

  function handleLogin(userData) {
    authApi
      .login(userData)
      .then(res => {
        if (res) {
          setIsTooltipSuccess(true)
          setLoggedIn(true)
          console.log('Успешная авторизация. Токен сохранен в cookie.')
        }
      })
      .catch(err => {
        setIsTooltipSuccess(false)
        setIsTooltipOpen(true)
        console.log(err)
      })
  }

  function handleLogout() {
    authApi.logout().then(res => {
      if (res) {
        setLoggedIn(false)
        setCurrentUser({})
        console.log('Успешный выход из системы.')
      }
    })
  }

  React.useEffect(() => {
    // if (loggedIn) {
    //   getCurrentUserInfo()
    // }
    getCurrentUserInfo()
  }, [loggedIn])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route
          path='*'
          element={
            <ProtectedRoute
              element={Home}
              loggedIn={loggedIn}
              path='/sign-in'
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          path='/sign-in'
          element={
            <ProtectedRoute
              element={Login}
              loggedIn={!loggedIn}
              setLoggedIn={setLoggedIn}
              handleLogin={handleLogin}
              path='/'
            />
          }
        />
        <Route
          path='/sign-up'
          element={
            <ProtectedRoute
              element={Register}
              loggedIn={!loggedIn}
              handleRegister={handleRegister}
              path='/'
            />
          }
        />
      </Routes>
      <InfoTooltip
        isOpened={isTooltipOpen}
        isSuccess={isTooltipSuccess}
        setIsPopupOpened={setIsTooltipOpen}
      />
    </CurrentUserContext.Provider>
  )
}

export default App
