export const USER_REJECTED_TX = 4001

export class WalletError extends Error {
  constructor(readonly code: number, readonly message: string, readonly data?: unknown, readonly stack?: string) {
    super()
  }
}

export const isWalletError = (error: unknown): error is WalletError => {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error
}