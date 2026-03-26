interface Props {
  googleMapsLink: string;
  name: string;
}

export default function MapPreview({ googleMapsLink, name }: Props) {
  // Convert a maps link to embed format if possible
  const getEmbedUrl = (link: string) => {
    try {
      const url = new URL(link);
      const q = url.searchParams.get("q");
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      }
    } catch {}
    return null;
  };

  const embedUrl = getEmbedUrl(googleMapsLink);

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map preview for ${name}`}
          aria-label={`Google Maps location of ${name}`}
        />
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View on Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}
