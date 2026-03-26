const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function getJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: "Brain Stroke Emergency Help",
      url: SITE_URL,
      description:
        "Find nearest hospital for brain stroke emergency. Call or get directions instantly.",
      medicalAudience: { "@type": "Patient" },
      about: { "@type": "MedicalCondition", name: "Brain Stroke" },
    },
    {
      "@context": "https://schema.org",
      "@type": "EmergencyService",
      name: "StrokeAlert",
      description: "Emergency brain stroke response platform connecting patients with nearest hospitals",
      url: SITE_URL,
      areaServed: { "@type": "Country", name: "Nepal" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does F stand for in FAST stroke recognition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "F stands for Face drooping — Is one side of the face drooping or numb? Ask the person to smile.",
          },
        },
        {
          "@type": "Question",
          name: "What does A stand for in FAST stroke recognition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A stands for Arm weakness — Is one arm weak or numb? Ask the person to raise both arms.",
          },
        },
        {
          "@type": "Question",
          name: "What does S stand for in FAST stroke recognition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "S stands for Speech difficulty — Is speech slurred or hard to understand?",
          },
        },
        {
          "@type": "Question",
          name: "What does T stand for in FAST stroke recognition?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "T stands for Time to call — If any of these signs are present, call the nearest hospital immediately.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "StrokeAlert",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?city={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];
}
