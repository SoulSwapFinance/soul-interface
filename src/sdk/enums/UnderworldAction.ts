export enum UnderworldAction {
    ADD_ASSET = 1,
    REPAY = 2,
    REMOVE_ASSET = 3,
    REMOVE_COLLATERAL = 4,
    BORROW = 5,
    GET_REPAY_SHARE = 6,
    GET_REPAY_PART = 7,
    ACCRUE = 8,
  
    // Functions that don't need accrue to be called
    ADD_COLLATERAL = 10,
    UPDATE_EXCHANGE_RATE = 11,
  
    // Function on CoffinBox
    COFFIN_DEPOSIT = 20,
    COFFIN_WITHDRAW = 21,
    COFFIN_TRANSFER = 22,
    COFFIN_TRANSFER_MULTIPLE = 23,
    COFFIN_SETAPPROVAL = 24,
  
    // Any external call (except to CoffinBox)
    CALL = 30,
  }
