import { groq } from "next-sanity";

// Use groq to define queries
export const Query = groq`*[_type == "product"]`;
export const productByIdQuery = groq`*[_type == "product" && _id == $id][0]`;
export const productsByCategoryQuery = groq`*[_type == "product" && category == $category]`;

export const allProductsQuery = groq`*[_type == "product"] {
  _id,
  productName,
  title,
  "image": { "asset": { "url": image.asset->url } },
  price,
  discountPercentage,
  slug,
  reviews
  }`;

  

