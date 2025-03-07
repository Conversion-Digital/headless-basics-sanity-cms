import { defineConfig } from 'sanity'
import { StructureBuilder, structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { createPageTreeDocumentList } from '@q42/sanity-plugin-page-tree'
import { pageTreeConfig } from './pageTreeConfig'
import { grid } from './grid/plugin'

const structure = (S: StructureBuilder) =>
  S.list()
    .title('Website')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          createPageTreeDocumentList(S, {
            config: pageTreeConfig,
            extendDocumentList: (builder) =>
              builder.id('pages').title('Pages').apiVersion(pageTreeConfig.apiVersion),
          })
        )
    ])

export default defineConfig({
  name: 'default',
  title: 'SanityShowcase',
  projectId: process.env.PROJECT_ID?.toLowerCase() || '',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool(), grid()],
  schema: {
    types: schemaTypes,
  },
  beta: {
    create: {
      fallbackStudioOrigin : "http://localhost:3333"
    }
  }
})