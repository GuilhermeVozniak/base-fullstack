import type { Metadata } from "next"

const siteConfig = {
  name: "base-fullstack",
  description: "Create and share heartfelt letters",
  url: "https://base-fullstack.com",
}

export function createMetadata({
  title,
  description,
  path = "/",
  image,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const pageDescription = description ?? siteConfig.description
  const url = `${siteConfig.url}${path}`

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      type: "website",
      ...(image && { images: [{ url: image }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
    },
  }
}
