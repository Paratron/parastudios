---
title: A typed event system for Typescript
slug: typed-event-system-for-typescript
publishTime: "2022-04-19 15:25:00"
description: I wrote a simple, typed event emitter/subscriber system on the weekend.
tags: ["code", "typescript", "events", "subscribe"]  
---

# A typed event system for Typescript

I am working on a [pet project](https://robostreamer.com) with distributed services right now.

During the development, I was in need of a classic on/off style event system which is usually quickly written with 
a couple lines of code. This time however, I wondered if it would be possible to have the whole event system type guarded
with Typescript types.

## Get the code
I stored the whole 58 lines of code in [a github gist](https://gist.github.com/Paratron/faacf00bc9a06d8adce1220c6a65f041). Please be aware that I don't take any responsibility if the code
does not work as intented or causes failures somewhere. Use it at your own risk.


## How to use it
If you have ever worked with a on/off style event emitter, the usage of this system will be straight forward. I am still going
to explain it shortly.

### How a basic on/off style event system works
You may skip to the next headline, if you know about this already :)

For an event system, you usually have points in your code which trigger events and broadcast the occurance of the events without
knowing if someone actually listens for them.

Other parts of your code may subscribe to the existing events and react on them. If you ever worked with events in the DOM of a website,
its exactly this pattern:

```javascript
// Adding a callback function to "change" events on a text box.
// The callback is called every time when a change event happens.
document.getElementById("myCoolTextbox").addEventListener("change", function(event){
    // ...
});
```

So there may be infinite subscribers (listeners) to some event and whenever it gets triggered, all subscribers will be notified. 

### Prepare the types of your events
I designed the event system so you can create a typescript `interface` to define all your existing events as well as their data payloads.

If we for example want to create a fictional video player app with an event system, we could define the following events:

```typescript
interface AppEvents {
    load: {
      filename: string;
      format: string;
      totalTimeMs: number;
    },
    update: {
        currentTimeMs: number;
    },
    play: void,
    pause: void,
    stop: void
}
```

So we have a `load` event when the user opens a file, an `update` event which fires continuously while playing back the file
and `play`, `pause` and `stop` events that are triggered upon user interaction.

### Creating and using the event system
With our typescript interface at hand defining all events in our system, we can actually create the system in code:

```typescript
// appEvents.ts
import createEventSystem from "./eventSystem.ts";

interface AppEvents {
    load: {
        filename: string;
        format: string;
        totalTimeMs: number;
    },
    update: {
        currentTimeMs: number;
    },
    play: void,
    pause: void,
    stop: void
}

const eventSystem = createEventSystem<AppEvents>();
export default eventSystem;
```

Now the system can be used from anywhere in our code. Typescript takes care that only known events can be triggered
and they need to receive exactly the expected payloads.

```typescript
import appEvents from "./appEvents.ts";
import { loadAndParseAudioFile } from "./audioLoader.ts";

export async function loadFile(filename){
    const {
        filename,
        format,
        totalTimeMs
    } = await loadAndParseAudioFile(filename);
    
    appEvents.trigger("load", {filename, format, totalTimeMs});
}
```

On some other part of your application, your code may subscribe to the defined events:

```typescript
// logger.ts
import appEvents from "./appEvents.ts";

appEvents.on("load", (payload) => {
    console.log(`You opened the file ${payload.filename} with a length of ${payload.totalTimeMs} milliseconds.`);
});
```

### Stop listening to an event
To detach from receiving events, one needs to call the `.off()` method and pass the exactly same callback function to the
off handler:

```typescript
function handler(data){
    console.log("An update happened!", data);
}

eventSystem.on("update", handler);

// And somewhere else:
eventSystem.off("update", handler);
```

Please be aware that it needs to be the _same_ callback function and not another one, with similar code.

### THIS WONT WORK!
```typescript
eventSystem.on("update", (data) => {
    console.log("An update happened!", data);
});

eventSystem.off("update", (data) => {
    console.log("An update happened!", data);
});

// These are TWO separate functions, therefore the "off" call did not work.
```

## Using ENUMs as event names
Since typescript interfaces do not care about the format of field names, you are free to define an ENUM to keep your
existing event names for better discoverability in your IDE:

```typescript
export enum EventNames {
    LOAD,
    UPDATE,
    PLAY,
    PAUSE,
    STOP
};

interface AppEvents {
    [EventNames.LOAD]: {
        filename: string;
        format: string;
        totalTimeMs: number;
    },
    [EventNames.UPDATE]: {
        currentTimeMs: number;
    },
    [EventNames.PLAY]: void,
    [EventNames.PAUSE]: void,
    [EventNames.STOP]: void
}
```

This way, you can call your triggers and subscriptions like this:

```typescript
eventSystem.trigger(EventNames.PLAY);

eventSystem.on(EventNames.UPDATE, ({currentTime}) => {
    console.log(`Current time: ${currentTime}`);
});
```
