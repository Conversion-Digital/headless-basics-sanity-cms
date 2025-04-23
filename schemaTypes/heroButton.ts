
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroButton',
  title: 'Hero Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
    }),
    defineField({
      name: 'selectableVariant',
      title: 'Selectable Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' }
        ]
      }
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number'
    })
  ],
})