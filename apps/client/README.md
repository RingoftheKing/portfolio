This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server after having started up backend Server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

You may need to start the server on port 3001 or above depending on port availability. 

Visit `http://localhost:<your_port>` to see your app

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Vercel Default ReadMe content

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## An oddity of this codebase
Despite this being a Next.js codebase, the server is separate and lives in a separate container.

## Troubleshooting 

### "Javascript ran out of heap error"
1. Check your script doesn't append api which causes nginx to keep redirecting.

### "Fetch happens on localhost:<port> failing"
1. Ensure you are accessing via nginx, i.e. only access via port 80 default
2. Check the error message in Network Tools

#### Note 1
⚠️ Due to copying of files in `client/DockerFile` .env.local will be copied and will accidentally serve localhost:3000 EVEN IF you inject environments in `docker-compose.yml`

✅ You should just use /api as the base url directly. Current method rewrites /api to fetch from localhost:3000 where server lives.

#### Note 2
⚠️ Accidentally using fetches without `use client` and `useEffect` blocks. Rule is to never have async for client or it will not render right.

#### Note 3
Checking the network tab may be confusing. Even if a request is forwarded to server like "localhost:3000" it will still show in Network Tab as coming from "localhost:3002"

Long winded explanation:
>Because fetch('/api/projects') is a relative URL. In the browser, a relative URL resolves against the page’s current origin, so if the client app is running on http://localhost:3002, the request becomes http://localhost:3002/api/projects

>Next’s rewrite runs after the request reaches the Next server. So the client will never see the change to 3000

#### Sub problems faced
1. Prisma isn't initiated correctly and has no relations (A prisma.relation doesn't exist)

