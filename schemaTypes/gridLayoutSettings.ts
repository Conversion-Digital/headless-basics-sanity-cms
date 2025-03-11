import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'gridLayoutSettings',
  title: 'Grid Layout Settings',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number'
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'number'
    })
  ]
})