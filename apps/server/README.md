# Quick Start (Server)
This part of the app (service) acts as a server and is a source of truth for both the Admin and Client Apps. 

# REQUIRED: FFMPEG download
When running docker container, get ffmpeg inside it.
## Local Dev
> This MUST run first on port 3000  

`npm run dev`

## Docker
You can just build from the root folder, all configs have correctly been setup. 

# History of Issues faced
## Linting errors for PrismaClient 
When trying to RENAME a model, TypeScript may go out of date. Perform these steps.
1. `npx prisma generate`
1. GOTO `seed.ts` or whatever file that uses `PrismaClient` and enter in Command Palette
`Typescript: Restart TS server`