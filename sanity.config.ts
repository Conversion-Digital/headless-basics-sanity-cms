import { defineConfig } from 'sanity'
import { StructureBuilder, structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { createPageTreeDocumentList } from '@q42/sanity-plugin-page-tree'
import { pageTreeConfig } from './pageTreeConfig'

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
        ),
      S.divider(),
      S.listItem()
        .title('Components')
        .child(
          S.list()
            .title('Components')
            .items([
              S.documentTypeListItem('hero'),
              S.documentTypeListItem('heroButton'),
              S.documentTypeListItem('textBlock'),
              S.documentTypeListItem('seo'),
              S.documentTypeListItem('pageMeta'),
              S.documentTypeListItem('toggle'),
              S.documentTypeListItem('motto'),
              S.documentTypeListItem('gridBlock'),
            ])
        )
    ])

export default defineConfig({
  name: 'default',
  title: 'SanityShowcase',
  projectId: process.env.PROJECT_ID?.toLowerCase() || '',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, {currentUser, creationContext}) => {

      return prev;
    }
  },
  beta: {
    create: {
      fallbackStudioOrigin : "http://localhost:3333"
    }
  }
})