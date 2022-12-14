import { css } from 'styled-components/macro'

export const ScrollBarStyles = css<{ $isHorizontalScroll?: boolean }>`
  // Firefox scrollbar styling
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${''} transparent`};
  height: 100%;

  // safari and chrome scrollbar styling
  ::-webkit-scrollbar {
    background: transparent;

    // Set height for horizontal scrolls
    ${({ $isHorizontalScroll }) => {
      return $isHorizontalScroll
        ? css`
            height: 4px;
            overflow-x: scroll;
          `
        : css`
            width: 4px;
            overflow-y: scroll;
          `
    }}
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => ''};
    border-radius: 8px;
  }
`

export const OpacityHoverState = css`
  &:hover {
    opacity: ${({ theme }) => 100};
  }

  &:active {
    opacity: ${({ theme }) => 100};
  }

  transition: ${({
    theme: {
      // transition: { duration, timing },
    },
  }) => `opacity ${100}`};
  `
  // `opacity ${duration.medium} ${timing.ease}`};