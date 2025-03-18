# Sanity Blogging Content Studio &amp; Project Architecture Overview

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

## Overview

This project is built using Sanity Studio and follows a modular architecture to manage content through schema definitions. The repository is structured as follows:
- **schemaTypes/**: Contains Sanity schema definitions for various document and object types (e.g., homepage, page, gridBlock, textBlock, etc.).
- **static/**: Holds static assets served by the Sanity server.
- Configuration files such as %sanity.config.ts%, %pageTreeConfig.ts%, and %tsconfig.json% manage the studio&apos;s behavior and integration with the backend.
- The project uses plugins like %@q42/sanity-plugin-page-tree% and %@sanity/vision% to enhance content management and preview functionalities.

## Architecture Run Through

The architecture of the project includes:
- **Sanity Studio Setup**: Configured in %sanity.config.ts%, it defines the structure, plugins, and schema types. The studio connects to a Sanity backend dataset.
- **Page Tree and Document Structure**: The %pageTreeConfig.ts% defines how pages are organized. The homepage and pages are managed as documents with hierarchical relationships.
- **Schema Definitions**: Found in the %schemaTypes% directory, these define various components (e.g., hero, textBlock, toggle, gridBlock) and pages. Each component includes fields such as %sortOrder% and %selectableVariant% to facilitate ordering and variant selection.
- **Components &amp; Reusability**: Components are modular building blocks that can be reused across different pages. They allow editors to create rich content experiences by combining predefined elements. Global references allow components to be shared across documents for consistency.

## Components Overview

Components in this project serve as the primary building blocks for content creation:
- **Hero**: Used for prominent banners and introductory sections.
- **Text Block**: Allows rich text content to be added.
- **Grid Block**: Provides a flexible layout to display multiple components in a grid format.
- **Toggle, Motto, and Hero Button**: Additional interactive and branding elements.
- **Usage in Pages**: Components are added to pages via the %components% field in document schemas, enabling a dynamic and customizable content structure. Editors can choose components from a dropdown (%selectableVariant%) and order them using the %sortOrder% field.

## Getting Started

- Read the [getting started guide](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme).
- Explore the example frontend using [React/Next.js](https://github.com/sanity-io/tutorial-sanity-blog-react-next).
- Learn more about extending the studio with plugins and custom components from the Sanity documentation.

For additional plugins and integrations, please visit:
- [Sanity Plugin Link Field](https://www.sanity.io/plugins/sanity-plugin-link-field)
- [Sanity Block Selector](https://www.sanity.io/plugins/sanity-block-selector)
- [Sanity Kit](https://www.sanity.io/plugins/sanity-kit)
- [Rich Date Input](https://www.sanity.io/plugins/rich-date-input)
- [YouTube Input](https://www.sanity.io/plugins/sanity-plugin-youtube-input)
- [Simpler Color Input](https://www.sanity.io/plugins/sanity-plugin-simpler-color-input)
- [Table Plugin](https://www.sanity.io/plugins/table)
- [Structured Content for Page Building](https://www.sanity.io/guides/how-to-use-structured-content-for-page-building)



# Sanity Blogging Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- Check out the example frontend: [React/Next.js](https://github.com/sanity-io/tutorial-sanity-blog-react-next)
- [Read the blog post about this template](https://www.sanity.io/blog/build-your-own-blog-with-sanity-and-next-js?utm_source=readme)
- [Join the community Slack](https://slack.sanity.io/?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)


