import { FC } from 'react'

export interface Props {
    fillPrimary: string
    fillSecondary: string
    className: string
}

const DollarBillIcon: FC<Props> = ({ fillPrimary, fillSecondary, className }) => {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            // fill="#FFFFFF" 
            className={className}
            fill={fillPrimary}
        >
            <defs>
                {/* <!-- <style>.fa-secondary{opacity:.4}</style> --> */}
            </defs>

            <path
                fill={fillPrimary}
                d="M512 64C547.3 64 576 92.65 576 128V384C576 419.3 547.3 448 512 448H64C28.65 448 0 419.3 0 384V128C0 92.65 28.65 64 64 64H512zM448 128H128C128 163.3 99.35 192 64 192V320C99.35 320 128 348.7 128 384H448C448 348.7 476.7 320 512 320V192C476.7 192 448 163.3 448 128z"            />

            <path
                fill={fillSecondary}
                d="M512 192V320C476.7 320 448 348.7 448 384H128C128 348.7 99.35 320 64 320V192C99.35 192 128 163.3 128 128H448C448 163.3 476.7 192 512 192zM288 352C341 352 384 309 384 256C384 202.1 341 160 288 160C234.1 160 192 202.1 192 256C192 309 234.1 352 288 352z"            />
        </svg>
    )
}
export default DollarBillIcon