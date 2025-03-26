import homepage from './homepage'
import page from './page'
import hero from '@conversiondigital/headless-basics-components/src/theme/default/components/hero/sanity-schema'
import motto from '@conversiondigital/headless-basics-components/src/theme/default/components/motto/sanity-schema'
import { footerLogo, footerButton, footerLinkSection, footerStructure } from '@conversiondigital/headless-basics-components/src/theme/default/components/footer/sanity-schema'
import toggle from '@conversiondigital/headless-basics-components/src/theme/default/components/toggle/sanity-schema'
import heroButton from './heroButton'
import textBlock from './textBlock'
import seo from './seo'
import pageMeta from './pageMeta'
import gridBlock from './gridBlock'
import { targetedLink, internalUrl, externalUrl, linksList } from '@conversiondigital/headless-basics-data/src/cms/sanity/sanityCommonSchema'
// import ourcompany, { companyStats } from '@conversiondigital/headless-basics-components/src/theme/default/components/ourcompany/sanity-schema'


// import ctaButtons
//import ctaButtons, {ctaButtonItem} from '@conversiondigital/headless-basics-components/src/theme/corporate1/components/ctaButtons/sanity-schema'

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
  // ctaButtonItem,
  // ctaButtons,
]