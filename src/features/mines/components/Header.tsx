import { Currency, NATIVE, Percent } from 'sdk'
import React, { FC, useCallback, useState } from 'react'
import NavLink from 'components/NavLink'

import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Search from 'components/Search';
import { useActiveWeb3React } from 'services/web3'

const getQuery = (input, output) => {
  const { chainId } = useActiveWeb3React()
  if (!input && !output) return

  if (input && !output) {
    return { inputCurrency: input.address || NATIVE[chainId].symbol  }
  } else if (input && output) {
    return { inputCurrency: input.address, outputCurrency: output.address }
  }
}

interface MineHeaderProps {
  input?: Currency
  output?: Currency
  search?: (term: string) => void
}

const MineHeader: FC<MineHeaderProps> = ({ input, output, search }) => {
  const { i18n } = useLingui()
  const [term, setTerm] = useState("");
  const saveTermAndSearch = useCallback((searchingTerm: string) => {
    setTerm(searchingTerm);
    if (search && typeof search === "function") {
      search(searchingTerm.toLowerCase()); // forces lowercase
    }
  }, []);

  return (
    <div className="flex items-center justify-center ml-4 mr-4 mb-2 space-x-1">
        {search &&
          <div className="w-2/4">
            <Search
              term={term}
              search={saveTermAndSearch}
              inputProps={{
                placeholder: 'Search token',
                className:
                'relative bg-transparent border border-transparent rounded placeholder-secondary focus:placeholder-primary font-bold text-base px-3 py-2',
              }}
              />
          </div>
        }
      <div className="grid grid-cols-4 rounded p-3px bg-dark-800 h-[46px]">
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/mines?filter=deposited"}
          >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis ">
            {i18n._(t`YOURS`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/mines?filter=soulswap"}
          >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`SOUL`)}
          </a>
        </NavLink>
        <NavLink
          activeClassName="font-bold border rounded text-high-emphesis border-dark-800 bg-gradient-to-r from-opaque-blue to-opaque-purple hover:from-blue hover:to-purple"
          href={"/mines?filter=inactive"}
          >
          <a className="flex items-center justify-center px-4 text-base font-medium text-center rounded-md text-secondary hover:text-high-emphesis">
            {i18n._(t`RETIRED`)}
          </a>
        </NavLink>
        </div>
    </div>
  )

}

export default MineHeader
