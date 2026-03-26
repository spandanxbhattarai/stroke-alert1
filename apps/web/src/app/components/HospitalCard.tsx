import type { Hospital, HospitalWithDistance } from "@strokealert/shared";

interface Props {
  hospital: Hospital | HospitalWithDistance;
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km.toFixed(1)} km away`;
}

export default function HospitalCard({ hospital }: Props) {
  const distance = "distance" in hospital && hospital.distance != null ? hospital.distance : null;
  const callNumber = hospital.emergencyPhone || hospital.phone;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
            {hospital.name}
          </h3>
          <p className="text-gray-400 text-sm mt-0.5 truncate">
            {hospital.addressLine1}, {hospital.city}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {distance !== null && (
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
              {formatDistance(distance)}
            </span>
          )}
          {hospital.available24x7 && (
            <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              24 / 7
            </span>
          )}
        </div>
      </div>

      {/* Specializations */}
      {hospital.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hospital.specializations.slice(0, 3).map((s) => (
            <span key={s} className="bg-gray-50 text-gray-500 text-xs px-2.5 py-0.5 rounded-full border border-gray-100">
              {s}
            </span>
          ))}
          {hospital.specializations.length > 3 && (
            <span className="text-gray-400 text-xs py-0.5">
              +{hospital.specializations.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${callNumber}`}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold rounded-xl py-3.5 text-sm transition-colors"
          aria-label={`Call ${hospital.name} at ${callNumber}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Call Now
        </a>
        <a
          href={hospital.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl py-3.5 text-sm transition-colors"
          aria-label={`Get directions to ${hospital.name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          Directions
        </a>
      </div>
    </div>
  );
}
