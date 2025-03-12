import homepage from './homepage'
import {defineType} from 'sanity'
import page from './page'
import hero, {heroFields} from '@conversiondigital/headless-basics-components/src/theme/default/components/hero/sanity-schema'
import motto from '@conversiondigital/headless-basics-components/src/theme/default/components/motto/sanity-schema'
import toggle from '@conversiondigital/headless-basics-components/src/theme/default/components/toggle/sanity-schema'
import heroButton from './heroButton'
import textBlock from './textBlock'
import seo from './seo'
import pageMeta from './pageMeta'
import gridBlock from './gridBlock'

const heroDocument = defineType({
  name: 'heroDocument',
  title: 'Hero Document',
  type: 'document',
  fields: heroFields,
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})

export const schemaTypes = [
  homepage,
  page,
  hero,
  heroButton,
  textBlock,
  seo,
  pageMeta,
  toggle,
  motto,
  gridBlock,
  heroDocument
]