import { createClient } from "next-sanity";

const client = createClient({
  projectId: "p72g6oqi",
  dataset: "production",
  useCdn: true,
  apiVersion: '2025-01-13',
});

export async function sanityFetch({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, unknown>; // Changed 'any' to Record<string, unknown>
}) {
  return await client.fetch(query, params);
}
