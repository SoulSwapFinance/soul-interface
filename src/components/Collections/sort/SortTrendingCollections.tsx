import { toggleOffItem, toggleOnItem } from 'features/nft/lib/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FC } from 'react'
import { styled } from '@stitches/react';
// import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
// import * as ToggleGroup from '@radix-ui/react-toggle-group'
// import { FiChevronDown } from 'react-icons/fi'
import useCollections from 'features/nft/hooks/useCollections'
// import { TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon } from '@radix-ui/react-icons';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { blackA, whiteA, yellow } from '@radix-ui/colors'
import React from 'react';

type Options = '24H' | '7D' | '30D'

const options: { [x: string]: Options } = {
  '1DayVolume': '24H',
  '7DayVolume': '7D',
  '30DayVolume': '30D',
}

const SortTrendingCollections: FC = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [sortSelection, setSortSelection] = useState<Options>('24H')
  const { collections } = useCollections(router)
  const [value, setValue] = React.useState('1DayVolume');

  useEffect(() => {
    const sort = router?.query['sort']?.toString()
    if (sort && options[sort]) {
      setSortSelection(options[sort])
      return
    }
    setSortSelection('24H')
  }, [router.query])


  const StyledToggleGroup = styled(ToggleGroupPrimitive.Root, {
    display: 'inline-flex',
    backgroundColor: blackA.blackA12,
    borderRadius: 4,
    boxShadow: `0 2px 10px ${blackA.blackA12}`,
  });
  
  const StyledItem = styled(ToggleGroupPrimitive.Item, {
    all: 'unset',
    backgroundColor: 'white',
    color: blackA.blackA12,
    height: 35,
    width: 35,
    display: 'flex',
    fontSize: 15,
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 1,
    '&:first-child': { marginLeft: 0, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
    '&:last-child': { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
    '&:hover': { backgroundColor: yellow.yellow4 },
    '&[data-state=on]': { backgroundColor: yellow.yellow9, color: '#000000' },
    '&:focus': { position: 'relative', boxShadow: `0 0 0 2px black` },
  });

  const ToggleGroup = StyledToggleGroup;
  const ToggleGroupItem = StyledItem;
  
  return (

      <ToggleGroup 
        type="single" 
        defaultValue= {value}
        onValueChange={(value) => {
            collections.setSize(10)
              toggleOnItem(router, 'sort', value)
              setValue(value)
          }}
        aria-label="Volumes"
        >
        <ToggleGroupItem value="1DayVolume" aria-label="1D Volume"> 1D </ToggleGroupItem>
        <ToggleGroupItem value="7DayVolume" aria-label="7D Volume"> 1W </ToggleGroupItem>
        <ToggleGroupItem value="30DayVolume" aria-label="30D Volume"> 1M </ToggleGroupItem>
      </ToggleGroup>
    );
    // <DropdownMenu.Root onOpenChange={setOpen}>
    //   <DropdownMenu.Trigger className="btn-primary-outline w-[228px] justify-between px-4 py-3 dark:border-[#FFD700] dark:ring-[#FFD700] dark:focus:ring-2">
    //     <span className="reservoir-label-l dark:text-gray-100">
    //       {sortSelection}
    //     </span>
    //     <FiChevronDown
    //       className={`h-5 w-5 text-[#9CA3AF] transition-transform ${
    //         open ? 'rotate-180' : ''
    //       }`}
    //     />
    //   </DropdownMenu.Trigger>

    //   <DropdownMenu.Content
    //     align="end"
    //     sideOffset={12}
    //     className="w-48 divide-y-[1px] divide-[#D1D5DB] overflow-hidden rounded-[8px] border-[1px] border-[#D1D5DB] bg-white shadow-md radix-side-bottom:animate-slide-down dark:divide-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 md:w-56"
    //   >
    //     {Object.keys(options).map((key) => (
    //       <DropdownMenu.Item
    //         key={key}
    //         onClick={() => {
    //           collections.setSize(0)
    //           if (key === 'lowest_price') {
    //             toggleOffItem(router, 'sort')
    //           } else {
    //             toggleOnItem(router, 'sort', key)
    //           }
    //         }}
    //         disabled={sortSelection === options[key]}
    //         className={`reservoir-label-l reservoir-gray-dropdown-item rounded-none hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800`}
    //         aria-label={`Sort by ${options[key]}`}
    //       >
    //         {options[key]}
    //       </DropdownMenu.Item>
    //     ))}
    //   </DropdownMenu.Content>
    // </DropdownMenu.Root>
  // )
}

export default SortTrendingCollections
