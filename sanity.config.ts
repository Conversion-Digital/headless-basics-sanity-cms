import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
console.log("Sanity Project ID sanity.config.ts :", process.env.PROJECT_ID);
export default defineConfig({
  name: 'default',
  title: 'SanityShowcase',
  projectId: process.env.PROJECT_ID?.toLowerCase() || '',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})