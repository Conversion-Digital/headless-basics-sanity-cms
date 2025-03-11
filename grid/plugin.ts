import {definePlugin, defineType, defineField} from 'sanity'
import SanityGrid from './SanityGrid'
import gridLayoutSettings from '../schemaTypes/gridLayoutSettings'

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
            name: 'component',
            title: 'Component',
            type: 'array',
            of: [
              {type: 'hero'},
              {type: 'motto'},
              {type: 'toggle'},
              {type: 'textBlock'},
            ],
            validation: (Rule) => Rule.max(1),
          }),
          defineField({
            name: 'settings',
            type: 'gridItemSettings',
            title: 'Settings',
          }),
          defineField({
            name: 'sortOrder',
            title: 'Sort Order',
            type: 'number',
          }),
        ],
        preview: {
          select: {
            title: 'component.0.title',
            subtitle: 'component.0.selectableVariant',
          },
        },
      }),
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
            type: 'gridLayoutSettings',
            title: 'Layout Settings'
          }),
        ],
      }),
      gridLayoutSettings,
    ],
  },
})