import { defineConfig } from 'sanity'
import { StructureBuilder, structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { createPageTreeDocumentList } from '@q42/sanity-plugin-page-tree'
import { pageTreeConfig } from './pageTreeConfig'
import { AddCircleIcon } from '@sanity/icons'

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
              S.divider(),
              S.listItem()
                .title('Add Component')
                .icon(AddCircleIcon)
                .child(
                  S.list()
                    .title('Select Component Type')
                    .items([
                      S.listItem()
                        .title('Hero')
                        .child(
                          S.editor()
                            .id('create-hero')
                            .schemaType('hero')
                            .documentId('create-hero')
                        ),
                      S.listItem()
                        .title('Hero Button')
                        .child(
                          S.editor()
                            .id('create-heroButton')
                            .schemaType('heroButton')
                            .documentId('create-heroButton')
                        ),
                      S.listItem()
                        .title('Text Block')
                        .child(
                          S.editor()
                            .id('create-textBlock')
                            .schemaType('textBlock')
                            .documentId('create-textBlock')
                        ),
                      S.listItem()
                        .title('SEO')
                        .child(
                          S.editor()
                            .id('create-seo')
                            .schemaType('seo')
                            .documentId('create-seo')
                        ),
                      S.listItem()
                        .title('Page Meta')
                        .child(
                          S.editor()
                            .id('create-pageMeta')
                            .schemaType('pageMeta')
                            .documentId('create-pageMeta')
                        ),
                      S.listItem()
                        .title('Toggle')
                        .child(
                          S.editor()
                            .id('create-toggle')
                            .schemaType('toggle')
                            .documentId('create-toggle')
                        ),
                      S.listItem()
                        .title('Motto')
                        .child(
                          S.editor()
                            .id('create-motto')
                            .schemaType('motto')
                            .documentId('create-motto')
                        ),
                      S.listItem()
                        .title('Grid Block')
                        .child(
                          S.editor()
                            .id('create-gridBlock')
                            .schemaType('gridBlock')
                            .documentId('create-gridBlock')
                        ),
                    ])
                )
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Structure')
        .child(
          S.list()
            .title('Structure')
            .items([
              S.documentTypeListItem('footerStructure')
            ])
        )
    ])

console.log("[sanity.config.ts][125] ", import.meta.env);
console.log("[sanity.config.ts][129] Sanity Project ID  :", import.meta.env.SANITY_STUDIO_PROJECT_ID); 
export default defineConfig({
  name: 'default',
  title: 'SanityShowcase',
  projectId: (import.meta.env.SANITY_STUDIO_PROJECT_ID as string).toLowerCase(),
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev, { currentUser, creationContext }) => {
      return prev;
    }
  },
  beta: {
    create: {
      fallbackStudioOrigin: "http://localhost:3333"
    }
  }
})