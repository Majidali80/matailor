import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info' },
    { name: 'design', title: 'Design & Fabric' },
    { name: 'tailoring', title: 'Tailoring Options' },
    { name: 'ecommerce', title: 'E-commerce Details' },
    { name: 'metadata', title: 'Metadata' },
  ],
  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'basic',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Ready-to-Wear', value: 'ready_to_wear' },
          { title: 'Unstitched', value: 'unstitched' },
          { title: 'Custom-Stitched', value: 'custom_stitched' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // Design & Fabric
    defineField({
      name: 'fabricType',
      title: 'Fabric Type',
      type: 'string',
      group: 'design',
      options: {
        list: [
          { title: 'Lawn', value: 'lawn' },
          { title: 'Cotton', value: 'cotton' },
          { title: 'Chiffon', value: 'chiffon' },
          { title: 'Silk', value: 'silk' },
          { title: 'Georgette', value: 'georgette' },
          { title: 'Organza', value: 'organza' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'materials',
      title: 'Materials',
      type: 'array',
      group: 'design',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Cotton', value: 'cotton' },
          { title: 'Silk', value: 'silk' },
          { title: 'Chiffon', value: 'chiffon' },
          { title: 'Lace', value: 'lace' },
          { title: 'Embroidery Thread', value: 'embroidery_thread' },
          { title: 'Sequins', value: 'sequins' },
          { title: 'Beads', value: 'beads' },
        ],
      },
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      group: 'design',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'embroideryDetails',
      title: 'Embroidery Details',
      type: 'text',
      group: 'design',
      description: 'Describe the embroidery style, patterns, or techniques (e.g., zari work, thread work, etc.)',
    }),
    defineField({
      name: 'pattern',
      title: 'Pattern',
      type: 'string',
      group: 'design',
      options: {
        list: [
          { title: 'Floral', value: 'floral' },
          { title: 'Paisley', value: 'paisley' },
          { title: 'Geometric', value: 'geometric' },
          { title: 'Traditional', value: 'traditional' },
          { title: 'Abstract', value: 'abstract' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'design',
      of: [
        {
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Describe the image for accessibility',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image',
            }),
          ],
          options: {
            hotspot: true,
            metadata: ['lqip', 'palette'], // Include low-quality image placeholder and color palette
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // Tailoring Options (unchanged for brevity)
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      group: 'tailoring',
      options: {
        list: [
          { title: 'Stitched', value: 'stitched' },
          { title: 'Unstitched', value: 'unstitched' },
          { title: 'Custom-Stitched', value: 'custom_stitched' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      group: 'tailoring',
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
              options: {
                list: [
                  { title: 'Small', value: 'small' },
                  { title: 'Medium', value: 'medium' },
                  { title: 'Large', value: 'large' },
                  { title: 'X-Large', value: 'x_large' },
                  { title: 'Custom', value: 'custom' },
                ],
              },
            }),
            defineField({
              name: 'priceAdjustment',
              title: 'Price Adjustment (Optional)',
              type: 'number',
              description: 'Additional cost for this size, if any (e.g., for custom sizes)',
            }),
          ],
        },
      ],
      hidden: ({ document }) => document?.productType === 'unstitched',
    }),
    defineField({
      name: 'measurements',
      title: 'Measurements (Unstitched or Custom)',
      type: 'object',
      group: 'tailoring',
      fields: [
        defineField({
          name: 'shirtLength',
          title: 'Shirt Length (meters)',
          type: 'number',
        }),
        defineField({
          name: 'dupattaLength',
          title: 'Dupatta Length (meters)',
          type: 'number',
        }),
        defineField({
          name: 'trouserLength',
          title: 'Trouser Length (meters)',
          type: 'number',
        }),
      ],
      hidden: ({ document }) => document?.productType === 'stitched',
    }),
    defineField({
      name: 'customizationOptions',
      title: 'Customization Options',
      type: 'array',
      group: 'tailoring',
      of: [
        {
          type: 'object',
          name: 'customizationOption',
          title: 'Customization Option',
          fields: [
            defineField({
              name: 'optionName',
              title: 'Option Name',
              type: 'string',
              options: {
                list: [
                  { title: 'Neckline Style', value: 'neckline_style' },
                  { title: 'Sleeve Style', value: 'sleeve_style' },
                  { title: 'Hemline Style', value: 'hemline_style' },
                  { title: 'Embroidery Placement', value: 'embroidery_placement' },
                  { title: 'Add-Ons (e.g., Buttons, Tassels)', value: 'add_ons' },
                ],
              },
            }),
            defineField({
              name: 'choices',
              title: 'Choices',
              type: 'array',
              of: [{ type: 'string' }],
            }),
            defineField({
              name: 'additionalCost',
              title: 'Additional Cost (Optional)',
              type: 'number',
            }),
          ],
        },
      ],
      hidden: ({ document }) => document?.productType !== 'custom_stitched',
    }),

    // E-commerce Details (unchanged for brevity)
    defineField({
      name: 'price',
      title: 'Base Price',
      type: 'number',
      group: 'ecommerce',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
      group: 'ecommerce',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'inventory',
      title: 'Inventory',
      type: 'number',
      group: 'ecommerce',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      group: 'ecommerce',
      options: {
        list: [
          { title: 'In Stock', value: 'in_stock' },
          { title: 'Out of Stock', value: 'out_of_stock' },
          { title: 'Pre-Order', value: 'pre_order' },
        ],
      },
    }),
    defineField({
      name: 'shippingInformation',
      title: 'Shipping Information',
      type: 'text',
      group: 'ecommerce',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'text',
      group: 'ecommerce',
    }),
    defineField({
      name: 'specialOffers',
      title: 'Special Offers',
      type: 'text',
      group: 'ecommerce',
    }),
    defineField({
      name: 'customerReviews',
      title: 'Customer Reviews',
      type: 'array',
      group: 'ecommerce',
      of: [
        {
          type: 'object',
          name: 'review',
          title: 'Review',
          fields: [
            defineField({
              name: 'rating',
              title: 'Rating (1-5)',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(5),
            }),
            defineField({
              name: 'comment',
              title: 'Comment',
              type: 'text',
            }),
            defineField({
              name: 'reviewerName',
              title: 'Reviewer Name',
              type: 'string',
            }),
            defineField({
              name: 'reviewDate',
              title: 'Review Date',
              type: 'datetime',
            }),
          ],
        },
      ],
    }),

    // Metadata (unchanged for brevity)
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'metadata',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'dateAdded',
      title: 'Date Added',
      type: 'datetime',
      group: 'metadata',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'metadata',
      initialValue: false,
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      group: 'metadata',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0.asset', // Updated to directly select the asset
      category: 'category',
      price: 'price',
      availability: 'availability',
    },
    prepare(selection) {
      const { title, media, category, price, availability } = selection;
      return {
        title: title || 'Untitled Product',
        subtitle: `${category || 'No Category'} | PKR ${price || 0} | ${availability || 'Unknown'}`,
        media: media, // This ensures the image asset is passed correctly
      };
    },
  },
});