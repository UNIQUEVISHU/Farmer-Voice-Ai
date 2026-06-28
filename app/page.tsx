"use client";

import { useState, memo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mic, Stethoscope, CloudSun, ArrowRight, LucideIcon, Volume2, Loader2, MessageCircle } from "lucide-react";
import { useSpeechRecognition } from "../hooks/usespeechrecgniation"; 
import { useTextToSpeech } from "../hooks/usetextspeech";

// Full localized dynamic dictionary mapped across all major region scripts
const TRANSLATIONS = {
  EN: {
    badge: "🌱 Smart Agri Voice Assistant",
    title: "Speak Naturally.",
    subtitle: "Farm Smarter.",
    actionMic: "Click mic to ask farming queries",
    userQueryLabel: "You asked",
    aiAdvisorLabel: "AI Advisor",
    optionHeading: "Explore Your Farming Options",
    optionSub: "Select an automated tool below to check your crops",
    diseaseTitle: "Disease Detection Matrix",
    diseaseDesc: "Scan or upload a real-time crop photo for instant AI diagnosis and personalized care suggestions.",
    diseaseCta: "Scan Crop Health",
    weatherTitle: "Weather Intelligence Grid",
    weatherDesc: "Access precise localized climate telemetry and predictive localized precipitation updates.",
    weatherCta: "Check Local Matrix",
    chatSupport: "Instant Chat Support",
    listening: "Listening... Speak now",
    loading: "Gemini thinking...",
    speaking: "AI is speaking...",
    defaultWelcome: "Hello! I am your farming assistant. Ask me anything."
  },
  HI: {
    badge: "🌱 स्मार्ट कृषि वॉइस असिस्टेंट",
    title: "प्राकृतिक रूप से बोलें।",
    subtitle: "स्मार्ट खेती करें।",
    actionMic: "कृषि संबंधी प्रश्न पूछने के लिए माइक दबाएं",
    userQueryLabel: "आपने पूछा",
    aiAdvisorLabel: "एआई सलाहकार",
    optionHeading: "अपने खेती के विकल्पों का पता लगाएं",
    optionSub: "अपनी फसलों की जांच करने के लिए नीचे एक स्वचालित उपकरण चुनें",
    diseaseTitle: "रोग पहचान मैट्रिक्स",
    diseaseDesc: "त्वरित एआई निदान और व्यक्तिगत देखभाल सुझावों के लिए वास्तविक समय की फसल फोटो स्कैन या अपलोड करें।",
    diseaseCta: "फसल स्वास्थ्य स्कैन करें",
    weatherTitle: "मौसम खुफिया ग्रिड",
    weatherDesc: "सटीक स्थानीयकृत जलवायु टेलीमेट्री और भविष्य कहनेवाला स्थानीयकृत वर्षा अपडेट प्राप्त करें।",
    weatherCta: "स्थानीय मैट्रिक्स जांचें",
    chatSupport: "त्वरित चैट सहायता",
    listening: "सुन रहा हूँ... बोलिए",
    loading: "जेमिनी सोच रहा है...",
    speaking: "एआई बोल रहा है...",
    defaultWelcome: "नमस्ते! मैं आपका खेती सहायक हूँ। मुझसे कुछ भी पूछें।"
  },
  PB: {
    badge: "🌱 ਸਮਾਰਟ ਐਗਰੀ ਵਾਇਸ ਅਸਿਸਟੈਂਟ",
    title: "ਕੁਦਰਤੀ ਤੌਰ 'ਤੇ ਬੋਲੋ।",
    subtitle: "ਸਮਾਰਟ ਖੇਤੀ ਕਰੋ।",
    actionMic: "ਖੇਤੀਬਾੜੀ ਦੇ ਸਵਾਲ ਪੁੱਛਣ ਲਈ ਮਾਈਕ 'ਤੇ ਕਲਿੱਕ ਕਰੋ",
    userQueryLabel: "ਤੁਸੀਂ ਪੁੱਛਿਆ",
    aiAdvisorLabel: "ਏਆਈ ਸਲਾਹਕਾਰ",
    optionHeading: "ਆਪਣੇ ਖੇਤੀ ਵਿਕਲਪਾਂ ਦੀ ਪੜਚੋਲ ਕਰੋ",
    optionSub: "ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਹੇਠਾਂ ਇੱਕ ਆਟੋਮੈਟਿਕ ਟੂਲ ਚੁਣੋ",
    diseaseTitle: "ਬੀਮਾਰੀ ਖੋਜ ਮੈਟ੍ਰਿਕਸ",
    diseaseDesc: "ਤੁਰੰਤ ਏਆਈ ਨਿਦਾਨ ਅਤੇ ਨਿੱਜੀ ਦੇਖਭਾਲ ਦੇ ਸੁਝਾਵਾਂ ਲਈ ਇੱਕ ਰੀਅਲ-ਟਾਈਮ ਫਸਲ ਦੀ ਫੋਟੋ ਸਕੈਨ ਜਾਂ ਅਪਲੋਡ ਕਰੋ।",
    diseaseCta: "ਫਸਲ ਦੀ ਸਿਹਤ ਸਕੈਨ ਕਰੋ",
    weatherTitle: "ਮੌਸਮ ਇੰਟੈਲੀਜੈਂਸ ਗ੍ਰਿਡ",
    weatherDesc: "ਸਹੀ ਸਥਾਨਕ ਜਲਵਾਯੂ ਟੈਲੀਮੈਟਰੀ ਅਤੇ ਭਵਿੱਖਬਾਣੀ ਸਥਾਨਕ ਵਰਖਾ ਅਪਡੇਟਸ ਤੱਕ ਪਹੁੰਚ ਕਰੋ।",
    weatherCta: "ਸਥਾਨਕ ਮੈਟ੍ਰਿਕਸ ਚੈੱਕ ਕਰੋ",
    chatSupport: "ਤੁਰੰਤ ਚੈਟ ਸਹਾਇਤਾ",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਹੁਣ ਬੋਲੋ",
    loading: "ਜੇਮਿਨੀ ਸੋਚ ਰਿਹਾ ਹੈ...",
    speaking: "ਏਆਈ ਬੋਲ ਰਿਹਾ ਹੈ...",
    defaultWelcome: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ।"
  },
  BN: {
    badge: "🌱 স্মার্ট অ্যাগ্রি ভয়েস অ্যাসিস্ট্যান্ট",
    title: "স্বাভাবিকভাবে কথা বলুন।",
    subtitle: "স্মার্ট চাষ করুন।",
    actionMic: "কৃষি সংক্রান্ত প্রশ্ন জিজ্ঞাসা করতে মাইক ক্লিক করুন",
    userQueryLabel: "আপনি জিজ্ঞাসা করেছেন",
    aiAdvisorLabel: "এআই উপদেষ্টা",
    optionHeading: "আপনার চাষের বিকল্পগুলি অন্বেষণ করুন",
    optionSub: "আপনার ফসল পরীক্ষা করতে নিচে একটি স্বয়ংক্রিয় সরঞ্জাম নির্বাচন করুন",
    diseaseTitle: "রোগ সনাক্তকরণ ম্যাট্রিক্স",
    diseaseDesc: "তাৎক্ষণিক এআই নির্ণয় এবং ব্যক্তিগতকৃত যত্ন পরামর্শের জন্য একটি রিয়েল-টাইম ফসলের ছবি স্ক্যান বা আপলোড করুন।",
    diseaseCta: "ফসল স্বাস্থ্য স্ক্যান করুন",
    weatherTitle: "আবহাওয়া ইন্টেলিজেন্স গ্রিড",
    weatherDesc: "সুনির্দিষ্ট স্থানীয় জলবায়ু টেলিমেট্রি এবং ভবিষ্যদ্বাণীমূলক স্থানীয় বৃষ্টিপাত আপডেট অ্যাক্সেস করুন।",
    weatherCta: "স্থানীয় ম্যাট্রিক্স পরীক্ষা করুন",
    chatSupport: "তাৎক্ষণিক চ্যাট সহায়তা",
    listening: "শুনছি... এখন কথা বলুন",
    loading: "জেদিনি ভাবছে...",
    speaking: "এআই কথা বলছে...",
    defaultWelcome: "নমস্কার! আমি আপনার কৃষি সহায়ক। আমাকে যেকোনো প্রশ্ন জিজ্ঞাসা করুন।"
  },
  TE: {
    badge: "🌱 స్మార్ట్ అగ్రి వాయిస్ అసిస్టెంట్",
    title: "సహజంగా మాట్లాడండి.",
    subtitle: "స్మార్ట్ వ్యవసాయం చేయండి.",
    actionMic: "వ్యవసాయ ప్రశ్నలను అడగడానికి మైక్‌ని క్లిక్ చేయండి",
    userQueryLabel: "మీరు అడిగారు",
    aiAdvisorLabel: "AI సలహాదారు",
    optionHeading: "మీ వ్యవసాయ ఎంపికలను అన్వేషించండి",
    optionSub: "మీ పంటలను తనిఖీ చేయడానికి క్రింద ఒక స్వయంచాలక సాధనాన్ని ఎంచుకోండి",
    diseaseTitle: "వ్యాధి గుర్తింపు మ్యాట్రిక్స్",
    diseaseDesc: "తక్షణ AI నిర్ధారణ మరియు వ్యక్తిగతీకరించిన సంరక్షణ సూచనల కోసం నిజ-సమయ పంట ఫోటోను స్కాన్ చేయండి లేదా అప్‌లోడ్ చేయండి.",
    diseaseCta: "పంట ఆరోగ్యాన్ని స్కాన్ చేయండి",
    weatherTitle: "వెదర్ ఇంటెలిజెన్స్ గ్రిడ్",
    weatherDesc: "ఖచ్చితమైన స్థానీకరించిన వాతావరణ టెలిమెట్రీ మరియు ముందస్తు స్థానీకరించిన అవపాతం నవీకరణలను యాక్సెస్ చేయండి.",
    weatherCta: "స్థానిక మ్యాట్రిక్స్ తనిఖీ చేయండి",
    chatSupport: "తక్షణ చాట్ మద్దతు",
    listening: "వింటున్నాను... ఇప్పుడు మాట్లాడండి",
    loading: "జెమిని ఆలోచిస్తోంది...",
    speaking: "AI మాట్లాడుతోంది...",
    defaultWelcome: "నమస్తే! నేను మీ వ్యవసాయ సహాయకుడిని. నన్ను ఏదైనా అడగండి."
  },
  MR: {
    badge: "🌱 स्मार्ट अ‍ॅग्री व्हॉइस असिस्टंट",
    title: "नैसर्गिकपणे बोला.",
    subtitle: "स्मार्ट शेती करा.",
    actionMic: "शेतीविषयक प्रश्न विचारण्यासाठी माइकवर क्लिक करा",
    userQueryLabel: "तुम्ही विचारले",
    aiAdvisorLabel: "एआय सल्लागार",
    optionHeading: "तुमचे शेतीचे पर्याय शोधा",
    optionSub: "तुमची पिके तपासण्यासाठी खालील स्वयंचलित साधन निवडा",
    diseaseTitle: "रोग निदान मॅट्रिक्स",
    diseaseDesc: "झटपट एआय निदान आणि वैयक्तिकृत काळजी सूचन्‍यांसाठी रिअल-टाइम पीक फोटो स्कॅन किंवा अपलोड करा.",
    diseaseCta: "पीक आरोग्य स्कॅन करा",
    weatherTitle: "हवामान इंटेलिजेंस ग्रीड",
    weatherDesc: "अचूक स्थानिक हवामान टेलिमेट्री आणि अंदाज वर्तवणाऱ्या स्थानिक पर्जन्यवृष्टी अपडेट्स मिळवा.",
    weatherCta: "स्थानिक मॅट्रिक्स तपासा",
    chatSupport: "झटपट चॅट सपोर्ट",
    listening: "ऐकत आहे... आता बोला",
    loading: "जेमिनी विचार करत आहे...",
    speaking: "एआय बोलत आहे...",
    defaultWelcome: "नमस्कार! मी तुमचा शेती सहाय्यक आहे. मला काहीही विचारा."
  },
  TA: {
    badge: "🌱 ஸ்மார்ட் அக்ரி வாய்ஸ் அசிஸ்டண்ட்",
    title: "இயல்பாகப் பேசுங்கள்.",
    subtitle: "ஸ்மார்ட்டாக விவசாயம் செய்யுங்கள்.",
    actionMic: "விவசாயக் கேள்விகளைக் கேட்க மைக்கைக் கிளிக் செய்யவும்",
    userQueryLabel: "நீங்கள் கேட்டது",
    aiAdvisorLabel: "AI ஆலோசகர்",
    optionHeading: "உங்கள் விவசாய விருப்பங்களை ஆராயுங்கள்",
    optionSub: "உங்கள் பயிர்களைச் சரிபார்க்க கீழே உள்ள தானியங்கி கருவியைத் தேர்ந்தெடுக்கவும்",
    diseaseTitle: "நோய் கண்டறிதல் மேட்ரிக்ஸ்",
    diseaseDesc: "உடனடி AI கண்டறிதல் மற்றும் தனிப்பயனாக்கப்பட்ட பராமரிப்பு பரிந்துரைகளுக்கு நிகழ்நேர பயிர் புகைப்படத்தை ஸ்கேன் செய்யவும் அல்லது பதிவேற்றவும்.",
    diseaseCta: "பயிர் ஆரோக்கியத்தை ஸ்கேன் செய்",
    weatherTitle: "வானிலை நுண்ணறிவு கிரிட்",
    weatherDesc: "துல்லியமான உள்ளூர்மயமாக்கப்பட்ட காலநிலை டெலிமெட்ரி மற்றும் முன்கணிப்பு உள்ளூர்மயமாக்கப்பட்ட மழைப்பொழிவு அறிவிப்புகளை அணுகவும்.",
    weatherCta: "உள்ளூர் மேட்ரிக்ஸை சரிபார்க்கவும்",
    chatSupport: "உடனடி அரட்டை ஆதரவு",
    listening: "கேட்டுக்கொண்டிருக்கிறது... இப்போது பேசுங்கள்",
    loading: "ஜெமினி யோசிக்கிறார்...",
    speaking: "AI பேசுகிறது...",
    defaultWelcome: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். என்னிடம் எது வேண்டுமானாலும் கேளுங்கள்."
  }
};

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  gradient: string;
  glow: string;
  iconBg: string;
}

