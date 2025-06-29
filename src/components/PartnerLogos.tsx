const partners = [
  "Amadeus",
  "Sabre", 
  "Stripe",
  "Google Flights",
  "Expedia",
  "TrustPilot"
];

export const PartnerLogos = () => {
  return (
    <div className="mt-12 text-center partner-logos">
      <p className="text-xs text-gray-500 mb-4">Trusted technology partners</p>
      <div className="flex justify-center items-center space-x-8 flex-wrap gap-y-2">
        {partners.map((partner, index) => (
          <div 
            key={index} 
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            {partner}
          </div>
        ))}
      </div>
    </div>
  );
};
