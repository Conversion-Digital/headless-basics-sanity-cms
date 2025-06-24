import homepage from './homepage'
import { defineType } from 'sanity'
import page from './page'
import hero from '@conversiondigital/headless-basics-components/src/theme/default/components/hero/sanity-schema'
import carousel from '@conversiondigital/headless-basics-components/src/theme/default/components/carousel/sanity-schema'
import motto from '@conversiondigital/headless-basics-components/src/theme/default/components/motto/sanity-schema'
import { footerLogo, footerButton, footerLinkSection, footerStructure } from '@conversiondigital/headless-basics-components/src/theme/default/components/footer/sanity-schema'
import toggle from '@conversiondigital/headless-basics-components/src/theme/default/components/toggle/sanity-schema'
import heroButton from './heroButton'
import textBlock from './textBlock'
import seo from './seo'
import pageMeta from './pageMeta'
import gridBlock from './gridBlock'
import { targetedLink, internalUrl, externalUrl, linksList, linkItem } from '@conversiondigital/headless-basics-data/src/cms/sanity/sanityCommonSchema'
import herobanner from '@conversiondigital/headless-basics-components/src/theme/conversion/components/herobanner/sanity-schema'
import cdfooter, { linkGroup, socialLink, additionalInformationType } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdfooter/sanity-schema'
import cdinsights, { insightItem, topicItem }  from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdinsights/sanity-schema'
import cdservices, { serviceItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdservices/sanity-schema'
import cdtestimonials, { singleTestimonial, videoTestimonial } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdtestimonials/sanity-schema'
import cdmission, { keyPoint, promise } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdmission/sanity-schema'
import cdpartners, { partnerItem }  from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdpartners/sanity-schema'
import cdclients, { clientItem }  from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdclients/sanity-schema'
import cdcta from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdcta/sanity-schema'
import cdcasestudies, { caseStudyItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdcasestudies/sanity-schema'
import cdnav, { dropdownMenu } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdnav/sanity-schema'
import cdserviceintro from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdserviceintro/sanity-schema'
import cdservicestats from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdservicestats/sanity-schema'
import cdserviceofferings from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdserviceofferings/sanity-schema'

export const schemaTypes = [
  targetedLink,
  internalUrl,
  externalUrl,
  linksList,
  linkItem,
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
  footerLogo,
  footerButton,
  footerLinkSection,
  footerStructure,
  carousel,
  herobanner,
  cdfooter,
  linkGroup,
  socialLink,
  additionalInformationType,
  cdinsights,
  insightItem,
  topicItem,
  cdservices,
  serviceItem,
  cdtestimonials,
  singleTestimonial,
  cdmission,
  keyPoint,
  promise,
  cdpartners,
  partnerItem,
  cdclients,
  clientItem,
  cdcasestudies,
  caseStudyItem,
  cdcta,
  cdnav,
  dropdownMenu,
  videoTestimonial,
  cdserviceintro,
  cdservicestats,
  cdserviceofferings
];
