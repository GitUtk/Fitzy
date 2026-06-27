import {
  FaCheck,
  FaCrown,
  FaBolt,
  FaMagic,
} from "react-icons/fa";

const monthlyFeatures = [
  "50 AI Outfit Generations / month",
  "Unlimited Virtual Try-On",
  "Access to AI Stylist",
  "Wardrobe Management",
  "Save Unlimited Looks",
  "Download HD Images",
  "Basic Outfit Recommendations",
  "Priority Support",
];

const premiumFeatures = [
  "Unlimited AI Outfit Generations",
  "Unlimited Virtual Try-On",
  "Advanced AI Stylist",
  "Smart Wardrobe Analytics",
  "Unlimited Saved Looks",
  "4K Image Downloads",
  "Premium Outfit Recommendations",
  "Priority Processing",
  "Early Access Features",
  "Exclusive Fashion Collections",
];

function PricingCard({
  title,
  badge,
  oldPrice,
  price,
  period,
  description,
  features,
  highlight,
}) {
  return (
    <div
      className={`relative rounded-[36px] border-2 border-black bg-white overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0px_black]`}
    >
      {/* Top Banner */}
      <div
        className={`py-4 text-center font-black uppercase tracking-wide text-white ${
          highlight
            ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600"
            : "bg-gray-300 text-black"
        }`}
      >
        {title}
      </div>

      <div className="p-6">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 rounded-full border-2 border-black px-4 py-2 font-bold ${
            highlight
              ? "bg-[#8B5CF6] text-white"
              : "bg-[#CCFF00] text-black"
          }`}
        >
          {highlight ? <FaCrown /> : <FaBolt />}
          {badge}
        </div>

        {/* Price */}
        <div className="mt-6 flex items-end gap-3">
          <span className="text-xl font-bold text-gray-500 line-through">
            {oldPrice}
          </span>

          <span className="text-5xl font-black text-black">
            {price}
          </span>

          <span className="pb-2 text-sm font-semibold text-gray-700">
            {period}
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-gray-800">
          {description}
        </p>

        <button
          className={`mt-6 w-full rounded-xl border-2 border-black py-3 text-base font-black shadow-[5px_5px_0px_black] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
            highlight
              ? "bg-[#8B5CF6] text-white"
              : "bg-[#CCFF00] text-black"
          }`}
        >
          {highlight ? "Get Mint Look" : "Subscribe Monthly"}
        </button>

        <div className="mt-8">
          <h3 className="mb-4 text-lg font-black text-black">
            What's Included
          </h3>

          <div className="space-y-4">
            {features.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 py-1"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-[#D8DEE7] bg-[#EEF2F6]">
                  <FaCheck className="text-[10px] text-[#64748B]" />
                </div>

                <span className="text-sm font-medium text-black">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#FCFCFC] py-16 px-6">
      <div className="mx-auto max-w-7xl">

        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-5 py-2 font-black text-white shadow-[4px_4px_0px_black]">
            <FaMagic />
            FITZY PREMIUM
          </div>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-black">
            Upgrade Your Style
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-700">
            Unlock unlimited AI outfit generation, premium styling,
            wardrobe intelligence and exclusive fashion features.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">

  <PricingCard
    title="MONTHLY"
    badge="PLUS"
    oldPrice="₹999"
    price="₹799"
    period="/month"
    description="Perfect for users who want flexibility without a long-term commitment."
    features={monthlyFeatures}
  />

  <PricingCard
    title="COMPLETE PREP"
    badge="MINT LOOK"
    oldPrice="₹6,999"
    price="₹3,999"
    period="/year"
    description="Unlock every premium AI fashion feature with unlimited access."
    features={premiumFeatures}
    highlight
  />

</div>

<div className="mt-20 text-center">
  <h2 className="text-3xl font-black text-black">Everything You Need.</h2>
  <p className="mx-auto mt-3 max-w-2xl text-base text-gray-700">
    AI-powered styling, unlimited virtual try-ons, wardrobe management, premium recommendations and faster outfit generation in one subscription.
  </p>
</div>

      </div>
    </div>
  );
}