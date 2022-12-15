type ChainId = 1 | 250

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U
