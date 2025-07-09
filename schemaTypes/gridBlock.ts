import {defineField, defineType} from 'sanity'
import {DashboardIcon} from '@sanity/icons'

export default defineType({
  name: 'gridBlock',
  title: 'Grid Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'componentsGrid',
      title: 'Components Grid',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'toggle' },
        { type: 'textBlock' },
        { type: 'motto' }
      ],
      options: {
        layout: 'grid',
        insertMenu: {
          showIcons: true,
        }
      }
    }),
    defineField({
      name: 'selectableVariant',
      title: 'Selectable Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
        ]
      }
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number'
    }),
    defineField({
      name: 'globalComponentSource',
      title: 'Global Component Source',
      type: 'reference',
      to: [{type: 'gridBlock'}],
      description: 'Select a component grid that is a global document.'
    })
  ],
  preview: {
    select: {
      title: 'selectableVariant'
    }
  }
})