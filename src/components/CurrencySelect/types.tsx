import { Text, TextProps } from 'rebass'
import { Colors } from './styleds'
export * from './components'

const TextWrapper = (Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
    main(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'text2'} {...props} />
    },
    link(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
    },
    black(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'text1'} {...props} />
    },
    white(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'white'} {...props} />
    },
    body(props: TextProps) {
      return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
    },
    largeHeader(props: TextProps) {
      return <TextWrapper fontWeight={600} fontSize={24} {...props} />
    },
    mediumHeader(props: TextProps) {
      return <TextWrapper fontWeight={500} fontSize={20} {...props} />
    },
    subHeader(props: TextProps) {
      return <TextWrapper fontWeight={400} fontSize={14} {...props} />
    },
    small(props: TextProps) {
      return <TextWrapper fontWeight={500} fontSize={11} {...props} />
    },
    blue(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
    },
    yellow(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
    },
    darkGray(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'text3'} {...props} />
    },
    gray(props: TextProps) {
      return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
    },
    italic(props: TextProps) {
      return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
    },
    error({ error, ...props }: { error: boolean } & TextProps) {
      return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
    }
  }

function styled(Text: any) {
    throw new Error('Function not implemented.')
}
