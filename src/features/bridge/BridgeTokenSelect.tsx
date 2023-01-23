import { i18n } from "@lingui/core"
import { t } from "@lingui/macro"
import { ContentBox, OverlayButton, Typo1, Typo2 } from "components"
import Column from "components/Column"
import Loader from "components/Loader"
import Row from "components/Row"
import { getChainColor } from "constants/chains"
// import { getChainColor } from "constants/chains"
import useModal from "hooks/useModal"
import Image from 'next/image'
import { BridgeTokenSelectModal } from "pages/bridge"

const BridgeTokenSelect: React.FC<any> = ({ tokens, selected, selectToken }) => {
    const [onPresentSelectTokenModal] = useModal(
      <BridgeTokenSelectModal tokens={tokens} selectToken={selectToken} />,
      "bridge-token-select-modal"
    )
  
    return (
      <div className={`flex w-full p-1 border border-2 border-[${getChainColor(selected)}] rounded rounded-2xl bg-dark-1000`}>
      <OverlayButton
          style={{ padding: 0 }}
          disabled={!tokens || !tokens.length}
          onClick={() => tokens && tokens.length && onPresentSelectTokenModal()}
        >
              <div className={`grid grid-cols-2 w-[2/3] justify-center p-1`}>
              {selected ? (
                <>
                  <Image
                    alt="token logo"
                    height="42px"
                    width="42px"
                    src={selected.logoUrl}
                  />
                  <Typo2 style={{ fontWeight: "bold" }}>{selected.symbol}</Typo2>
                </>
              ) : tokens && tokens.length ? (
                <Typo1>{i18n._(t`Select Token`)}</Typo1>
              ) : (
                <Loader />
              )}
            </div>
        </OverlayButton>
      </div>
    )
  }

  export default BridgeTokenSelect