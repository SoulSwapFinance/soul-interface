import { FC } from 'react'

export interface Props {
    fillPrimary: string
    fillSecondary: string
    className: string
}

const SquareEllipsisIcon: FC<Props> = ({ fillPrimary, fillSecondary, className }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={className}
            fill={fillPrimary}
        >
            <defs>
                {/* <!-- <style>.fa-secondary{opacity:.4}</style> --> */}
            </defs>

            <path
                fill={fillPrimary}
                d="M128 224C145.7 224 160 238.3 160 256C160 273.7 145.7 288 128 288C110.3 288 96 273.7 96 256C96 238.3 110.3 224 128 224zM224 224C241.7 224 256 238.3 256 256C256 273.7 241.7 288 224 288C206.3 288 192 273.7 192 256C192 238.3 206.3 224 224 224zM320 288C302.3 288 288 273.7 288 256C288 238.3 302.3 224 320 224C337.7 224 352 238.3 352 256C352 273.7 337.7 288 320 288z"
                />

            <path 
                fill={fillSecondary}
                d="M0 96C0 60.65 28.65 32 64 32H384C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96zM256 256C256 238.3 241.7 224 224 224C206.3 224 192 238.3 192 256C192 273.7 206.3 288 224 288C241.7 288 256 273.7 256 256zM96 256C96 273.7 110.3 288 128 288C145.7 288 160 273.7 160 256C160 238.3 145.7 224 128 224C110.3 224 96 238.3 96 256zM352 256C352 238.3 337.7 224 320 224C302.3 224 288 238.3 288 256C288 273.7 302.3 288 320 288C337.7 288 352 273.7 352 256z"            />
        </svg>

    )
}
export default SquareEllipsisIcon