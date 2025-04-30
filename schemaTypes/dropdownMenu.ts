import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'dropdownMenu',
  title: 'Dropdown Menu',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Menu Label',
      type: 'string'
    }),
    defineField({
      name: 'dropdownLinks',
      title: 'Dropdown Links',
      type: 'array',
      of: [{ type: 'linkItem' }]
    })
  ]
}) 