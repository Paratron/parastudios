# Simple sessions with nextJS

nextJS doesn't have a mechanism for handling server side sessions out of the box. In order to keep users authenticated or
provide multi-step forms across several pages, you need sessions. I'll explain how you use sessions in nextJS in this article. 

## What are nextJS sessions, why do I need them? 
There are cases where you want to keep some data about a user that is connected to the users while they navigate across
your site and move across several pages. A user session is a good example. The users provide their login data on a login
page, it will be verified, and the server remembers the individual users while they navigate around.

The information _which_ user is authenticated need to be kept server side, because the server needs it to verify
if the user can access certain information or perform actions. If the information is kept in the browser and sent to the 
server, its easy to manipulate and masquerade as a different user.

Other things like items in a shopping basket are a good candidate to be kept in a user session as well.

You never know if a user left your site or just stays on a certain page for a long time. Or maybe his network connection
drops for a short time and the user reconnects through a different connection. Because of that, session data must be kept
for some time. The timeout for such sessions can be very different based on the context. Your shopping cart session might
be preserved for days, in case you return to the shop. But your bank will certainly already drop your session after ten minutes. 

[excalidraw session functionality diagram]
[More information about how sessions are handled over HTTP can be found on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Session).

The HTTP protocol is stateless. This means that the server cannot who requested which document by default. To solve this problem,
usually the browser sends a cookie along with each request which contains a unique identifier that remains the same across
all navigation and requests. This identifier needs to be a random string or number of enough entropy, so it cannot be guessed.
If someone is able to guess the session id and copies it - the server cannot know if the requests are legitimate, or a session has been stolen.
Since the cookies with the session id are sensitive data, you should only use sessions over https connections. Otherwise,
the cookies could be captured and stolen.

## Enabling server side sessions in nextJS
There is no built-in server side session mechanism in nextJS at the moment. You need to install a separate module from npm to 
add this functionality to your nextJS project. I created [`next-server-session`](https://www.npmjs.com/package/next-server-session)
to add server side session functionality to a nextJS 10.x+ project I am working on right now.

## Configuring nextJS sessions
The module requires to be initialized and configured once when your nextJS instance boots. This is being done in your `next.config.js` file.
If no such file exists in your project folder, you can create the file and paste the following content:

```javascript
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
    if(phase === PHASE_PRODUCTION_SERVER || phase === PHASE_DEVELOPMENT_SERVER){
        require("next-server-session").configure();
    }

    return defaultConfig;
}
```
Since the next config is used for several purposes in your nextJS project, we need to tell next that we only want to initialize
the sessions feature when a development or production server instance is running. This is done through the `phase` argument that
is passed to the configure function. We check if the `phase` is either production server or development server and only initialize
the session module if thats the case.

Calling the `configure()` method without any arguments initializes the session module with default settings: The session data is kept
in memory and a session will expire after 30 minutes without action.

The configure function can be passed an object `{sessionStore, cookieHandler}` which optionally set handlers for getting / setting the session
data and handling the cookie.
  

## Access the session in nextJS page routes
Lets assume you created a page `/shoppingCart` which should display items the user has put into their shopping cart before. We create a
[route in nextJS](https://nextjs.org/docs/routing/introduction) which handles the request. To dynamically pass data to the page components,
we create a [`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) method.

```typescript
export async function getServerSideProps(context: GetServerSidePropsContext){
    const {cart = {}} = await getSessionData(context);
    
    return {
        props: {
            cart
        }   
    }
}
```  

This code tries to fetch the `cart` property from the session and initializes it with an empty object `{}` if the cart property
has not yet been created in the session. The function passes the `cart` array to the page component as a prop to be rendered.

When accessing sessions in `getServerSideProps()` methods, you always need to pass the `context` object from nextJS to the 
session functions. They will figure out if a cookie exists, what session id is being used (if any), fetch or set the session data and  
return a promise. 

A promise is returned because the session store _may_ be asynchronous. While the default in-memory storage is synchronous, the library
has been built with other options in mind. When storing session data on the HDD or in a database, the response will always be async.  

## Use the session in nextJS API routes
To stay with the shopping cart example, we [create an nextJS API endpoint](https://nextjs.org/docs/api-routes/introduction) that places items into our shopping cart:

```typescript
export default async function handler(req: NextApiReqest, res: NextApiResponse){
    const {cart = {}} = await getSessionData(req, res);
    const {articleId, amount} = req.body;
    
    if(await validateArticleId(articleId)){
        cart[articleId] = (cart[articleId] || 0) + amount;
        await setSessionData(req, res, {cart});
        res.end("ok");
        return;
    }
    
    res.statusCode = 400;
    res.end("Bad request");
}
```
What happened here? We fetched the `cart` object from the session - if there is any. The API endpoint requires two arguments:
`articleId` and `amount`. We validate, if the article id is valid and can be placed in the chart with `validateArticleId()` (you
would need to write that function yourself).

The idea of the `chart` objects design is that the object keys hold the article id while the object values keep the amounts. Therefore,
we use the existing amount (if any) or zero when the article is new in the chart and add the requested amount on top.

After that, we write our cart back to the session. 

Note that we don't have a `context` object like in `getServerSideProps()` functions available. We pass the `req` and `res` objects to 
the session functions instead. 


## Setting nextJS session data
There are two methods to write data to your session: `setSessionData()` and `replaceSessionData()`. 

The one I mostly use is `setSessionData()` like in the example above. The function takes an object and merges it into the
existing session object. If no session exists, a new one will be created. I prefer this method because one place that writes
data to the session does not need to know about other places and which data they are writing to the session. You will only overwrite
local parts of the session and not accidentally destroy something else.

That is the case with `replaceSessionData()`. It also takes an object as argument but will replace the whole session data with
that object. This function is still useful when you for example want to switch users and make sure to drop all data from the session
that belonged to the previous user.

Note that the set and replace methods are both asynchronous and return a promise. So if you want to write to your session several
times in one `getServerSideProps()` or API handler, make sure you `await` the finalization of the write process so you don't get
weird effects with invalid session data. 


## Destroying a nextJS session
A session can be deleted along with its cookie by calling the method `destroySession()`. You would do this for example in a logout function.

The default in-memory session store of our nextJS session module has a built in timeout of 30 minutes. 
If session data has not been accessed for reading or updating, it will be garbage collected and removed. 

If users with an existing session cookie return after that amount of time, it will be for them as if they were never there
and just established a fresh session. They will be logged out, or their cart will be empty.  

You can decrease that timeout or even increase it - but keep in mind that a longer timeout means more sessions will be kept
in memory and may overload your server in extreme cases.

Here is an example on how we pass a different timeout configuration to the memory session store. It is being done in the
`next.config.js` upon server startup (we covered the configuration before):

```typescript
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
    if(phase === PHASE_PRODUCTION_SERVER || phase === PHASE_DEVELOPMENT_SERVER){
        require("next-server-session").configure({
            sessionStore: createMemorySessionStore({
                maxSessionAgeMS: 10 * 60 * 1000 // 10 minutes
            })                    
        });
    }

    return defaultConfig;
}
```

We are passing an object to the `configure()` method. The object contains a custom instance of `sessionStore` which is created by
calling the `createMemorySessionStore()` method which is also provided by the module. This function accepts `maxSessionAgeMS` as configuration
which defines how old a session may be before its deleted.

## Where to store the session data?


## Configuring the session cookie
