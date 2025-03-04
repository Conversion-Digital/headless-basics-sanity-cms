import {defineField, defineType} from 'sanity'
export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
    }),
    defineField({
      name: 'metaImage',
      title: 'Meta Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    // New SEO settings fields
    defineField({
      name: 'showInSitemap',
      title: 'Show in Sitemap',
      type: 'boolean'
    }),
    defineField({
      name: 'pageNoIndex',
      title: 'Page No Index?',
      type: 'boolean'
    }),
  ],
})