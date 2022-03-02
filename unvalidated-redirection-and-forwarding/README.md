# Unvalidated redirection

## Principle

The Unvalidated Redirection vulneraility happens when a trusted website uses a redirection without checking the destination, with the redirecton location being built in the client's request.

For example, imagine a website that has a URL like this one:

```http
https://trustedWebsite.com/login?redirect=/home
```

And the website uses the content of the query parameters to redirect the user to the right location.

An attacker could change the redirection URL to a malicious website or script by changing the parameters like so:

```http
https://trustedWebsite.com/login?redirect=http://evil.com
```

And if the trusted website doesn't an URL whitelist, or does not validate in any way that the redirection is legit, then we're in trouble.

This attack is often used in conjunction with a social engineering attack, and this is what we have tried to simulate here in this POC.

## Our implementation of the unvalidated redirection

### Install the app

To install the app, go to the root of this directory and run:

```shell
npm install
```

### Runing our project

To simulate this attack we have written two web servers, one evil and a trusted one. Of course the trusted one has the vulnerability for one of its endpoints.

To run the simulation you will need to run both servers.

#### 1. Running the evil server:

```bash
npm run evil
```

#### 2. Running the trusted server:

```bash
npm run trust
```

Once everything is installed and the app is running, the page is accessible at this URL:

http://localhost:8080/

### The simulation

Let's say that you are using you favorite website `localhost:8080`.

Here is the page you are used to:

![trusted website home page](./img/trust-webpage.png)

Now imagine that you recive an email like this one:

![trusted email (phishing ?)](./img/evil-mail.png)

> Here it is a website, but the email could easily be an HTML page, so let's imagine that it is a normal email.

When you recieve this email everything look normal to you, and there is a simple link. You know that clicking a link recieved by email is not the safest thing to do, so you check the link before.

- In the green rectangle, you immediatly notice that the link will direct you to your usual `localhost:8080` trusted website. So no need to look further.
- **And that's where you are wrong !!** You did not notice the last parameter in the red rectangle...

If you had taken a bit more time, you would have seen that the full link URL is:

```http
http://localhost:8080/redirect?user=wefqQWEFwdqwqQwfqfq1fTGWRW$5wrgwEGHryw&randomParam=12345&url=http://localhost:6660
```

And if you remove all unnecessary parameter that were here to foul you, you can see the real redirection URL

```http
http://localhost:8080/redirect?url=http://localhost:6660
```

Since your trusted website does not have protection against Unvalidated Redirections, you have now been redirected to the evil website:

![evil home page](./img/evil-webpage.png)

From here on out, everything is possible. The attacker could make a fake website to steal your credentials, or simply run a js script on your machine.

## Prevent unvalidated redirection

There are several ways to prevent an Unvalidated Redirection attack:

- Not using forwards and redirects (of course),
- Not allowing URLs as user input for a destination (**DO NOT TRUST THE USER**),
- Creating a whitelist of all trusted URLs including hosts, or using a regex-based one,
- Forcing all redirects to first lead to a page that notifies users that they are redirected out of the website.
