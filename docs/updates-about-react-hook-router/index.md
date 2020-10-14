# Updates about react hook router

![Version 1.2.1](./header.jpg)

It's been about a month, since I released my initial version of hookrouter
[https://www.npmjs.com/package/hookrouter]. Lots of things happened since then.

First of all: thanks for all the feedback and love I received for publishing the
project. Lots of comments and upvotes on reddit, tons of tweets, several
mentions in big react newsletters! This motivated me a lot to keep working and
improving on the initial version. Today, I released version 1.2.1 of hookrouter
[https://www.npmjs.com/package/hookrouter]  on npm. 

Improved documentation
I sat down and wrote docs about every feature contained in the package and how
to use them. Since I could not decide on a documentation system right now, the
docs are hosted simply as hypertext formatted markdown inside the github project
[https://github.com/Paratron/hookrouter/blob/master/src-docs/pages/en/README.md]
. But now about the new stuff:

Intercepting Navigation Intents
This was probably one of the most asked for features that made it into the
package. You can now prevent the user from navigating away from a given route
completely. Or you can delay the navigation. Or you can rewrite it. Lots of
possibilities! One user mentioned that he used the feature to implement page
transition animations with just a couple lines of code
[https://github.com/Paratron/hookrouter/issues/47#issuecomment-487213281].
Usually you would use it to prevent your user to accidentially navigate away
from unsaved changes.

While there is a very granular possibility to intercept navigation
[https://github.com/Paratron/hookrouter/blob/master/src-docs/pages/en/03_navigation.md#intercepting-navigation-intents]
, most users will certainly rely on the useControlledInterceptor()  hook:

const GuardedForm = () => {
    const [nextPath, confirmNavigation, resetPath, stopInterception] = useControlledInterceptor();

    const handleSubmit = () => {
            saveData();
            stopInterception();
            navigate('/success');
    };

    return (
        <React.Fragment>
            {nextPath && (
                <ConfirmPopup
                    onConfirm={confirmNavigation}
                    onCancel={resetPath}
                />
            ) }
            <form onSubmit={handleSubmit}>
                ...
            </form>
        </React.Fragment>
    );
}


This is all code you need to cancel a user navigation, ask if he's sure he want
to leave and let him continue editing, if not. All with custom confirmation UI.

Utilizing URL Query Parameters
While it is not used for routing directly, utilizing query parameters comes in
handy when you want to mirror parts of your application state into the URL to
enable your users to copy them. If you have for example a product overview page
and want to provide controls to filter it - its handy to put the filter values
into the URL.

I added a useQueryParams()  hook that will return those query parameters as
javascript object. And you can even update the params using the hook - causing
all components that hooked into the params to re-render. Its a bit like a
globally shared state hook, but shhhh - dont misuse it! ?

const SearchWidget = ({onSearch}) => {
    const [queryParams, setQueryParams] = useQueryParams();
    
    const {
        // Use object destructuring and a default value
        // if the param is not yet present in the URL.
        q = ''
    } = queryParams;
    
    const [searchBuffer, setSearchBuffer] = React.useState(q);
    
    const searchHandler = () => {
        setQueryParams({q: searchBuffer});
    }
    
    return (
        <div>
            <input type="search" value={searchBuffer} onChange={(e) => setSearchBuffer(e.currentTarget.value)} />
            <button onClick={searchHandler}>Search now</button>
        </div>
    );
}


Serverside Rendering
Rendering your application serverside in a node environment is now also
possible. SSR was also one of the first features users asked for, since its
important for SEO or just being nice to users with JS disabled and/or slow
network.

You can set the path name before rendering in react and the router will honor it
even in node:

const React = require('react');
const {renderToString} = require('react-dom/server');
const hookrouter = require('hookrouter');

hookrouter.setPath('/product');

import App from './App';

const result = renderToString(<App/>);

console.log(result);


Internal redirects will also be applied and can - if needed - be read again from
the router to perform actual HTTP redirects. Read more about serverside
rendering
[https://github.com/Paratron/hookrouter/blob/master/src-docs/pages/en/05_serverside-rendering.md]
.

Other Features
Last, but not least:

 * You need to know which path your app is working on, right now? Use the 
   usePath()  hook. Its also updating your component on path changes, if you
   want to
   [https://github.com/Paratron/hookrouter/blob/master/src-docs/pages/en/04_other-features.md#using-the-uri-path]
   .
 * Updating the window title, when a certain route has been loaded? No problem.
   Call useTitle('About me')  and you are set. If your component is unmounted,
   the app returns to the previous title, automatically.
 * A basepath  can now be set
   [https://github.com/Paratron/hookrouter/blob/master/src-docs/pages/en/03_navigation.md#setting-a-base-path] 
    and will be ignored during routing. Call setBasepath('/fancypants')  before
   your app runs and you are safe.
 * Performance updates to reduce unnecessary renders and decide on and render
   routes faster have been made

Upgrade to hookrouter@1.2.1  today, to use all those features. The bundle size
grew from the initial 1.8kb  to about 3.2kb, but hey - thats still only 30% of 
react-router-dom  ?

You can upvote and comment on this article on reddit
[https://www.reddit.com/r/reactjs/comments/bj3n4i/updates_about_react_hook_router/] 
 or hacker news [https://news.ycombinator.com/item?id=19787995]. I'd appreciate
if you did spread the word ✌️
