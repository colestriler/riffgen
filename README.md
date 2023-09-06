# Riffgen.com

The world of AI has arrived for music. Generate custom riffs in seconds, powered by the latest AI models and 100% free.

Under the hood, we use Facebook Research's [musicgen](https://replicate.com/facebookresearch/musicgen) model hosted on Replicate and plan on adding support for additional models in the near future.

![img_1.png](./public/img_1.png)
# Running Locally
This repo was initially a clone of the [Supabase Starter](https://vercel.com/templates/next.js/supabase) template from Vercel.

## Setup
Run `yarn install` to install the dependencies and create a `.env.local` file with the necessary variables defined in the example environment file.

You'll also need to:
- Setup a Google Auth client
- Create a Supabase project
- Create a Bytescale account (for file storage)
- Create a Replicate account


## Database migrations
Sources: [Managing Environments (by Supabase)](https://supabase.com/docs/guides/cli/managing-environments)

There are a series of steps you need to do in order to make a change to the database.

1. First make the changes in Supabase Local Studio  (http://localhost:54323/). When you make a change locally, Supabase will automatically create and run the relevant SQL to modify your local database. But to capture these changes so we can apply them to our staging and production databases, we need to diff the database.
2. Run `supabase db diff -f <migration_name>`. You can name the migration whatever you want. Once you run this, you'll see a new file created in `/supabase/migrations`. 
3. Deploy your code. That's it!

Our [Github worklows](./.github/workflows/production.yaml) will take care of applying these migrations to our staging & production databases.

**Note**: after making a schema change, you should run `yarn gen:local` (see [package.json](./package.json)) to generate the typed `Database` object. See `/lib/types.supabase.ts`.