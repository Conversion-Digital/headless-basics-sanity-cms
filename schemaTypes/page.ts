import { defineField, defineType } from 'sanity'
import { definePageType } from '@q42/sanity-plugin-page-tree'
import SanityGrid from '../grid/SanityGrid'
import { basic } from '../grid/basic'
import { pageTreeConfig } from '../pageTreeConfig'

const customItemFields = [
  {
    title: 'Username',
    name: 'username',
    type: 'string'
  },
  {
    title: 'Profile Photo',
    name: 'userimg',
    type: 'image'
  }
]

export const pageFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
  }),
  defineField({
    name: 'description',
    title: 'Description',
    type: 'text',
  }),
  defineField({
    name: 'level',
    title: 'Level',
    type: 'string',
    options: {
      list: [
        { title: '1', value: '1' },
        { title: '2', value: '2' },
        { title: '3', value: '3' },
        { title: '4', value: '4' },
        { title: '5', value: '5' }
      ]
    }
  }),
  defineField({
    name: 'sortOrder',
    title: 'Sort Order',
    type: 'number'
  }),
  defineField({
    name: 'showInNavigation',
    title: 'Show in Navigation',
    type: 'boolean'
  }),
  defineField({
    name: 'seo',
    title: 'SEO',
    type: 'seo'
  }),
  defineField({
    name: 'meta',
    title: 'Meta Data',
    type: 'pageMeta'
  }),
  defineField({
    title: 'Sanity Grid',
    name: 'sanitygrid',
    type: 'object',
    groups: [
      { name: 'visual', title: 'Grid Visual' },
      { name: 'settings', title: 'Grid Settings' }
    ],
    fields: [
      {
        group: 'visual',
        name: 'grid',
        type: 'array',
        of: [
          {
            title: 'Grid Item',
            name: 'griditem',
            type: 'object',
            fields: [
              ...customItemFields,
              {
                name: 'settings',
                type: 'object',
                fields: [...basic.item]
              }
            ],
            preview: {
              select: {
                title: 'username',
                media: 'userimg'
              }
            }
          }
        ],
        components: {
          input: SanityGrid
        }
      },
      {
        group: 'settings',
        name: 'layoutSettings',
        type: 'object',
        title: 'Layout Settings',
        fields: [
          {
            name: 'columns',
            type: 'number',
            title: 'Columns'
          },
          {
            name: 'spacing',
            type: 'string',
            title: 'Spacing'
          }
        ]
      }
    ]
  }),
  defineField({
    name: 'components',
    title: 'Components',
    type: 'array',
    of: [
      { type: 'hero' },
      { type: 'toggle' },
      { type: 'textBlock' },
      { type: 'motto' },
      { type: 'accordion' },
      { type: 'gridBlock' } // Added the new gridBlock here
    ],
  }),
]

const _pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: pageFields,
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})

export default definePageType(_pageType, pageTreeConfig)