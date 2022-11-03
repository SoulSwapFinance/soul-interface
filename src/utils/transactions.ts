export const send = async (
    provider: any,
    callback: () => Promise<any>,
    dispatch: any
  ) => {
    let hash: string = null;
    try {
      const result = await callback();
      hash = result.hash;
      dispatch({
        type: "transactionPending",
        hash,
      });
      console.log("PENDING", hash);
      new Promise((resolve) => {
        (transaction: any) => {
          dispatch({
            type: "transactionCompleted",
            hash,
            transaction,
          });
          console.log("COMPLETED", transaction);
          resolve(hash);
        };
      });
      return hash;
    } catch (err) {
      // dispatch({
      //   type: "transactionError",
      //   hash,
      //   error: err,
      // });
      throw err;
    }
  };