import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pageMeta',
  title: 'Page Meta Data',
  type: 'object',
  fields: [
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}],
    }),
  ],
})