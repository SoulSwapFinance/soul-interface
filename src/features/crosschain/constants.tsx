import classNames from 'classnames'

// Base classes
export const DEFAULT_INPUT_FONT = 'text-left text-base md:text-sm placeholder:font-normal font-medium'
export const DEFAULT_INPUT_BG = 'bg-white bg-opacity/[0.06]'
export const DEFAULT_INPUT_HOVER_BG = 'hover:bg-white hover:bg-opacity/[0.06]'
export const DEFAULT_INPUT_RING =
  'focus-within:ring-2 focus:outline-none border-none focus:ring-2 focus:ring-offset-2 focus-within:ring-offset-2 ring-blue focus:ring-blue focus-within:ring-blue'
export const DEFAULT_INPUT_PADDING = 'py-3 px-4'
export const ERROR_INPUT_CLASSNAME = '!ring-red/70 !ring-2 !ring-offset-2'
export const DEFAULT_INPUT_APPEARANCE = 'rounded-xl shadow-md min-h-[44px] w-full truncate'

// Unstyled input
export const DEFAULT_INPUT_UNSTYLED = classNames(
  DEFAULT_INPUT_FONT,
  'p-0 bg-transparent border-none focus:outline-none focus:ring-0 w-full truncate font-medium'
)

// Default class without padding
export const DEFAULT_INPUT_CLASSNAME_NO_PADDING = classNames(
  DEFAULT_INPUT_FONT,
  DEFAULT_INPUT_BG,
  DEFAULT_INPUT_RING,
  DEFAULT_INPUT_APPEARANCE
)

// Default class with padding
export const DEFAULT_INPUT_CLASSNAME = classNames(
  DEFAULT_INPUT_FONT,
  DEFAULT_INPUT_BG,
  DEFAULT_INPUT_RING,
  DEFAULT_INPUT_APPEARANCE,
  DEFAULT_INPUT_PADDING
)