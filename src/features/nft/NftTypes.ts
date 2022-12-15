import { paths } from 'nfnt-client-sdk'

export type TokenSale = NonNullable<
  paths['/sales/v3']['get']['responses']['200']['schema']['sales']
>[0]

export type Collection =
  paths['/collection/v2']['get']['responses']['200']['schema']['collection']

export type TokenDetails = NonNullable<
  NonNullable<
    paths['/tokens/details/v4']['get']['responses']['200']['schema']['tokens']
  >[0]['token']
>

export type TokenDetailsAttribute = NonNullable<TokenDetails['attributes']>[0]
