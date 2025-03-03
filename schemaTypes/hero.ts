import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'selectableVariant',
      title: 'Selectable Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'Default' },
          { title: 'Hero - Image Highlight', value: 'Hero - Image Highlight' },
          { title: 'Hero - Hero CTA Buttons', value: 'Hero - Hero CTA Buttons' },
          { title: 'Hero - Right Image Hero', value: 'Hero - Right Image Hero' },
          { title: 'Hero - Faded Information Hero', value: 'Hero - Faded Information Hero' },
          { title: 'Hero - Title Only', value: 'Hero - Title Only' },
          { title: 'Hero - Slim Background', value: 'Hero - Slim Background' }
        ]
      }
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'button',
      title: 'Button',
      type: 'heroButton',
    }),
  ],
})