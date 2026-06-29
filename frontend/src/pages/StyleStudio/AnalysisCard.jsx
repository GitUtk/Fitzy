function AnalysisCard({ analysis, loading, error }) {

  return (
    <div className="mt-8 bg-white border-2 border-black rounded-3xl p-8 shadow-[8px_8px_0px_black]">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-3xl font-black text-black">
            AI Style Critic
          </h2>

          <p className="text-gray-500 mt-2">
            Honest AI feedback on your outfit.
          </p>
        </div>

      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-400 rounded-xl p-4 text-red-600">
          {error}
        </div>
      )}

      {!analysis && !loading && !error && (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-gray-400">
          Upload an outfit to start AI analysis automatically.
        </div>
      )}

      {loading && (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center text-gray-500">
          Analyzing your outfit...
        </div>
      )}

      {analysis && (
        <div className="bg-[#F8F6FF] border-2 border-black rounded-2xl p-6 whitespace-pre-wrap leading-8 text-black">
          {analysis}
        </div>
      )}

    </div>
  );
}

export default AnalysisCard;