import type { MetadataRoute } from "next";
import { locales } from "@/dictionaries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const basePaths = [
    "",
    "/about",
    "/about/more",
    "/contact",
    "/services/shiatsu",
    "/services/shiatsu/more",
    "/services/qi-nei-zang",
    "/services/qi-nei-zang/more",
    "/services/infant-massage",
    "/services/infant-massage/more",
    "/services/naturopathy",
    "/services/naturopathy/more",
    "/services/face-massage",
    "/services/face-massage/more",
  ];

  const now = new Date();

  const priorityFor = (path: string): number => {
    if (path === "") return 1.0;
    if (path === "/about" || path === "/contact") return 0.7;
    if (path.includes("/more")) return 0.6;
    if (path.startsWith("/services/")) return 0.8;
    return 0.5;
  };

  const entries: MetadataRoute.Sitemap = locales.flatMap((l) =>
    basePaths.map((p) => ({
      url: `${siteUrl}/${l}${p}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: priorityFor(p),
    }))
  );

  return entries;
}

