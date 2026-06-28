import React from "react";
import { AlertTriangle, Droplets, ShieldCheck, Sprout } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherAdviceProps {
  temperature: number;
  condition: string;
  rainChance: number;
  humidity: number;
}

export const WeatherAdvice: React.FC<WeatherAdviceProps> = ({
  temperature,
  condition,
  rainChance,
  humidity,
}) => {
  const getAdvice = () => {
    const isRainy = condition.toLowerCase().includes("rain") || rainChance > 50;
    const isHot = temperature > 32;
    const isHighlyHumid = humidity > 80;

    const advices = [];

    // 1. Irrigation Recommendation
    if (isRainy) {
      advices.push({
        title: "Irrigation Recommendation",
        desc: "Postpone planned irrigation. Natural precipitation will satisfy crop moisture requirements.",
        type: "info",
        icon: <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900",
      });
    } else if (isHot) {
      advices.push({
        title: "Irrigation Recommendation",
        desc: "High evaporation rates predicted. Schedule early morning or late evening deep irrigation to prevent water stress.",
        type: "warning",
        icon: <Droplets className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900",
      });
    } else {
      advices.push({
        title: "Irrigation Recommendation",
        desc: "Maintain regular standard organic mulching and standard moisture checks tailored to your crop cycle.",
        type: "success",
        icon: <Droplets className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900",
      });
    }

    // 2. Spray Advisory
    if (isRainy) {
      advices.push({
        title: "Spray Advisory",
        desc: "Do not apply any organic liquid mixtures, Jeevamrutha, or bio-pesticides. Rain will wash treatments away.",
        type: "alert",
        icon: <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />,
        bg: "bg-red-50 dark:bg-red-950/40 border-red-100 dark:border-red-900",
      });
    } else if (isHighlyHumid) {
      advices.push({
        title: "Spray Advisory",
        desc: "High humidity conditions. Ensure appropriate dilution ratios for liquid inputs to circumvent unwanted fungal issues.",
        type: "info",
        icon: <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
        bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-100 dark:border-teal-900",
      });
    } else {
      advices.push({
        title: "Spray Advisory",
        desc: "Excellent windows for foliar spray of organic nutrients or neem oil pest setup under moderate wind speed conditions.",
        type: "success",
        icon: <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900",
      });
    }

    // 3. General Crop Care Tips
    if (isHighlyHumid) {
      advices.push({
        title: "Crop Care Tips",
        desc: "Elevated atmospheric humidity promotes fungal growth. Prune lower yellowing foliage to enhance aeration naturally.",
        type: "warning",
        icon: <Sprout className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900",
      });
    } else {
      advices.push({
        title: "Crop Care Tips",
        desc: "Favorable conditions for aerating nursery bed soils and turning over your traditional organic compost pile heaps.",
        type: "success",
        icon: <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
        bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900",
      });
    }

    return advices;
  };

  return (
    <div className="w-full space-y-2.5">
      <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider pl-1">
        Natural Farming Insights
      </h3>
      {/* Responsive grid: 1 column on mobile, 3-up from tablet — far less scrolling on bigger screens */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {getAdvice().map((item, index) => (
          <Card
            key={index}
            className={`border-l-4 rounded-xl shadow-none border transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sm ${item.bg}`}
          >
            <CardContent className="p-3 flex items-start space-x-2.5">
              <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                  {item.title}
                </h4>
                <p className="text-[11px] leading-snug text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};