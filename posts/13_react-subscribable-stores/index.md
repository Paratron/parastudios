---
title: Subscribable stores in React
slug: subscribable-stores-in-react
publishTime: "2022-05-21 09:30:00"
description: Subscribable stores are a pattern which is relatively new for React applications.
tags: ["react", "javascript", "frontend", "architecture"]
---
# Subscribable stores in React

![Architecture - Modern windows on a wooden-like facade](./architecture.jpg)

I feel like the hype around Redux Stores cooled down a bit. Nowadays I only rarely see someone talking about it.

I never really bought into the hype around Redux - but I really like the idea of having a centralized data store which lives outside the UI (namely your React components), can be updated from anywhere (web push or websockets anyone?) and components can subscribe to parts of the data and only render when _that_ data changes. Not render on any changes.

While React Context is a neat way to provide data to be acccessed from anywhere in your application, its a problem if some components only need partial data from that context. Any component using the context will need to render if _anything_ inside the context changes - even if they don't care for it.

## useSyncExternalStore
Thats one heavy name for a hook. Starting as an external package `useSubscription()`, the React developers went a long way to make it possible to integrate subscribable stores in React like they are very common in Svelte.

Since I discovered the `useSubscription()` hook, I got a whole new world of storage related ideas in React.

I used Svelte for a couple of projects so far and came to love its take on reactivity. While I personally think that only using `writable()` for vast collections of data is not enough (I'll write about that, soon), the ability to subscribe to subsets of the data in a writable store trough derived stores i a really flexible and performant idea.

And with use of [`useSyncExternalStore()`](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore) we can bring that idea to React (from v18 onwards)!

If you use React <18, use the npm package [use-subscription](https://npmjs.com/package/use-subscription) instead.

## Subscribable stores
The idea of a subscribable store is to have an object that holds a value you want to store inside it. The object might provide a method like `set()` to the outside through which the value inside the store can be updated. Other parts of the application who are interested in the value of the store can pass a callback function to the stores' `subscribe()` method. Whenever the value inside the store is changed, all subscribe callbacks will be called with the new value so the subscribed parts of the application can react on the changes.

Implementing that kind of store requires only a couple of lines of javascript:

```javascript
function createSubscribableStore(initialValue){
    let value = initialValue;
    const subscribers = [];
    
    return {
        set: (nextValue) => {
            value = nextValue;
            subscribers.forEach((cb) => cb(value));
        },
        subscribe: (callback) => {
            subscribers.push(callback);
            return function unsubscribe(){
                const index = subscribers.findIndex(callback);
                if(index !== -1){
                    subscribers.splice(index, 1);
                }
            }
        }
    }
}

```

The subscribable store pattern can be written by hand without having to install any dependencies. Yes, the above implementation does not provide an immutable value but you get the idea.

The design has a drawback. Its no possible to simply read the store value once. A part of the app that wants to get the store value needs to subscribe to it, wait for the callback to be called and then unsubscribe. This is not ery performant. But when you really want to continuously observe a value, its great!

The form of subscribable store used by Reacts `useSyncExternalStore` hook mitigates this drawback by requiring the store to expose a method to fetch the current value which upon call does - well - return the stores current value without needing to subscribe.

Lets see how we can use such a subscribable store in React:

### Basic example
```javascript
import {useSyncExternalStore} from "react";
const tickStore = createSubscribableStore(0);

export function useTicker(){
    return useSyncExternalStore(tickStore.subscribe, tickStore.getCurrentValue);
}


setInterval(() => {
    tickStore.set(tickStore.getCurrentValue() + 1);
}, 1000);
```

So what did we create here?

We created a store and initiated it with the value `0`. We created a custom hook `useTicker()` which uses Reacts `useSyncExternalStore()` to subscribe to our ticker store.

Finally, we created an interval which increases the ticker by 1 every second.

All components which use the `useTicker()` hook will update automatically, when a new value is set on the ticker store.

## Good alternative to React context
This pattern is a great alternative to the React context API when you want to make data available at multiple points in your app and also want to update that data rather frequently.

The `useSyncExternalState()` hook has the ability to update the component when a subset of the store value changes!

```javascript
const weatherStore = createSubscribableStore({
    zip: 12345,
    tempCelsius: 36,
    humidity: 80
});

export function useTemperature(){
    return useSyncExternalStore(weatherStore.subscribe, () => weatherStore.getCurrentValue().tempCelsius);
}

export function useHumidity(){
    return useSyncExternalStore(weatherStore.subscribe, () => weatherStore.getCurrentValue().humidity);
}

setInterval(async () => {
    const {zip} = weatherStore.getCurrentValue();
   const response = await fetch(`/zip/${zip}`);
    if(response status === 200){
        weatherStore.set(await response.json());
    }
}, 15000);
```

There you go. We create a weather store and pull updates from a fictional weather API every 15 seconds.

The two hooks provide access to temperature and humidity and will only update the components who use them when their respective value changes. The temperature hook won't trigger a re-render if only humidity changes.

In my opinion, this blows context out of the water completely.

## Whats the big deal?
So what, you might think. Now we have another option for data storage besides `useState()`, `useReducer()` and the context API.

I think subscribable stores are a huge improvement because it makes this easier:

### Separation of concerns
This pattern allows to separate business logic completely from the UI layer (React components).

A developer can develop the business logic as complete standalone javascript code which is better testable.

And react components become easier because no fetching logic or other things need to be built into components. They can behave more like they should be: "dumb" templates.
