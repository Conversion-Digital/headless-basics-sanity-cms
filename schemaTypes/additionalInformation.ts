import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'additionalInformation',
  title: 'Additional Information',
  type: 'object',
  fields: [
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string'
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string'
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string'
    })
  ]
}) 