import { PageTreeConfig } from '@q42/sanity-plugin-page-tree';

export const pageTreeConfig: PageTreeConfig = {
  rootSchemaType: 'page',
  pageSchemaTypes: ['page'],
  allowedParents: {},
  apiVersion: '2023-12-08',
  titleFieldName: 'title',
  baseUrl: 'https://example.com',
};