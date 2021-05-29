import styled from 'styled-components'
import { darken } from 'polished'

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  // background-color: ${({ theme }) => theme.bg3};
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    // background-color: ${({ theme }) => theme.bg4};
  }
  /*
  svg {
    margin-top: 2px;
  }
  */
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
  // ${({ theme }) => theme.mediaWidth.upToMedium`
  //   margin-left: 4px;
  // `};
`

export const StyledMenu = styled.div`
    // margin-left: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: none;
    text-align: left;
    color: ${({ theme }) => theme.bg2};
    ${({ theme }) => theme.mediaWidth.upToExtra2Small`
    margin-left: 0.2rem;
  `};
`

export const MenuFlyout = styled.span`
    min-width: 8.125rem;
    background-color: ${({ theme }) => theme.bg3};
    box-shadow: rgb(247 244 242) 1px 1px 0px inset;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid rgb(226, 214, 207);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    position: absolute;
    top: 3rem;
    right: 0rem;
    z-index: 100;
`
