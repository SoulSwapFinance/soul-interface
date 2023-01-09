import { FC } from 'react'

export interface Props {
    fillPrimary: string
    fillSecondary: string
}

const MergeIcon: FC<Props> = ({ fillPrimary, fillSecondary }) => {

    return (
            <svg xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512"
            fill={fillPrimary}
            className="w-6 h-6"
            >
            <defs>
                {/* <!-- <style>.fa-secondary{opacity:.4}</style> --> */}
            </defs>


<path 
    fill={fillPrimary}
    d="M144.6 64C164.1 64 182.4 72.84 194.6 88.02L303.4 224H384V176C384 166.3 389.8 157.5 398.8 153.8C407.8 150.1 418.1 152.2 424.1 159L504.1 239C514.3 248.4 514.3 263.6 504.1 272.1L424.1 352.1C418.1 359.8 407.8 361.9 398.8 358.2C389.8 354.5 384 345.7 384 336V288H303.4C283.9 288 265.5 279.2 253.4 263.1L144.6 128H32C14.33 128 0 113.7 0 96C0 78.33 14.33 64 32 64H144.6z"
/>

<path 
    fill={fillSecondary}
    d="M253.4 263.1C265.5 279.2 283.9 288 303.4 288L194.6 423.1C182.5 439.2 164.1 448 144.6 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H144.6L247 256L253.4 263.1z"
/>

</svg>
    )
}
export default MergeIcon