import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'fabricType',
      title: 'Fabric Type',
      type: 'string',
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sizeOption',
          title: 'Size Option',
          fields: [
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price',
              type: 'number',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true, // Enable hotspot for better image cropping
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory',
      type: 'number',
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
    }),
    defineField({
      name: 'customerReviews',
      title: 'Customer Reviews',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'dateAdded',
      title: 'Date Added',
      type: 'datetime',
    }),
    defineField({
      name: 'shippingInformation',
      title: 'Shipping Information',
      type: 'text',
    }),
    defineField({
      name: 'specialOffers',
      title: 'Special Offers',
      type: 'text',
    }),
    // Adding slug field
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200, // Optional
      },
    }),
  ],
});
