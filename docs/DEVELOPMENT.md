# Development

## Linking the SDK

The SoulSwap SDK is used heavily throughout the Soul Interface. You might like to clone this library and link it for various reasons, such as debugging, extracting, or even further developing the SDK.

```sh
git clone https://github.com/soulswap/soulswap-sdk.git && cd soulswap-sdk && git checkout prod && yarn link
```

In the Soul Interface repository you'd link this package by running this command.

```sh
yarn link @soulswap/sdk
```

If actively developing the SDK, you might like to run the watcher. You can do this by running this command in the root of the sdk repository once linked, and changes will be picked up by the interface in real-time.

```sh
yarn watch
```
