import React, { Suspense, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import bImage from '../assets/images/big_bao_fade.png'
import noise from '../assets/images/noise.png'
import { useLocation } from 'react-router-dom'
import { AppBar, Polling, Popups } from '../components'
import Web3ReactManager from '../components/Web3ReactManager'
import ReactGA from 'react-ga'
import Routes from '../routes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../state'
import { updateUserDarkMode } from '../state/user/actions'
import { parse } from 'qs'

function App(): JSX.Element {
    const bodyRef = useRef<any>(null)

    const { pathname, search } = useLocation()

    const dispatch = useDispatch<AppDispatch>()

    const [wrapperClassList, setWrapperClassList] = useState(
        'flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 pt-4 sm:pt-8 px-4 md:pt-10 pb-20'
    )

    useEffect(() => {
        if (pathname === '/trade') {
            setWrapperClassList(
                'flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0'
            )
        } else {
            setWrapperClassList(
                'flex flex-col flex-1 items-center justify-start w-screen h-full overflow-y-auto overflow-x-hidden z-0 pt-4 sm:pt-8 px-4 md:pt-10 pb-20'
            )
        }
    }, [pathname])

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo(0, 0)
        }
    }, [pathname])

    useEffect(() => {
        ReactGA.pageview(`${pathname}${search}`)
    }, [pathname, search])

    useEffect(() => {
        if (!search) return
        if (search.length < 2) return

        const parsed = parse(search, {
            parseArrays: false,
            ignoreQueryPrefix: true
        })

        const theme = parsed.theme

        if (typeof theme !== 'string') return

        if (theme.toLowerCase() === 'light') {
            dispatch(updateUserDarkMode({ userDarkMode: false }))
        } else if (theme.toLowerCase() === 'dark') {
            dispatch(updateUserDarkMode({ userDarkMode: true }))
        }
    }, [dispatch, search])

    return (
        <Suspense fallback={null}>
        <BGCard>
        <CardNoise />
        <CardBGImage />
        </BGCard>
            <div className="flex flex-col items-start overflow-x-hidden h-screen">
                <AppBar />
                <div ref={bodyRef} className={wrapperClassList}>
                    <Popups />
                    <Polling />
                    <Web3ReactManager>
                        <Routes />
                    </Web3ReactManager>
                </div>
            </div>
        </Suspense>
    )
}

export const CardBGImage = styled.span`
  mix-blend-mode: overlay;
  background: url(${bImage});
  width: 100%;
  height: 100%;
  opacity: 0.2;
  background-size: cover;
  position: absolute;
  left: 0;
  background-repeat: no-repeat;

  top: 0;
  @media (max-width: 960px) {
    background-repeat: no-repeat;
  }
`

export const CardNoise = styled.span`
  background: url(${noise});
  mix-blend-mode: overlay;
  width: 100%;
  height: 100%;
  /* max-width: 1000px; */
  opacity: 0.3;
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  z-index: 99;
`

export const CardFade = styled.span`
  /* mix-blend-mode: overlay; */
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.gradientBG};
  /* max-width: 1000px; */
  position: absolute;
  left: 0;
  top: 0;
  user-select: none;
  z-index: 99;
  @media (max-width: 960px) {
    height: 125vh;
  }
`

export const StyledBG = styled.div`
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.backgroundColor};
  -webkit-transform: translate3d(0, 0, 0);
  height: -webkit-fill-available;
  opacity: 1;
  background: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${theme.primary1} 0%, ${theme.backgroundColor} 100%)`};
  opacity: 0.15;
  /* z-index: 9999; */
  user-select: none;
  pointer-events: none;
`

export const BGCard = styled.span`
  width: 100vw;
  height: 100vh;
  /* max-width: 1200px; */
  max-height: 1220px;
  user-select: none;
  background-repeat: no-repeat;
  background: ${({ theme }) => theme.heroBG};
  background-size: contain;
  opacity: 0.2;
  @media (max-width: 960px) {
    width: 100vw;
    height: 100vh;
    max-height: 1220px;
  }
`

export default App
