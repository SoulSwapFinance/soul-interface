import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
type SVGProps = React.SVGProps<SVGSVGElement>
export const SwapIcon = (props: SVGProps, fillColor?: string, secondaryColor?: string) => {
    return (
        <FontAwesomeIcon icon="fa-duotone fa-chart-mixed" />
    )
}

// export const ArrowRightIcon = (props: SVGProps) => (
//     <svg width="16" height="16" viewBox="0 0 16 16" {...props} xmlns="http://www.w3.org/2000/svg">
//       <path
//         d="M12.7494 7.79771C12.7494 7.64202 12.6842 7.49135 12.5686 7.38086L9.26897 4.08119C9.13839 3.95564 9.00279 3.90039 8.86216 3.90039C8.54074 3.90039 8.30971 4.1264 8.30971 4.43276C8.30971 4.59347 8.375 4.72907 8.47545 4.82952L9.60547 5.97461L11.0619 7.30552L9.89676 7.23521H3.80971C3.47321 7.23521 3.24219 7.46624 3.24219 7.79771C3.24219 8.12416 3.47321 8.35519 3.80971 8.35519H9.89676L11.0619 8.28488L9.60547 9.61579L8.47545 10.7609C8.375 10.8613 8.30971 10.9969 8.30971 11.1576C8.30971 11.464 8.54074 11.69 8.86216 11.69C9.00279 11.69 9.13839 11.6348 9.25893 11.5193L12.5686 8.20954C12.6842 8.09905 12.7494 7.94838 12.7494 7.79771Z"
//         fill="currentColor"
//       />
//     </svg>
//   )