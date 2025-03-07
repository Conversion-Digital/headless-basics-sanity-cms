import {definePlugin, defineType, defineField} from 'sanity'
import SanityGrid from './SanityGrid'

/**
 * We define an array type called 'gridArray' which references our 'griditem'
 * This separate array type ensures we have a valid 'of' definition for the custom input.
 */
export const grid = definePlugin({
  name: 'local-grid-plugin',
  schema: {
    types: [
      defineType({
        name: 'gridItemSettings',
        type: 'object',
        title: 'Grid Item Settings',
        fields: [
          defineField({
            name: 'width',
            type: 'number',
            title: 'Width',
          }),
          defineField({
            name: 'height',
            type: 'number',
            title: 'Height',
          }),
          defineField({
            name: 'posX',
            type: 'number',
            title: 'Column',
          }),
          defineField({
            name: 'posY',
            type: 'number',
            title: 'Row',
          }),
        ],
      }),
      defineType({
        name: 'griditem',
        type: 'object',
        title: 'Grid Item',
        fields: [
          defineField({
            name: 'username',
            type: 'string',
            title: 'Username',
          }),
          defineField({
            name: 'userimg',
            type: 'image',
            title: 'Profile Photo',
          }),
          defineField({
            name: 'settings',
            type: 'gridItemSettings',
            title: 'Settings',
          }),
        ],
        preview: {
          select: {
            title: 'username',
            media: 'userimg',
          },
        },
      }),
      // This array type uses the custom input component "SanityGrid"
      defineType({
        name: 'gridArray',
        type: 'array',
        title: 'Grid Array',
        of: [{type: 'griditem'}],
        components: {
          input: SanityGrid,
        },
      }),
      defineType({
        name: 'sanitygrid',
        type: 'object',
        title: 'Sanity Grid',
        fields: [
          defineField({
            name: 'grid',
            type: 'gridArray',
            title: 'Grid Items',
          }),
          defineField({
            name: 'layoutSettings',
            type: 'object',
            title: 'Layout Settings',
            fields: [
              defineField({
                name: 'columns',
                type: 'number',
                title: 'Columns',
              }),
              defineField({
                name: 'rows',
                type: 'number',
                title: 'Rows',
              }),
            ],
          }),
        ],
      }),
    ],
  },
})