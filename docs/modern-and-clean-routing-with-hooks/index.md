# Modern and clean routing with hooks

![Crossroads in a sunset](./header.jpg)

A quick experiment about using hooks for routing in a react app turned out to be
very flexible and powerful. I published the module [hookrouter on npm](https://www.npmjs.com/package/hookrouter) for anyone
to use. Let me introduce it to you in this article.

> Update:  Version 1.2.1  has been released with lots of new features and [detailed documentation](https://github.com/Paratron/hookrouter/blob/master/src-docs/pages/en/README.md).

## Installation and module contents
The router module is [published on npm](https://www.npmjs.com/package/hookrouter) 
and can be installed by calling `npm -i hookrouter`. It has zero dependencies and
adds [about 2.9kb to your bundle](https://bundlephobia.com/result?p=hookrouter@1.0.0-beta).

The module contains the hook function useRoutes()  that evaluates your
predefined routes and returns a result. There is also the function navigate(),
which imperatively navigates your application to a new url. useRedirect()  can
be used to automatically forward from one matched url to another url. And last
but not least there is a tiny wrapper around the basic HTML anchor tag which is
accessible as react component `<A />`. Its 100% feature compatible to the native 
`<a />` tag but pushes navigations to the history stack instead of actually
loading a new page.

## Routing basics
You can define your possible routes as an object with urls as keys and result
functions as values. For example: 

```jsx harmony
const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />,
    '/products': () => <ProductOverview />,
    '/products/:id': ({id}) => <ProductDetails id={id} />
};
```

I like this way of defining the routes, since you can see immediately what
routes are there and how they work. If a route matches, the function gets
called. If a route has url attributes (like the id), they will be passed as
argument to the function. In my opinion, this is much cleaner than having to
place <Route />  components all over the place [like its done in React Router](https://reacttraining.com/react-router/web/example/basic),
or decorating your components with props they don't actually consume (and may infuriate your IDE),
[like in Reach Router](https://reach.tech/router/example/basic).

To eventually make your routes work, the whole construct looks like this:

```jsx harmony
import {useRoutes} from 'hookrouter';
 
const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />,
    '/products': () => <ProductOverview />,
    '/products/:id': ({id}) => <ProductDetails id={id} />
};
    
const MyApp = () => {
    const routeResult = useRoutes(routes);
    
    return routeResult || <NotFoundPage />;
}
```

The `useRoutes()` hook consumes the routes object, evaluates them one by one and
checks if they match the current url path. If one of the routes matches, its
function will be called (and evaluating will stop). Whatever is returned from
that function is also returned by the hook function into your functional
component. What makes this approach fast and clear is, that the components
inside the result functions will only be created and rendered, when a route
matches and the result function is being called.

If nothing matched, null  will be returned by the hook. This enables you to
display fallback content like the `<NotFoundPage />`  in the example above, if you
like. Or you simply return the null  value from your functional component -
react is fine with that.

## Sane handling of URL parameters
I decided to follow the example of url parameter formatting that is also used by
React Router and Reach Router: If you put placeholders starting with a colon in
your URL, they are treated as named parameters. In our example, the route 
`/products/:id` contains an `id` parameter. Any URL like these matches here: 
`/products/12`, `/products/afas11kj` or `/products/whatever`. The character sequence
will be terminated by the next `/` character, or the end of the URL string.

You can also use multiple URL parameters, if you want to - just give them
different names: `/products/:id/variants/:variant`.

The similarity ends here, since both React Router and Reach Router auto-magically
apply all URL parameters to the result component. With hookrouter, you have more
control and see clearly what is applied on your component.

The route hook reads all url parameters and puts them into an object, using the
keys you defined in the route. The resulting object will be sent to your result
function:

```jsx harmony
   '/products/:id': ({id}) => <ProductDetails productId={id} />
```

In this example, we use object destructuring to take the id  property from the
props object and then apply it onto our component.

## Nested routes
Lets assume we have a parent application component that should do some basic
routing, like above. We modify it just a little bit (see explanation below).

```jsx harmony
import {useRoutes} from 'hookrouter';
 
const routes = {
    '/': () => <HomePage />,
    '/about': () => <AboutPage />,
    '/products/:id*': ({id}) => <ProductArea productId={id} />
};
    
const MyApp = () => {
    const routeResult = useRoutes(routes);
    
    return routeResult || <NotFoundPage />;
}
```

Note the asterisk `*` at the end of the `/products/:id`  route. This means: "match
everything that starts with `/products/[something]`.

And now, our `<ProductArea />` component can also use routes internally:

```jsx harmony
import {useRoutes} from 'hookrouter';

const routes = {
    '/details': () => <ProductDetails />,
    '/order': () => <OrderForm />
};

const ProductArea = ({id}) => {
    const routeResult = useRoutes(routes);
    
    return routeResult || 'Invalid product area';
}
```

Not that this is exactly the same pattern as you used in the parent component.
All the "magic" is done by the asterisk in the parent route. 

If we for example open the url `/products/12/details`, the first route hook in our
 `<MyApp />` component will match `/products/:id*` and then remove that part of
the url path for nested matches. If you call the next `useRoutes()` inside a
child component, it will not match against the full url path but only against
the part that remains, which would be `/details`. You can nest routes as much as
you like.

## Redirects
Our example from above has a problem: When I call the URL `/products/12`, our
route `<MyApp />` matches and calls an instance of `<ProductArea />` but in
there, nothing would match. Having Invalid product area  printed to the screen
would be the result. Lets redirect users from `/` to `/details` automatically:

```jsx harmony
import {useRoutes, useRedirect} from 'hookrouter';

const routes = {
    '/details': () => <ProductDetails />,
    '/order': () => <OrderForm />
};

const ProductArea = ({id}) => {
    useRedirect('/', '/details');
    const routeResult = useRoutes(routes);
    
    return routeResult || 'Invalid product area';
}
```

We perform the redirect before we match any routes to prevent an unnecessary
re-render of the <ProductArea />  component. With this approach, other
components may just navigate the user to the product area and leave the decision
where user should end up to that component. Other parts of the application do
not need to know about the internals of the product area.

Advanced usage
Since the hook router just calls the result function of a route and returns
whatever is returned directly into your functional component, this enables us to
do a lot more than just blindly return and render components. 

I'd like to expand the example from above to fetch data of the current product
inside <ProductArea>  and forward that data to the child components returned by
the routes.

Lets see how to do that (I'll explain the details below):

```jsx
import {useRoutes, useRedirect} from 'hookrouter';
// This is an assumed custom hook, that returns product data
import {useProduct} from '../productDataHook';

const routes = {
    '/details': () => (productObj) => <ProductDetails product={productObj} />,
    '/order': () => (productObj) => <OrderForm product={productObj} />
};

const ProductArea = ({id}) => {
    const [product] = useProduct(id);

    useRedirect('/', '/details');
    const routeResult = useRoutes(routes);
    
    return routeResult(product) || 'Invalid product area';
}
```

I modified the routes  object just slightly. The result functions now don't
return components that can be immediately rendered by react, but return other
functions, that await a product  object to be given. In the last line of the
component, I am calling routeResult  with the previously obtained product object
- this is passed to the final component, which gets rendered with all data it
needs.

This way we can also combine url parameters and other data. For example, the
order area of the product may have a variant  url parameter which defines the
color or size of the product to be used. A route would look like this:

'/order/:variant': ({variant}) => (product) => <OrderForm product={product} variant={variant} />


Conclusion
At least for me, this feels like a much more flexible and lightweight approach
to React Router or Reach Router. As usual, critics and comments are highly
welcome - you can contribute to this thread on reddit
[https://www.reddit.com/r/reactjs/comments/b3puok/forget_react_router_modern_and_clean_routing_with/] 
 or this thread on hackernews [https://news.ycombinator.com/item?id=19457881].
