import React, { useMemo } from 'react'
import { Text, TextProps } from 'rebass'
import styled, {
    DefaultTheme,
    ThemeProvider as StyledComponentsThemeProvider,
    createGlobalStyle,
    css
} from 'styled-components'
import { Colors } from './styled'
import { darken } from 'polished';

export * from './components'

const MEDIA_WIDTHS = {
    upToExtra2Small: 320,
    upToExtraSmall: 500,
    upToSmall: 720,
    upToMedium: 960,
    upToLarge: 1280
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
    (accumulator, size) => {
        ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
            @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
                ${css(a, b, c)}
            }
        `
        return accumulator
    },
    {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
    return {
        // base
        white,
        black,

        // text
        text1: darkMode ? 'rgb(128, 94, 73)' : 'rgb(128, 94, 73)',
        text2: darkMode ? 'rgb(91, 57, 38)' : 'rgb(91, 57, 38)',
        text3: darkMode ? 'rgb(209, 108, 0)' : 'rgb(209, 108, 0)',
        text4: darkMode ? 'rgb(170, 149, 133)' : 'rgb(170, 149, 133)',
        text5: darkMode ? '#2C2F36' : '#EDEEF2',

        // backgrounds / greys
        bg1: darkMode ? '#ddcdc6' : '#FFFFFF',
        bg2: darkMode ? '#e1d6cf' : '#F7F8FA',
        bg3: darkMode ? '#efe9e7': '#EDEEF2',
        bg4: darkMode ? '#3a506f' : '#CED0D9',
        bg5: darkMode ? '#6C7284' : '#888D9B',

        //specialty colors
        modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
        advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

        //primary colors
        primary1: darkMode ? '#ca6b00' : '#0e0e23',
        primary2: darkMode ? '#0097fb' : '#FF8CC3',
        primary3: darkMode ? '#00aff5' : '#FF99C9',
        primary4: darkMode ? '#376bad70' : '#F6DDE8',
        primary5: darkMode ? '#efeae7' : '#efeae7',

        // color text
        primaryText1: darkMode ? '#6da8ff' : '#0e0e23',

        // secondary colors
        secondary1: darkMode ? '#ca6b00' : '#ff007a',
        secondary2: darkMode ? '#17000b26' : '#F6DDE8',
        secondary3: darkMode ? '#17000b26' : '#ebebeb',

        // other
        red1: '#FD4040',
        red2: '#F82D3A',
        red3: '#D60000',
        green1: '#27AE60',
        yellow1: '#FFE270',
        yellow2: '#F3841E',
        blue1: '#ca6b00',

        borderRadius: '10px',

        // dont wanna forget these blue yet
        // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
        // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

        heroBG: darkMode
        ? 'radial-gradient(76.02% 75.41% at 1.84% 0%, #ff007a 0%, #021d43 100%)'
        : 'radial-gradient(76.02% 75.41% at 1.84% 0%, #FF3696 0%, #FFD8EB 100%);',

        gradientBG: darkMode
        ? 'linear-gradient(180deg, #000711 100%, #101518 31.19%, rgba(0, 0, 0, 0) 0%)'
        : 'linear-gradient(180deg, #fff8ee 100%, #efeae7 31.19%, rgba(0, 0, 0, 0) 0%)',

        backgroundColor: darkMode ? '#000711' : '#fff8ee',
    }
}

export function theme(darkMode: boolean): DefaultTheme {
    return {
        ...colors(darkMode),

        grids: {
            sm: 8,
            md: 12,
            lg: 24
        },

        //shadows
        shadow1: darkMode ? '#000' : '#2F80ED',

        // media queries
        mediaWidth: mediaWidthTemplates,

        // css snippets
        flexColumnNoWrap: css`
            display: flex;
            flex-flow: column nowrap;
        `,
        flexRowNoWrap: css`
            display: flex;
            flex-flow: row nowrap;
        `
    }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    //const darkMode = useIsDarkMode()
    const darkMode = true

    const themeObject = useMemo(() => theme(darkMode), [darkMode])

    return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
    color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
    main(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'text2'} {...props} />
    },
    link(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
    },
    black(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'text1'} {...props} />
    },
    white(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'white'} {...props} />
    },
    body(props: TextProps) {
        return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
    },
    mediumHeader(props: TextProps) {
        return <TextWrapper fontWeight={500} fontSize={20} {...props} />
    },
    subHeader(props: TextProps) {
        return <TextWrapper fontWeight={400} fontSize={14} {...props} />
    },
    small(props: TextProps) {
        return <TextWrapper fontWeight={500} fontSize={11} {...props} />
    },
    blue(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
    },
    darkGray(props: TextProps) {
        return <TextWrapper fontWeight={500} color={'text3'} {...props} />
    },
    italic(props: TextProps) {
        return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
    },
    error({ error, ...props }: { error: boolean } & TextProps) {
        return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
    }
}

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: #343434;
  background-color: #fff8ee;
}

input, textarea {
    font-family: "Poppins", sans-serif;
    font-display: fallback;
  }

body {
  min-height: 100vh;
`
