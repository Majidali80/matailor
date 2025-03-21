import { groq } from "next-sanity";

// Use groq to define queries
export const Query = groq`*[_type == "product"]`;
export const productByIdQuery = groq`*[_type == "product" && _id == $id][0]`;
export const productsByCategoryQuery = groq`*[_type == "product" && category == $category]`;

export const allProductsQuery = groq`*[_type == "product"] {
  _id,
  title,
  description,
  "slug": slug.current,
  category,
  productType,
  fabricType,
  materials,
  colors,
  embroideryDetails,
  pattern,
  "images": images[] {
    _key,
    _type,
    "asset": asset-> { url },
    alt,
    caption
  },
  sizes,
  measurements,
  customizationOptions,
  price,
  discountPercentage,
  inventory,
  availability,
  shippingInformation,
  careInstructions,
  specialOffers,
  customerReviews,
  tags,
  dateAdded,
  isFeatured,
  "relatedProducts": relatedProducts[]->{
    _id,
    title,
    "slug": slug.current,
    "images": images[] { _key, _type, "asset": asset-> { url }, alt, caption }
  }
}`;