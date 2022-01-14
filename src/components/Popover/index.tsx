// import React, { Fragment, useCallback, useState } from 'react'
// import { Popover as HeadlessuiPopover } from '@headlessui/react'
// import { Placement } from '@popperjs/core'
// import { classNames } from 'functions'
// import useInterval from 'hooks/useInterval'
// import ReactDOM from 'react-dom'
// import { usePopper } from 'react-popper'

// export interface PopoverProps {
//   content: React.ReactNode
//   children: React.ReactNode
//   placement?: Placement
//   show?: boolean
//   modifiers?: any[]
//   fullWidth?: boolean
// }

// export default function Popover({ content, children, placement = 'auto', show, modifiers }: PopoverProps) {
//   const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
//   const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
//   const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
//   const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
//     placement,
//     strategy: 'fixed',
//     modifiers: modifiers || [
//       { name: 'offset', options: { offset: [0, 8] } },
//       { name: 'arrow', options: { element: arrowElement } },
//     ],
//   })

//   const updateCallback = useCallback(() => {
//     update && update()
//   }, [update])

//   useInterval(updateCallback, show ? 100 : null)

//   return (
//     <HeadlessuiPopover as={Fragment}>
//       {({ open }) => (
//         <>
//           {React.Children.map(children, (child) => {
//             return (
//               <HeadlessuiPopover.Button as={Fragment} {...{ ref: setReferenceElement as any }}>
//                 {child}
//               </HeadlessuiPopover.Button>
//             )
//           })}
//           {(show ?? open) &&
//             ReactDOM.createPortal(
//               <HeadlessuiPopover.Panel
//                 static
//                 className="z-1000"
//                 ref={setPopperElement as any}
//                 style={styles.popper}
//                 {...attributes.popper}
//               >
//                 {content}
//                 <div
//                   className={classNames('w-2 h-2 z-50')}
//                   ref={setArrowElement as any}
//                   style={styles.arrow}
//                   {...attributes.arrow}
//                 />
//               </HeadlessuiPopover.Panel>,
//               document.querySelector('#popover-portal')
//             )}
//         </>
//       )}
//     </HeadlessuiPopover>
//   )
// }


import React, { useCallback, useState } from 'react'

import { Placement } from '@popperjs/core'
import Portal from '@reach/portal'
import styled from 'styled-components'
import useInterval from '../../hooks/useInterval'
import { usePopper } from 'react-popper'

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 9999;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  // background: ${({ theme }) => theme.bg2};
  // border: 1px solid ${({ theme }) => theme.bg3};
  // color: ${({ theme }) => theme.text2};
  border-radius: 8px;
`

const ReferenceElement = styled.div`
  display: inline-block;
`

const Arrow = styled.div`
  width: 8px;
  height: 8px;
  z-index: 9998;
  ::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 9998;
    content: '';
    // border: 1px solid ${({ theme }) => theme.bg3};
    transform: rotate(45deg);
    // background: ${({ theme }) => theme.bg2};
  }
  &.arrow-top {
    bottom: -5px;
    ::before {
      border-top: none;
      border-left: none;
    }
  }
  &.arrow-bottom {
    top: -5px;
    ::before {
      border-bottom: none;
      border-right: none;
    }
  }
  &.arrow-left {
    right: -5px;
    ::before {
      border-bottom: none;
      border-left: none;
    }
  }
  &.arrow-right {
    left: -5px;
    ::before {
      border-right: none;
      border-top: none;
    }
  }
`

export interface PopoverProps {
  content: React.ReactNode
  show: boolean
  children: React.ReactNode
  placement?: Placement
}

export default function Popover({ content, show, children, placement = 'auto' }: PopoverProps) {
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, update, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [8, 8] } },
      { name: 'arrow', options: { element: arrowElement } },
    ],
  })
  const updateCallback = useCallback(() => {
    update && update()
  }, [update])
  useInterval(updateCallback, show ? 100 : null)

  return (
    <>
      <ReferenceElement ref={setReferenceElement as any}>{children}</ReferenceElement>
      <Portal>
        <PopoverContainer show={show} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
          {content}
          <Arrow
            className={`arrow-${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setArrowElement as any}
            style={styles.arrow}
            {...attributes.arrow}
          />
        </PopoverContainer>
      </Portal>
    </>
  )
}