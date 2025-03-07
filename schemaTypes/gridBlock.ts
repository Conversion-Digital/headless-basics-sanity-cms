import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gridBlock',
  title: 'Grid Block',
  type: 'object',
  fields: [
    defineField({
      name: 'selectableVariant',
      title: 'Selectable Variant',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          // Add additional variants if desired
        ]
      }
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number'
    }),
    defineField({
      name: 'gridData',
      title: 'Grid Data',
      type: 'sanitygrid'
    })
  ],
  preview: {
    select: {
      title: 'selectableVariant'
    }
  }
})