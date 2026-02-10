import { STRAPI_URL } from "@/lib/utils";
import { GraduationCap, Home, Flame, Users } from "lucide-react";

interface StrapiServiceV5 {
  id: number;
  documentId?: string;
  title?: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface StrapiServiceV4 {
  id: number;
  attributes?: {
    title?: string;
    description?: string;
    icon?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}

type StrapiServiceResponse = StrapiServiceV5 | StrapiServiceV4;

function normalizeService(raw: StrapiServiceResponse | null) {
  if (!raw) return null;
  const title = (raw as StrapiServiceV5).title ?? (raw as StrapiServiceV4).attributes?.title;
  const description =
    (raw as StrapiServiceV5).description ?? (raw as StrapiServiceV4).attributes?.description;
  const icon = (raw as StrapiServiceV5).icon ?? (raw as StrapiServiceV4).attributes?.icon;

  if (!title) return null;

  return {
    id: raw.id,
    title,
    description: description ?? "",
    icon: icon ?? "Home",
  };
}

async function getService(id: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${STRAPI_URL}/api/services/${id}`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return normalizeService(data?.data ?? null);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("Error fetching service:", error);
    }
  }

  // Fallback for documentId queries (Strapi v5)
  const fallbackController = new AbortController();
  const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 8000);
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/services?filters[documentId][$eq]=${encodeURIComponent(id)}`,
      { next: { revalidate: 60 }, signal: fallbackController.signal }
    );
    clearTimeout(fallbackTimeoutId);

    if (!response.ok) return null;
    const data = await response.json();
    const first = Array.isArray(data?.data) ? data.data[0] : null;
    return normalizeService(first ?? null);
  } catch (error) {
    clearTimeout(fallbackTimeoutId);
    if (error instanceof Error && error.name !== "AbortError") {
      console.error("Error fetching service (fallback):", error);
    }
    return null;
  }
}

function getIconComponent(iconName: string) {
  const iconProps = { size: 48 };
  switch (iconName) {
    case "Home":
      return <Home {...iconProps} />;
    case "Flame":
      return <Flame {...iconProps} />;
    case "GraduationCap":
      return <GraduationCap {...iconProps} />;
    case "Users":
      return <Users {...iconProps} />;
    default:
      return <Home {...iconProps} />;
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground">
            The service you're looking for doesn't exist or isn't published.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 text-lia-brown-dark">{getIconComponent(service.icon)}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{service.title}</h1>
          <p className="text-lg text-muted-foreground">{service.description}</p>
        </div>
      </section>
    </main>
  );
}
