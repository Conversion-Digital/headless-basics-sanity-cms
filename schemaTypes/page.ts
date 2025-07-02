import { defineField, defineType } from 'sanity'
import { definePageType } from '@q42/sanity-plugin-page-tree'
import { pageTreeConfig } from '../pageTreeConfig'

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
    name: 'components',
    title: 'Components',
    type: 'array',
    of: [
      { type: 'hero' },
      { type: 'toggle' },
      { type: 'textBlock' },
      { type: 'motto' },
      { type: 'gridBlock' },
      { type: 'carousel' },
      { type: 'herobanner' },
      { type: 'cdfooter' },
      { type: 'cdnav' },
      { type: 'cdinsights' },
      { type: 'cdservices' },
      { type: 'cdtestimonials' },
      { type: 'cdmission' },
      { type: 'cdpartners' },
      { type: 'cdclients' },
      { type: 'cdcasestudies' },
      { type: 'cdcta' },
      { type: 'cdintroduction' },
      { type: 'cdstatistics' },
      { type: 'cdfaqs' },
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