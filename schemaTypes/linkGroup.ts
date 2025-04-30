import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'linkGroup',
  title: 'Link Group',
  type: 'object',
  fields: [
    defineField({
      name: 'groupTitle',
      title: 'Group Title',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ 
        type: 'linkItem',
      }]
    })
  ],
  preview: {
    select: {
      title: 'groupTitle'
    }
  }
})