const FeatureCard = memo(function FeatureCard({ 
  href, icon: Icon, title, description, cta, gradient, glow, iconBg 
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-between gap-6 rounded-[2rem] border border-gray-200/50 bg-white/95 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 ${glow} h-full`}
    >
      <div className="space-y-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} text-white transition-all duration-500 group-hover:scale-110 shadow-lg`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-500 font-medium">{description}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center">
        <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md`}>
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
});

export default function Home() {
  const [currentLangCode, setCurrentLangCode] = useState<keyof typeof TRANSLATIONS>("EN");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const hasGreeted = useRef<boolean>(false);

  // Dynamic language subscription listening to Navbar layout emissions
  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && TRANSLATIONS[customEvent.detail as keyof typeof TRANSLATIONS]) {
        setCurrentLangCode(customEvent.detail as keyof typeof TRANSLATIONS);
      }
    };

    window.addEventListener("langChange", handleLangChange);
    return () => window.removeEventListener("langChange", handleLangChange);
  }, []);

  const t = TRANSLATIONS[currentLangCode];

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({ lang: currentLangCode === "EN" ? "en-IN" : "hi-IN", continuous: false, interimResults: false });

  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech({ lang: currentLangCode === "EN" ? "en-IN" : "hi-IN" });

  useEffect(() => {
    if (!hasGreeted.current) {
      hasGreeted.current = true;
      return;
    }
    stopSpeaking();
    setAiResponse(t.defaultWelcome);
    speak(t.defaultWelcome);
  }, [currentLangCode, speak, stopSpeaking, t.defaultWelcome]);

  useEffect(() => {
    const fetchAiResponse = async () => {
      if (transcript && !isListening) {
        setIsAiLoading(true);
        stopSpeaking();
        
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: transcript, targetLang: currentLangCode }),
          });

          const result = await response.json();
          if (result.success && result.data?.reply) {
            setAiResponse(result.data.reply);
            speak(result.data.reply);
          } else {
            setAiResponse("Error retrieving solution.");
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsAiLoading(false);
        }
      }
    };
    fetchAiResponse();
  }, [transcript, isListening, currentLangCode, speak, stopSpeaking]);

  const handleMicClick = () => {
    if (isSpeaking) stopSpeaking();
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F7F3] w-full flex flex-col justify-between overflow-x-hidden relative pb-8 font-sans selection:bg-emerald-200">
      
      <div className="relative w-full flex flex-col justify-between min-h-screen">
        
        {/* ✅ REMOVED WHITE SPACE: Layout now scales edge-to-edge starting natively under the floating bar */}
        <section className="relative w-full overflow-hidden px-6 pt-28 pb-12 text-center shrink-0 min-h-[75vh] flex items-center justify-center">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="https://www.da.gov.ph/wp-content/uploads/2022/11/IMG_7801-1536x1024.jpg"
              alt="Farming Panel Cover"
              fill
              priority
              className="object-cover object-center brightness-[0.75]"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 text-emerald-400 px-4 py-1.5 text-xs font-black uppercase border border-slate-800 backdrop-blur-md shadow-xl">
              {t.badge}
            </span>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              {t.title} <br /> 
              <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">{t.subtitle}</span>
            </h1>

            <div className="relative mt-8 flex items-center justify-center">
              {isListening && (
                <>
                  <span className="absolute h-24 w-24 rounded-full bg-red-500/40 animate-ping" />
                  <span className="absolute h-32 w-32 rounded-full bg-red-500/30 animate-pulse" />
                </>
              )}
              
              <button
                onClick={handleMicClick}
                className={`group relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-2xl transition-all duration-500 ${
                  isListening ? "bg-red-600" : isAiLoading ? "bg-amber-500 animate-pulse" : isSpeaking ? "bg-indigo-600 animate-bounce" : "bg-emerald-700"
                }`}
              >
                <Mic className="h-8 w-8 text-white" />
              </button>
            </div>

            <p className="mt-6 text-xs font-black text-slate-900 bg-white/95 px-6 py-3 rounded-full border border-gray-300 shadow-2xl">
              {isListening ? t.listening : isAiLoading ? t.loading : isSpeaking ? t.speaking : t.actionMic}
            </p>

            {(transcript || aiResponse) && (
              <div className="mt-8 max-w-2xl w-full flex flex-col gap-4 text-left px-2">
                {transcript && (
                  <div className="rounded-2xl bg-white/95 p-5 self-end max-w-[85%] shadow-2xl border border-gray-200">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{t.userQueryLabel}</p>
                    <p className="mt-1 text-sm text-slate-900 font-bold">{transcript}</p>
                  </div>
                )}
                {aiResponse && (
                  <div className="rounded-2xl bg-white/95 p-5 self-start max-w-[85%] shadow-2xl border border-emerald-500/20">
                    <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">{t.aiAdvisorLabel}</p>
                    <p className="mt-1 text-sm text-slate-900 font-extrabold">{aiResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Global Option Blocks */}
        <div className="w-full text-center mt-8 mb-2 shrink-0">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{t.optionHeading}</h2>
          <p className="text-slate-500 text-xs mt-1 font-bold">{t.optionSub}</p>
        </div>

        <section className="mx-auto grid max-w-5xl w-full grid-cols-1 gap-6 px-6 pb-12 sm:grid-cols-2 lg:max-w-6xl my-auto items-stretch">
          <FeatureCard 
            href="/disease" 
            icon={Stethoscope} 
            title={t.diseaseTitle} 
            description={t.diseaseDesc} 
            cta={t.diseaseCta}
            gradient="from-emerald-600 to-teal-500"
            glow="hover:shadow-[0_20px_50px_rgba(16,185,129,0.18)] hover:border-emerald-500/30"
            iconBg="bg-gradient-to-br from-emerald-600 to-teal-500"
          />

          <FeatureCard 
            href="/weather" 
            icon={CloudSun} 
            title={t.weatherTitle} 
            description={t.weatherDesc} 
            cta={t.weatherCta}
            gradient="from-green-600 to-emerald-500"
            glow="hover:shadow-[0_20px_50px_rgba(4,120,87,0.18)] hover:border-green-500/30"
            iconBg="bg-gradient-to-br from-green-600 to-emerald-500"
          />
        </section>

      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Link 
          href="/chat"
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-700 to-green-600 text-white px-6 py-4 shadow-xl font-extrabold border border-white/10"
        >
          <MessageCircle className="h-5 w-5 fill-white" />
          <span>{t.chatSupport}</span>
        </Link>
      </div>

    </main>
  );
}