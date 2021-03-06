# Mocking modules with jest and typescript
Since it took me some time to understand the behaviour and the jest docs don't tell much about it, I wanted to write down how to mock
modules with jest and especially update the return values of module functions across your tests.

Consider you want to test a function called `someFunctionToTest` from a module called `moduleA`:
```typescript
import {someFunctionToTest} from "moduleA";

test("It does something", () => {
    expect(someFunctionToTest()).toEqual({something: true});
});
```

Now you notice that the function relies on calling the method `helper` from `moduleB`. You want to mock that function
and simulate a return value:

```typescript
import {someFunctionToTest} from "moduleA";
import {helper} from "moduleB";

jest.mock("moduleB");

test("It does something", () => {
    (helper as jest.Mock).mockReturnValue(true);
    expect(someFunctionToTest()).toEqual({something: true});
});

test("It does something else", () => {
    (helper as jest.Mock).mockReturnValue(false);
    expect(someFunctionToTest()).toEqual({something: false});
});
```

The trick - and its a bit counter-intuitive - is to import the mocked function as well. See line 2 where we import the `helper` method
into our test file. This is acutally the mock function. The reason is that jest does some code shifting and altough the call to `jest.mock` 
occures later, it will be executed before any imports are made. Therefore, `helper` is an instance of `jest.fn()` in our test file.

Now we can update the return values of our mocked function by calling `mockedFunction.mockReturnValue()`. There is only one catch: typescript
will complain that the imported `helper` has no function `mockReturnValue` to be called. Thats because typescript does not know that `helper`
is not the real thing but a mocked function. We can get around it by casting the type locally to `jest.Mock`. 
