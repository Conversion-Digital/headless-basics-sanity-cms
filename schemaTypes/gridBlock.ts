import {defineField, defineType} from 'sanity'
import {DashboardIcon} from '@sanity/icons'

export default defineType({
  name: 'gridBlock',
  title: 'Grid Block',
  type: 'object',
  icon: DashboardIcon,
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
        { type: 'motto' },
        { type: 'gridBlock' }
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
    })
  ],
  preview: {
    select: {
      title: 'selectableVariant'
    }
  }
})