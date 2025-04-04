import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'herobanner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required() 
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Label',
          type: 'string',
          validation: (Rule) => Rule.required()
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'url',
          validation: (Rule) => Rule.required()
        })
      ]
    })
  ]
}) 