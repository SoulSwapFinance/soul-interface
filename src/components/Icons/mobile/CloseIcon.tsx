import { FC } from 'react'

export interface Props {
    fillPrimary: string
    fillSecondary: string
    className: string
}

const CloseIcon: FC<Props> = ({ fillPrimary, fillSecondary, className }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            // viewBox="4 4 16 16"
            viewBox="0 0 24 24"
            className={className}
            fill={fillPrimary}
        >

            <path 
                fill={fillSecondary}
                d="M12.7,12.5C12.7,12.5,12.7,12.5,12.7,12.5c-0.4-0.4-1-0.4-1.4,0l-3,3c-0.4,0.4-0.4,1,0,1.4c0.4,0.4,1,0.4,1.4,0l2.3-2.3
                l2.3,2.3c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L12.7,12.5z M9.7,11.5L12,9.2l2.3,2.3
                c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4l-3-3c0,0,0,0,0,0c-0.4-0.4-1-0.4-1.4,0l-3,3
                c-0.4,0.4-0.4,1,0,1.4C8.7,11.8,9.3,11.8,9.7,11.5z"
                // d="M15 17.25a.997.997 0 0 1-.707-.293L12 14.664l-2.293 2.293a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0l3 3A1 1 0 0 1 15 17.25zm0-5.5a.997.997 0 0 1-.707-.293L12 9.164l-2.293 2.293a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0l3 3A1 1 0 0 1 15 11.75z"
                // d="M16,12a1,1,0,0,1-.71-.29L12,8.41,8.71,11.71a1,1,0,0,1-1.41-1.41l4-4a1,1,0,0,1,1.41,0l4,4A1,1,0,0,1,16,12Z"
            />
            </svg>
    )
}


{/* <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" id="up-chevron"><path ></path></svg> */}
{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="up-chevron"><path fill="#6563ff" ></path></svg> */}
export default CloseIcon