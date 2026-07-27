interface Props {
  googleMapsLink: string;
  name: string;
}

export default function MapPreview({ googleMapsLink, name }: Props) {
  // Only `?q=`-style links can be turned into an embed; anything else gets a link out.
  const getEmbedUrl = (link: string) => {
    try {
      const q = new URL(link).searchParams.get("q");
      if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    } catch {
      // fall through to the link-out below
    }
    return null;
  };

  const embedUrl = getEmbedUrl(googleMapsLink);

  return (
    <div className="border border-rule">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="280"
          style={{ border: 0, display: "block", filter: "grayscale(1) contrast(1.05)" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map preview for ${name}`}
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-paper-2">
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-micro uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-signal"
          >
            Open in Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}
