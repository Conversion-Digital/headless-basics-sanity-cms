import {defineCliConfig} from 'sanity/cli'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
console.log("[sanity.cli.ts][7] Sanity Project ID  :", projectId); 
const sanityConfig = defineCliConfig({
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

const studoHostSetting = process.env.SANITY_STUDIO_HOST as string
if(typeof(studoHostSetting) !== "undefined" && studoHostSetting.length > 0) {
  // Custom handling for studioHost
  console.log("[sanity.config.ts][149] Studio Host Setting:", studoHostSetting);
  sanityConfig.studioHost = studoHostSetting;
}

export default sanityConfig
