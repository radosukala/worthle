import type { Metadata } from "next";

interface SharePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ p?: string; t?: string; l?: string; g?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SharePageProps): Promise<Metadata> {
  const params = await searchParams;
  const percentile = params.p ?? "50";
  const track = params.t ?? "backend";
  const language = params.l ?? "typescript";
  const grid = params.g ?? "";

  const title = `${percentile}th percentile ${language} ${track} developer — worthle.dev`;
  const description = `I scored in the ${percentile}th percentile on Worthle. Know your worth.`;
  const ogUrl = `/api/og?p=${percentile}&t=${track}&l=${language}&g=${encodeURIComponent(grid)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function SharePage({ searchParams }: SharePageProps) {
  const params = await searchParams;
  const percentile = params.p ?? "50";
  const track = params.t ?? "backend";
  const language = params.l ?? "typescript";

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold tracking-tight text-fg-bright">
        worthle.dev
      </h1>

      <p className="mt-8 text-lg text-fg">
        <span className="text-fg-bright font-bold">{percentile}th percentile</span>
      </p>
      <p className="mt-2 text-sm text-fg-dim tracking-wide">
        {language} · {track}
      </p>

      <a
        href="/"
        className="mt-12 text-xs tracking-widest border border-white/10 rounded px-6 py-3 text-fg-dim hover:text-fg-bright hover:border-white/20 transition-colors"
      >
        Take the test
      </a>
    </div>
  );
}
