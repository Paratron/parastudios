---
title: Media Query organization in SASS
slug: media-query-organization-in-sass
publishTime: "2021-11-19 12:55:10"
description: SASS makes working with media queries / breakpoints easy, if you apply this pattern
tags: ["quick-tip", "frontend", "sass", "ui", "css", "media-query", "breakpoint", "pattern", "code-organization"]
---
# Media Query organization in SASS
![Media queries are important building blocks of your css](stones.jpg)

This is a quick tip we are using at work. Its not a big thing but I saw many complicated patterns and even extensions for handling breakpoints floating around in the web - so I wanted to share this pattern that can be used with native SASS features.

## The problem
Especially in module/component based development, you end up with a lot of separete SASS files - and many of the components need to adapt in some way to screen size. Its very tiresome having to write out media queries in all your sass files:

```scss
.myComponent{
	font-size: 16px;
	
	@media screen and(min-width: 768px){
		font-size: 12px;
	}
}
```

There are more problems with using media queries directly like this:
- You have to read and understand when the media query will be applied
- If you want to update a breakpoint at some point, you have to replace it everywhere
- If you have several breakpoints, it gets even more hairy

## Preparation
Create a file for your breakpoints and store the part after `@media` in a string variable like this:

_breakpoint.scss_
```scss
$onDesktop: "screen and (min-width: 768px)";  
$onMobile: "screen and (max-width: 767px)";
```

How you want to name your breakpoints is completely up to you. Maybe you prefer something like `bigScreen` and `smallScreen` You may also add as many breakpoints as you like.

## Applying the pattern
To apply the media queries, import the breakpoint file and then use the variables like this:
```scss
@import "breakpoint.scss";

@media #{$onDesktop}{
	/* your styles for desktop /*
}
```

Imho, it really helps not having to mentally parse what the media query does. You read `@media #{$onDesktop}` and you know this block should only appear on big screens.

This especially helps with mobile-first designs:

```scss
@import "breakpoint.scss";

.myElement{
	font-size: 16px;
	
	@media #{$onDesktop}{
		font-size: 12px;
	}
}
```

I was unable to get rid of the `@media` prefix, but I think its not that big of a problem having to type that out - it also helps understanding whats going on.
