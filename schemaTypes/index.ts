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
import { targetedLink, internalUrl, externalUrl, linksList } from '@conversiondigital/headless-basics-data/src/cms/sanity/sanityCommonSchema'
import herobanner from '@conversiondigital/headless-basics-components/src/theme/conversion/components/herobanner/sanity-schema'
import cdfooter, { linkGroup, socialLink } from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdfooter/sanity-schema'
import linkItem from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/linkItem'
import dropdownMenu from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/dropdownMenu'
import cdnav from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdnav/sanity-schema'
import cdinsights from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdinsights/sanity-schema'
import cdservices from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdservices/sanity-schema'
import cdtestimonials from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdtestimonials/sanity-schema'
import { insightsItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/insightsItem'
import { serviceItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/serviceItem'
import { singleTestimonial } from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/singleTestimonial'
import cdmission from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdmission/sanity-schema'
import cdpartners from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdpartners/sanity-schema'
import cdclients from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdclients/sanity-schema'
import { partnerItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/partnerItem'
import { clientItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/clientItem'
import { caseStudyItem } from '@conversiondigital/headless-basics-components/src/theme/conversion/schemaTypes/casestudyItem'
import cdcta from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdcta/sanity-schema'
import cdcasestudies from '@conversiondigital/headless-basics-components/src/theme/conversion/components/cdcasestudies/sanity-schema'
export const schemaTypes = [
  targetedLink,
  internalUrl,
  externalUrl,
  linksList,
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
  linkItem,
  linkGroup,
  socialLink,
  dropdownMenu,
  cdnav,
  cdinsights,
  insightsItem,
  cdservices,
  serviceItem,
  cdtestimonials,
  singleTestimonial,
  cdmission,
  cdpartners,
  partnerItem,
  cdclients,
  clientItem,
  cdcasestudies,
  caseStudyItem,
  cdcta // add cdcta to the array
];