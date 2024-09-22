---
title: Maximizing Security and User Experience in OAuth flow on a SvelteKit app
slug: maximizing-security-user-experience-oauth-sveltekit
publishTime: "2024-09-22 11:00:00"
description: Discover how to implement a robust OAuth flow in a SvelteKit application, focusing on enhancing both security measures and user experience. Learn about leveraging the state parameter, preventing CSRF attacks, and creating a smoother authentication process.
tags: ["oauth", "sveltekit", "authentication", "security", "user-experience", "web-development", "csrf-protection"]
---
# Maximizing Security and User Experience in OAuth flow on a SvelteKit app

![An image of an ancient castle](./header.webp)

As a web developer, I've implemented OAuth flows in various applications over the years. However, my last deep dive into OAuth was a couple of years ago. Recently, I had the opportunity to implement OAuth in a SvelteKit project, which led me to revisit and refine my approach to authentication, with a renewed focus on enhancing both security and user experience.

## A Quick Note on User Experience

While working on this OAuth integration, I was reminded of a frustration I've encountered as a user. Often, when returning to a web service I haven't used in a while, I'm unsure whether I originally signed up with email/password or through an OAuth provider. 

Choosing the OAuth option in these situations sometimes results in the unexpected creation of a new account, without any warning or confirmation. This can lead to confusion and accidental account duplication.

This realization influenced my approach when implementing OAuth in my current project. I wanted to create a system that clearly differentiates between login and registration, providing a smoother and more intuitive experience for users.

## The OAuth Challenge

OAuth is a powerful authentication protocol, but it comes with its own set of challenges. One common issue is the ambiguity between user registration and login – many implementations don't differentiate between these actions, potentially leading to user confusion and sometimes security risks.

## The State Parameter: A Key Player in OAuth Security

Before diving into the implementation details, it's crucial to understand the role of the 'state' parameter in OAuth flows. The state parameter is a security feature that helps prevent cross-site request forgery (CSRF) attacks and maintains application state across the authentication process.

For a comprehensive understanding of the state parameter and its importance, I recommend reading [this article of Auth0](https://auth0.com/docs/secure/attack-protection/state-parameters) about the topic.

## My Approach: Leveraging the State Parameter

In my implementation, I decided to use the state parameter not just for security, but also to enhance the user experience. Here's how I approached it:

1. I include both a CSRF token and an 'intent' in the state object.
2. The 'intent' can be either `login` or `register`, depending on which action the user was attempting.
3. When the OAuth provider redirects back to the application, I use this intent to determine how to handle the authentication.

Here's a snippet of how I set up the OAuth initiation using pseudocode:

```typescript
const csrfToken = generateCSRFToken(); // Stored in a httpOnly cookie
const intent = user.isOnRegisterPage ? 'register' : 'login';
const state = JSON.stringify({ csrfToken, intent });

// Store CSRF token in a httpOnly cookie for enhanced security
cookies.set('csrfToken', csrfToken, { httpOnly: true, secure: true, sameSite: 'strict' });

// Redirect to OAuth provider with state parameter
redirect(createOAuthLink("discord", csrfToken, state));
// https://discord.com/oauth2/authorize?client_id=...&response_type=code&redirect_uri=...&state={"csrfToken": "...", "intent": "login"}
```

## Security Considerations

Security was a top priority in my implementation. Here are some key security features:

1. **CSRF Protection**: I use a CSRF token stored in a httpOnly cookie and included in the state parameter to prevent cross-site request forgery attacks.

2. **Server-Side Verification**: All OAuth logic is handled server-side in the API, reducing the risk of client-side manipulation.

3. **Pre-Registration Tokens**: For new users attempting to log in, I generate a short-lived pre-registration token, adding an extra layer of security.

Here's how I handle the OAuth callback in the SvelteKit server route:

```typescript
export const GET: RequestHandler = async ({ params, url, cookies, locals }) => {
    const { provider } = params;
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const storedState = cookies.get('csrfToken');

    // Clean up CSRF token
    cookies.delete('csrfToken', { path: '/' });

    try {
        if (!provider || !code || !state || state !== storedState) {
            throw new Error("Invalid OAuth parameters");
        }

        const { intent } = JSON.parse(atob(state));
        // The apiClient is a thin wrapper over the REST API of my service
        const result = await locals.apiClient.auth.oauth(provider, code, intent);

        if ('sessionToken' in result) {
            setSessionTokenCookie(cookies, result.sessionToken);
            return redirect(303, '/dashboard');
        } else if ('preRegistrationToken' in result) {
            cookies.set('prt', result.preRegistrationToken, { 
                path: '/', 
                httpOnly: true, 
                maxAge: 600, // 10 minutes
                sameSite: 'strict'
            });
            return redirect(303, '/confirm-registration');
        }

        throw new Error("Unexpected response from OAuth endpoint");
    } catch (err) {
        console.error('Authentication error:', err);
        return redirect(303, '/oauth-fail');
    }
};
```

## Enhancing User Experience

This implementation aims to improve the user experience in several ways:

1. **Clear User Journey**: By differentiating between login and registration intents, users always end up where they expect to be.

2. **Preventing Accidental Registrations**: Users attempting to log in won't accidentally create a new account if they don't have one.

3. **Smooth Registration Process**: New users going through the registration flow get a streamlined experience.

4. **Informative Feedback**: Users receive clear messages about their account status, reducing confusion.

## The Benefits

This OAuth implementation offers several advantages:

1. **Enhanced Security**: By handling OAuth server-side, implementing CSRF protection, and using httpOnly cookies, I've created a more secure authentication system.

2. **Improved User Experience**: Users have a clear path whether they're logging in or registering, reducing confusion and frustration.

3. **Flexibility**: The system can easily handle multiple OAuth providers while maintaining consistent behavior.

4. **Compliance Ready**: This approach helps in meeting various regulatory requirements by ensuring user consent in the registration process.

## Conclusion

Revisiting OAuth implementation after a few years was a refreshing experience. It reminded me that authentication is an ever-evolving field, and there's always room for improvement in both security and user experience.

This implementation in SvelteKit demonstrates that with careful consideration, we can create authentication flows that are both secure and user-friendly. The key lies not just in the technical implementation, but in how well it serves and protects the users.

Remember, while this approach worked well for my project, every application has unique needs. Always consider your specific requirements and consult the latest security best practices when implementing authentication in your projects.

By sharing my approach, I hope to contribute to a discussion on how we can make authentication processes more user-friendly and secure, preventing the kind of confusion and accidental account creation that I've experienced far too often.

Happy coding!