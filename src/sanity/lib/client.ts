import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId } from '../env'
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation

});

const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);

export default client;
