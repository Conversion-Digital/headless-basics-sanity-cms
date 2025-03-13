import {defineCliConfig} from 'sanity/cli'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
console.log("[sanity.cli.ts][7] Sanity Project ID  :", projectId); 
export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
