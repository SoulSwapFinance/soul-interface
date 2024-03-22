import { useWeb3React } from "@web3-react/core"
import { Button } from "components/Button"
import HeadlessUIModal from "components/Modal/HeadlessUIModal"
import Typography from "components/Typography"
import { useRouter } from "next/router"
import { useState } from "react"
import { ChainId } from "sdk"

export const TermsNotice = () => {
    const { account, chainId } = useWeb3React()

    const router = useRouter()
    // const tokens = router.query.tokens
    // const [currencyIdA, currencyIdB] = (tokens as string[]) || [DEFAULT_CURRENCY_A, DEFAULT_CURRENCY_B]
    const showNotice = router?.asPath == ('/swap')
    // const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
    const [showConnect, setShowConnect] = useState(showNotice)
    const handleConnect = () => {
        // toggleWalletModal
        setShowConnect(false)
    }

    return (<HeadlessUIModal.Controlled
        chainId={chainId ?? ChainId.FANTOM}
        isOpen={showConnect}
        onDismiss={
            () => setShowConnect(false)}
    >
        <div className="space-y-4">
            {/* <ModalHeader header={`FYI: Early Withdrawal Fee`} onClose={() => setShowConnect(false)} /> */}
            <Typography variant="sm">
                <div className="text-xl mt-4 mb-4 text-center border p-1.5 border-purple rounded-2xl">
                    {`Our Terms and Conditions`}
                </div>
                <div className="grid grid-cols-2 mt-6 text-center text-purple gap-3 justify-center">
                    <a href={"https://docs.soulswap.finance/faq/user-agreement"}
                        target="_blank"
                        rel={'noreferrer noopener'}
                        className={'border rounded-2xl p-2 bg-dark-900 m-2 border-dark-800 hover:border-purple'}
                    >
                        <i><b> {`User Agreement`}</b></i>
                    </a>
                    <a
                        href={"https://docs.soulswap.finance/faq/privacy-policy"}
                        target="_blank"
                        rel={'noreferrer noopener'}
                        className={'border rounded-2xl p-2 bg-dark-900 m-2 border-dark-800 hover:border-purple'}
                    >
                        <i><b> {`Privacy Policy`}</b></i>
                    </a>
                </div>
            </Typography>
            <Button
                height="2.5rem"
                color="purple"
                onClick={handleConnect}
            >
                {`Agree and Continue`}
            </Button>
        </div>
    </HeadlessUIModal.Controlled>
    )
}