// utils/types.tsx

// Interface for a single image from Sanity
interface SanityImage {
  asset: {
    url: string;
  };
  _type: "image";
  _key: string;
  alt?: string; // Optional, as not all images may have alt text
  caption?: string; // Optional, as not all images may have captions
}

// Interface for a single size option
interface SizeOption {
  size: string;
  priceAdjustment?: number; // Optional price adjustment for specific sizes (e.g., custom sizes)
}

// Interface for measurements (for unstitched or custom products)
interface Measurements {
  shirtLength?: number;
  dupattaLength?: number;
  trouserLength?: number;
}

// Interface for customization options (for custom-stitched products)
interface CustomizationOption {
  optionName: string;
  choices: string[];
  additionalCost?: number;
}

// Interface for customer reviews
interface CustomerReview {
  rating: number;
  comment: string;
  reviewerName: string;
  reviewDate: string;
}

// Interface for related products
interface RelatedProduct {
  _id: string;
  title: string;
  slug: {
    _type: "slug";
    current: string;
  };
  images: SanityImage[];
}

// Main Product interface
export interface Product {
  _id: string;
  title: string;
  description: string;
  slug: {
    _type: "slug";
    current: string;
  };
  category: "ready_to_wear" | "unstitched" | "custom_stitched";
  productType: "stitched" | "unstitched" | "custom_stitched";
  fabricType: string;
  materials: string[];
  colors: string[];
  embroideryDetails?: string;
  pattern?: string;
  images: SanityImage[];
  sizes?: SizeOption[]; // Optional, not applicable for unstitched products
  measurements?: Measurements; // Optional, for unstitched or custom products
  customizationOptions?: CustomizationOption[]; // Optional, for custom-stitched products
  price: number;
  discountPercentage: number;
  inventory: number;
  availability: "in_stock" | "out_of_stock" | "pre_order";
  shippingInformation: string;
  careInstructions: string;
  specialOffers: string;
  customerReviews: CustomerReview[];
  tags: string[];
  dateAdded: string;
  isFeatured: boolean;
  relatedProducts?: RelatedProduct[];
  // Fields for cart context
  selectedSize?: string; // To store the selected size in the cart
  selectedCustomizations?: { [key: string]: string }; // To store selected customization options (e.g., { neckline_style: "round" })
  quantity: number; // To store quantity in the cart
}

// CartItem interface for the cart context
export interface CartItem {
  id: string; // Changed to string to match Sanity _id
  title: string;
  image: string; // Simplified to a single URL for the cart (first image)
  slug: string;
  price: number; // Base price
  category: "ready_to_wear" | "unstitched" | "custom_stitched";
  productType: "stitched" | "unstitched" | "custom_stitched";
  selectedSize?: string; // Selected size for stitched/custom products
  selectedCustomizations?: { [key: string]: string }; // Selected customization options
  quantity: number;
  discountPercentage: number;
  totalPrice: number; // Calculated price after size/customization adjustments and discount
  discount?: (price: number, discount: number) => number; // Optional function to apply discount
}