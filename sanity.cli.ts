import {defineCliConfig} from 'sanity/cli'
import * as dotenv from 'dotenv'
import { projectId } from './env';

// Load environment variables
dotenv.config()

console.log("Sanity Project ID sanity.cli.ts :", process.env.PROJECT_ID); // Debugging

export default defineCliConfig({
  api: {
    projectId: process.env.PROJECT_ID?.toLowerCase() || projectId,
    dataset: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
