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
  ],
})