
const Trustedby = () => {
  
  const trustedCompanies = [
    { name: 'Netflix', label: 'NETFLIX' },
    { name: 'Slack', label: 'slack' },
    { name: 'Converse', label: 'CONVERSE' },
    { name: 'Shazam', label: 'shazam' },
    { name: 'Prada', label: 'PRADA' }
  ];

  return (
    <div>
       <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-gray-600">We are trusted by</p>
        </div>
        <div className="flex justify-between items-center flex-wrap gap-8">
          {trustedCompanies.map((company) => (
            <div key={company.name} className="text-gray-400 font-medium text-xl">
              {company.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Trustedby
