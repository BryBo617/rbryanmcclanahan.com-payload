// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import nodemailerSendgrid from 'nodemailer-sendgrid';

import path from 'path';
import { buildConfig, PayloadRequest } from 'payload';
import sharp from 'sharp'; // sharp-import
import { fileURLToPath } from 'url';

import { defaultLexical } from '@/fields/defaultLexical';
import { Ads } from './collections/Ads';
import { Categories } from './collections/Categories';
import { Media } from './collections/Media';
import { Pages } from './collections/Pages';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { Footer } from './Footer/config';
import { Header } from './Header/config';
import { plugins } from './plugins';
import { getServerSideURL } from './utilities/getURL';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {},
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  email: nodemailerAdapter({
    defaultFromAddress: 'noreply@rbryanmcclanahan.com',
    defaultFromName: 'No Reply',
    // Nodemailer transportOptions
    transportOptions: nodemailerSendgrid({
      apiKey: process.env.SENDGRID_API_KEY || '',
    }),
  }),
  db: vercelPostgresAdapter({
    migrationDir: './src/migrations',
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Ads],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization');
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    tasks: [],
  },
});
