import homepage from './homepage'
import {defineType} from 'sanity'
import page from './page'
import hero, {heroComponentGlobal} from '@conversiondigital/headless-basics-components/src/theme/default/components/hero/sanity-schema'
import motto, {mottoComponentGlobal} from '@conversiondigital/headless-basics-components/src/theme/default/components/motto/sanity-schema'
import toggle from '@conversiondigital/headless-basics-components/src/theme/default/components/toggle/sanity-schema'
import heroButton from './heroButton'
import textBlock from './textBlock'
import seo from './seo'
import pageMeta from './pageMeta'
import gridBlock from './gridBlock'

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
  gridBlock
]