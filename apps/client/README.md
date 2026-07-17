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

## Troubleshooting the "Javascript ran out of heap error"
1. Check your script doesn't append api which causes nginx to keep redirecting.