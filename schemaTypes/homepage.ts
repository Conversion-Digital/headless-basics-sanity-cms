import { defineType } from 'sanity'
import { definePageType } from '@q42/sanity-plugin-page-tree'
import { pageTreeConfig } from '../pageTreeConfig'
import { pageFields } from './page';

const _homePageType = defineType({
  name: 'homepage',
  type: 'document',
  title: 'Home Page',
  fields: pageFields,
});

export default definePageType(_homePageType, pageTreeConfig, {
  isRoot: true,
});