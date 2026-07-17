# Tips on how to do certain ops in prisma
[Altering a Column Name](#changing-a-column-name)

## Changing a Column Name
Prisma usually does Drop and Add causing renames to throw all your shit away. Do this instead:

> `npx prisma migrate dev --create-only`

Go to `prisma/migrations` and find the latest migration.

Manually change the `DROP` operation to `RENAME` + `TO` 

Finally finish it by running
> ```npx prisma migrate dev```

