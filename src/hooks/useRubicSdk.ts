import { useCallback, useEffect, useState } from 'react';
// import { makeObservable } from 'common/MakeObservable';
import SDK, { Configuration } from 'rubik-sdk';

const sdkStore = makeObservable<SDK | null>(null);

export function makeObservable<T>(target: T) {
    let listeners: ((value: T) => void)[] = [];
    let value = target;

    function get() {
        return value;
    }

    function set(newValue: T) {
        if (value === newValue) return;
        value = newValue;
        listeners.forEach((l) => l(value));
    }

    function subscribe(listenerFunc: (value: T) => void) {
        listeners.push(listenerFunc);
        return () => unsubscribe(listenerFunc); // will be used inside React.useEffect
    }

    function unsubscribe(listenerFunc: (value: T) => void) {
        listeners = listeners.filter((l) => l !== listenerFunc);
    }

    return {
        get,
        set,
        subscribe,
    };
}

export const useRubicSdk = () => {
    const [sdk, setSdk] = useState<SDK | null>(sdkStore.get());

    useEffect(() => {
        return sdkStore.subscribe(setSdk);
    }, [sdk, setSdk]);

    const setConfiguration = useCallback(async (configuration: Configuration) => {
            const sdk = await SDK.createSDK(configuration);
            sdkStore.set(sdk);
        }
    , [setSdk])

    return {
        sdk,
        setConfiguration
    }
}