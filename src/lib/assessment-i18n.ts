import { CFL_PAW_QUESTIONS } from './cfl-questions-data';

export type AssessmentLanguage = 'en' | 'hi' | 'gu' | 'mr';

export const ASSESSMENT_LANGUAGES: { value: AssessmentLanguage; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'mr', label: 'मराठी' },
];

export const ASSESSMENT_COPY: Record<AssessmentLanguage, Record<string, string>> = {
  "en": {
    "basicsTitle": "Let's begin with the basics",
    "basicsDescription": "Enter your details and select the language you prefer.",
    "fullName": "Full name",
    "whatsapp": "WhatsApp number",
    "loginId": "Login ID",
    "language": "Assessment language",
    "start": "Start assessment",
    "minutes": "About 10 minutes",
    "basicDetails": "Basic details",
    "questions": "40 questions",
    "yourReport": "Your report",
    "back": "Back",
    "generate": "Generate report",
    "answered": "answered",
    "instructions": "Choose the option that describes how you usually behave. Answer every question.",
    "strengths": "Strengths",
    "weaknesses": "Weaknesses",
    "reportTitle": "Your personality profile",
    "scores": "Your scores",
    "personality": "Personality",
    "total": "Total",
    "primary": "Primary style",
    "secondary": "Secondary style",
    "newAssessment": "New assessment",
    "download": "Download PDF",
    "savedReports": "Saved reports",
    "viewReport": "View report",
    "continue": "Continue",
    "signIn": "Sign in",
    "privacyGuest": "Guest details and reports stay in this browser. Sign in to save an assessment to your assigned account.",
    "privacyMember": "Your report is saved to your account and is available to your authorized team.",
    "completedOn": "Completed on",
    "chooseOne": "Choose one option",
    "scoreTable": "Score table",
    "meaning": "What your scores mean",
    "reportSaved": "Your report is ready."
  },
  "hi": {
    "basicsTitle": "अपनी जानकारी से शुरू करें",
    "basicsDescription": "अपनी जानकारी भरें और अपनी पसंद की भाषा चुनें।",
    "fullName": "पूरा नाम",
    "whatsapp": "WhatsApp नंबर",
    "loginId": "लॉगिन आईडी",
    "language": "मूल्यांकन की भाषा",
    "start": "मूल्यांकन शुरू करें",
    "minutes": "लगभग 10 मिनट",
    "basicDetails": "मूल जानकारी",
    "questions": "40 प्रश्न",
    "yourReport": "आपकी रिपोर्ट",
    "back": "पीछे",
    "generate": "रिपोर्ट बनाएं",
    "answered": "उत्तर दिए",
    "instructions": "वह विकल्प चुनें जो आपके सामान्य व्यवहार को बताता है। हर प्रश्न का उत्तर दें।",
    "strengths": "खूबियां",
    "weaknesses": "कमजोरियां",
    "reportTitle": "आपका व्यक्तित्व परिचय",
    "scores": "आपके अंक",
    "personality": "व्यक्तित्व",
    "total": "कुल",
    "primary": "प्रमुख शैली",
    "secondary": "दूसरी शैली",
    "newAssessment": "नया मूल्यांकन",
    "download": "PDF डाउनलोड करें",
    "savedReports": "सहेजी गई रिपोर्ट",
    "viewReport": "रिपोर्ट देखें",
    "continue": "आगे बढ़ें",
    "signIn": "लॉगिन करें",
    "privacyGuest": "बिना साइन इन की जानकारी और रिपोर्ट इसी ब्राउज़र में रहती हैं। अपने खाते में सहेजने के लिए साइन इन करें।",
    "privacyMember": "आपकी रिपोर्ट आपके खाते में सहेजी जाती है और आपकी अधिकृत टीम देख सकती है।",
    "completedOn": "पूरा हुआ",
    "chooseOne": "एक विकल्प चुनें",
    "scoreTable": "अंक तालिका",
    "meaning": "आपके अंकों का अर्थ",
    "reportSaved": "आपकी रिपोर्ट सहेज दी गई है।"
  },
  "gu": {
    "basicsTitle": "તમારી માહિતીથી શરૂ કરીએ",
    "basicsDescription": "તમારી માહિતી ભરો અને તમને ગમતી ભાષા પસંદ કરો.",
    "fullName": "પૂરું નામ",
    "whatsapp": "WhatsApp નંબર",
    "loginId": "લૉગિન આઈડી",
    "language": "મૂલ્યાંકનની ભાષા",
    "start": "મૂલ્યાંકન શરૂ કરો",
    "minutes": "લગભગ 10 મિનિટ",
    "basicDetails": "મૂળ માહિતી",
    "questions": "40 પ્રશ્નો",
    "yourReport": "તમારો રિપોર્ટ",
    "back": "પાછળ",
    "generate": "રિપોર્ટ બનાવો",
    "answered": "જવાબ આપ્યા",
    "instructions": "તમારા સામાન્ય વર્તનને દર્શાવતો વિકલ્પ પસંદ કરો. દરેક પ્રશ્નનો જવાબ આપો.",
    "strengths": "શક્તિઓ",
    "weaknesses": "નબળાઈઓ",
    "reportTitle": "તમારો વ્યક્તિત્વ પરિચય",
    "scores": "તમારા ગુણ",
    "personality": "વ્યક્તિત્વ",
    "total": "કુલ",
    "primary": "મુખ્ય શૈલી",
    "secondary": "બીજી શૈલી",
    "newAssessment": "નવું મૂલ્યાંકન",
    "download": "PDF ડાઉનલોડ કરો",
    "savedReports": "સાચવેલા રિપોર્ટ",
    "viewReport": "રિપોર્ટ જુઓ",
    "continue": "આગળ વધો",
    "signIn": "લૉગિન કરો",
    "privacyGuest": "સાઇન ઇન વગરની વિગતો અને રિપોર્ટ ફક્ત આ બ્રાઉઝરમાં રહે છે. તમારા ખાતામાં સાચવવા સાઇન ઇન કરો.",
    "privacyMember": "તમારો રિપોર્ટ તમારા ખાતામાં સાચવાય છે અને તમારી અધિકૃત ટીમ જોઈ શકે છે.",
    "completedOn": "પૂર્ણ થયું",
    "chooseOne": "એક વિકલ્પ પસંદ કરો",
    "scoreTable": "ગુણ કોષ્ટક",
    "meaning": "તમારા ગુણનો અર્થ",
    "reportSaved": "તમારો રિપોર્ટ સાચવવામાં આવ્યો છે."
  },
  "mr": {
    "basicsTitle": "तुमच्या माहितीपासून सुरुवात करूया",
    "basicsDescription": "तुमची माहिती भरा आणि तुम्हाला आवडणारी भाषा निवडा.",
    "fullName": "पूर्ण नाव",
    "whatsapp": "WhatsApp क्रमांक",
    "loginId": "लॉगिन आयडी",
    "language": "मूल्यांकनाची भाषा",
    "start": "मूल्यांकन सुरू करा",
    "minutes": "सुमारे 10 मिनिटे",
    "basicDetails": "मूलभूत माहिती",
    "questions": "40 प्रश्न",
    "yourReport": "तुमचा अहवाल",
    "back": "मागे",
    "generate": "अहवाल तयार करा",
    "answered": "उत्तरे दिली",
    "instructions": "तुमच्या नेहमीच्या वर्तनाचे वर्णन करणारा पर्याय निवडा. प्रत्येक प्रश्नाचे उत्तर द्या.",
    "strengths": "सामर्थ्ये",
    "weaknesses": "कमतरता",
    "reportTitle": "तुमचा व्यक्तिमत्त्व परिचय",
    "scores": "तुमचे गुण",
    "personality": "व्यक्तिमत्त्व",
    "total": "एकूण",
    "primary": "प्रमुख शैली",
    "secondary": "दुसरी शैली",
    "newAssessment": "नवे मूल्यांकन",
    "download": "PDF डाउनलोड करा",
    "savedReports": "जतन केलेले अहवाल",
    "viewReport": "अहवाल पाहा",
    "continue": "पुढे जा",
    "signIn": "लॉगिन करा",
    "privacyGuest": "साइन इन शिवाय दिलेली माहिती आणि अहवाल याच ब्राउझरमध्ये राहतात. खात्यात जतन करण्यासाठी साइन इन करा.",
    "privacyMember": "तुमचा अहवाल तुमच्या खात्यात जतन होतो आणि तुमची अधिकृत टीम तो पाहू शकते.",
    "completedOn": "पूर्ण झाले",
    "chooseOne": "एक पर्याय निवडा",
    "scoreTable": "गुणांचा तक्ता",
    "meaning": "तुमच्या गुणांचा अर्थ",
    "reportSaved": "तुमचा अहवाल तयार आहे."
  }
};

type LocalizedOption = { word: string; description: string };

// Keys bind translations to stable question numbers and temperaments, not display order.
const OPTION_TRANSLATIONS: Record<Exclude<AssessmentLanguage, 'en'>, Record<string, LocalizedOption>> = {
  "hi": {
    "1:Choleric": {
      "word": "साहसी",
      "description": "नई चुनौतियां अपनाता है"
    },
    "1:Phlegmatic": {
      "word": "अनुकूल",
      "description": "बदलाव में ढल जाता है"
    },
    "1:Sanguine": {
      "word": "जीवंत",
      "description": "हावभाव से उत्साह दिखाता है"
    },
    "1:Melancholy": {
      "word": "विश्लेषक",
      "description": "बातों को तर्क से परखता है"
    },
    "2:Melancholy": {
      "word": "दृढ़",
      "description": "शुरू किया काम पूरा करता है"
    },
    "2:Sanguine": {
      "word": "खिलंदड़",
      "description": "हंसी और खेल पसंद करता है"
    },
    "2:Choleric": {
      "word": "समझाने वाला",
      "description": "तथ्यों से सहमत कराता है"
    },
    "2:Phlegmatic": {
      "word": "शांतिप्रिय",
      "description": "झगड़े से दूर रहता है"
    },
    "3:Phlegmatic": {
      "word": "आज्ञाकारी",
      "description": "दूसरों की बात सहज मानता है"
    },
    "3:Melancholy": {
      "word": "त्यागी",
      "description": "दूसरों के लिए अपना हित छोड़ता है"
    },
    "3:Sanguine": {
      "word": "मिलनसार",
      "description": "लोगों के साथ रहना पसंद करता है"
    },
    "3:Choleric": {
      "word": "दृढ़ इच्छाशक्ति वाला",
      "description": "अपना निर्णय निभाता है"
    },
    "4:Melancholy": {
      "word": "विचारशील",
      "description": "दूसरों की भावनाओं का ध्यान रखता है"
    },
    "4:Phlegmatic": {
      "word": "संयमित",
      "description": "भावनाएं काबू में रखता है"
    },
    "4:Choleric": {
      "word": "प्रतिस्पर्धी",
      "description": "जीतने का प्रयास करता है"
    },
    "4:Sanguine": {
      "word": "प्रभावी",
      "description": "आकर्षक ढंग से बात मनवाता है"
    },
    "5:Sanguine": {
      "word": "ताजगी देने वाला",
      "description": "साथ में नया उत्साह लाता है"
    },
    "5:Melancholy": {
      "word": "आदरपूर्ण",
      "description": "दूसरों को सम्मान देता है"
    },
    "5:Phlegmatic": {
      "word": "संकोची",
      "description": "निजी बातें कम बताता है"
    },
    "5:Choleric": {
      "word": "उपायशील",
      "description": "उपलब्ध साधनों से हल खोजता है"
    },
    "6:Phlegmatic": {
      "word": "संतुष्ट",
      "description": "जो है उसमें खुश रहता है"
    },
    "6:Melancholy": {
      "word": "संवेदनशील",
      "description": "भावनाओं को जल्दी समझता है"
    },
    "6:Choleric": {
      "word": "आत्मनिर्भर",
      "description": "अपने बल पर काम करता है"
    },
    "6:Sanguine": {
      "word": "जोशीला",
      "description": "काम में ऊर्जा भरता है"
    },
    "7:Melancholy": {
      "word": "योजनाकार",
      "description": "काम पहले से तय करता है"
    },
    "7:Phlegmatic": {
      "word": "धैर्यवान",
      "description": "बिना चिढ़े प्रतीक्षा करता है"
    },
    "7:Choleric": {
      "word": "सकारात्मक",
      "description": "अच्छे परिणाम की आशा रखता है"
    },
    "7:Sanguine": {
      "word": "प्रोत्साहक",
      "description": "दूसरों को भाग लेने को प्रेरित करता है"
    },
    "8:Choleric": {
      "word": "आश्वस्त",
      "description": "अपने निर्णय पर भरोसा रखता है"
    },
    "8:Sanguine": {
      "word": "सहज",
      "description": "मौके पर तुरंत कदम उठाता है"
    },
    "8:Melancholy": {
      "word": "समयबद्ध",
      "description": "तय समय के अनुसार चलता है"
    },
    "8:Phlegmatic": {
      "word": "शर्मीला",
      "description": "ध्यान का केंद्र बनने से बचता है"
    },
    "9:Melancholy": {
      "word": "सुव्यवस्थित",
      "description": "चीजें सही जगह रखता है"
    },
    "9:Phlegmatic": {
      "word": "सहयोगी",
      "description": "मदद के लिए तैयार रहता है"
    },
    "9:Choleric": {
      "word": "स्पष्टवादी",
      "description": "अपनी बात खुलकर कहता है"
    },
    "9:Sanguine": {
      "word": "आशावादी",
      "description": "भविष्य का अच्छा पक्ष देखता है"
    },
    "10:Phlegmatic": {
      "word": "मैत्रीपूर्ण",
      "description": "जल्दी दोस्ती कर लेता है"
    },
    "10:Melancholy": {
      "word": "निष्ठावान",
      "description": "रिश्तों में भरोसा निभाता है"
    },
    "10:Sanguine": {
      "word": "हंसमुख",
      "description": "हास्य से लोगों को हंसाता है"
    },
    "10:Choleric": {
      "word": "प्रबल",
      "description": "दृढ़ता से काम आगे बढ़ाता है"
    },
    "11:Choleric": {
      "word": "निडर",
      "description": "जोखिम से नहीं घबराता"
    },
    "11:Sanguine": {
      "word": "मनभावन",
      "description": "साथ में खुशी देता है"
    },
    "11:Phlegmatic": {
      "word": "कूटनीतिक",
      "description": "मतभेद कुशलता से सुलझाता है"
    },
    "11:Melancholy": {
      "word": "बारीकबीन",
      "description": "छोटी बातों पर ध्यान देता है"
    },
    "12:Sanguine": {
      "word": "प्रसन्न",
      "description": "खुशमिजाज रहता है"
    },
    "12:Phlegmatic": {
      "word": "नियमित",
      "description": "व्यवहार में स्थिर रहता है"
    },
    "12:Melancholy": {
      "word": "सुसंस्कृत",
      "description": "शिष्टाचार और कला समझता है"
    },
    "12:Choleric": {
      "word": "आत्मविश्वासी",
      "description": "अपनी क्षमता पर भरोसा रखता है"
    },
    "13:Melancholy": {
      "word": "आदर्शवादी",
      "description": "ऊंचे मानकों की ओर बढ़ता है"
    },
    "13:Choleric": {
      "word": "स्वतंत्र",
      "description": "अपने निर्णय स्वयं लेता है"
    },
    "13:Phlegmatic": {
      "word": "अहानिकर",
      "description": "किसी को दुखाने से बचता है"
    },
    "13:Sanguine": {
      "word": "प्रेरक",
      "description": "दूसरों में उत्साह जगाता है"
    },
    "14:Sanguine": {
      "word": "अभिव्यंजक",
      "description": "भावनाएं खुलकर दिखाता है"
    },
    "14:Choleric": {
      "word": "निर्णायक",
      "description": "समय पर स्पष्ट फैसला लेता है"
    },
    "14:Phlegmatic": {
      "word": "सूक्ष्म हास्य वाला",
      "description": "गंभीर लहजे में मजाक करता है"
    },
    "14:Melancholy": {
      "word": "गंभीर",
      "description": "बात की गहराई में सोचता है"
    },
    "15:Phlegmatic": {
      "word": "मध्यस्थ",
      "description": "झगड़ते लोगों में समझौता कराता है"
    },
    "15:Melancholy": {
      "word": "संगीतप्रेमी",
      "description": "संगीत की लय महसूस करता है"
    },
    "15:Choleric": {
      "word": "कर्मशील",
      "description": "लोगों को काम में जुटाता है"
    },
    "15:Sanguine": {
      "word": "घुलने-मिलने वाला",
      "description": "अजनबियों से सहज जुड़ता है"
    },
    "16:Melancholy": {
      "word": "सजग",
      "description": "फैसले से पहले दूसरों का सोचता है"
    },
    "16:Choleric": {
      "word": "अडिग",
      "description": "कठिनाई में भी प्रयास नहीं छोड़ता"
    },
    "16:Sanguine": {
      "word": "बातूनी",
      "description": "बातचीत शुरू करना पसंद करता है"
    },
    "16:Phlegmatic": {
      "word": "सहनशील",
      "description": "अलग विचार स्वीकार करता है"
    },
    "17:Phlegmatic": {
      "word": "श्रोता",
      "description": "ध्यान से दूसरों को सुनता है"
    },
    "17:Melancholy": {
      "word": "वफादार",
      "description": "साथ और भरोसा बनाए रखता है"
    },
    "17:Choleric": {
      "word": "नेतृत्वकर्ता",
      "description": "दिशा देकर जिम्मेदारी लेता है"
    },
    "17:Sanguine": {
      "word": "जिंदादिल",
      "description": "ऊर्जा से भरपूर रहता है"
    },
    "18:Phlegmatic": {
      "word": "तृप्त",
      "description": "परिस्थिति में संतोष पाता है"
    },
    "18:Choleric": {
      "word": "प्रमुख",
      "description": "काम की कमान संभालता है"
    },
    "18:Melancholy": {
      "word": "चार्ट बनाने वाला",
      "description": "जानकारी को क्रम में रखता है"
    },
    "18:Sanguine": {
      "word": "आकर्षक",
      "description": "मनमोहक व्यवहार से ध्यान खींचता है"
    },
    "19:Melancholy": {
      "word": "पूर्णतावादी",
      "description": "हर काम में शुद्धता चाहता है"
    },
    "19:Phlegmatic": {
      "word": "सुखद",
      "description": "नम्रता से अच्छा माहौल बनाता है"
    },
    "19:Choleric": {
      "word": "उत्पादक",
      "description": "काम से ठोस परिणाम लाता है"
    },
    "19:Sanguine": {
      "word": "लोकप्रिय",
      "description": "लोगों को साथ रहना अच्छा लगता है"
    },
    "20:Sanguine": {
      "word": "चंचल",
      "description": "उछलते उत्साह से भरा रहता है"
    },
    "20:Choleric": {
      "word": "निर्भीक",
      "description": "आत्मविश्वास से आगे आता है"
    },
    "20:Melancholy": {
      "word": "शिष्ट",
      "description": "उचित व्यवहार का ध्यान रखता है"
    },
    "20:Phlegmatic": {
      "word": "संतुलित",
      "description": "भावनाओं में स्थिर रहता है"
    },
    "21:Phlegmatic": {
      "word": "भावशून्य",
      "description": "चेहरे पर कम भाव दिखाता है"
    },
    "21:Melancholy": {
      "word": "झेंपू",
      "description": "ध्यान मिलने पर असहज होता है"
    },
    "21:Sanguine": {
      "word": "ढीठ",
      "description": "बिना संकोच खुद को जताता है"
    },
    "21:Choleric": {
      "word": "हुक्म चलाने वाला",
      "description": "दूसरों को आदेश देता रहता है"
    },
    "22:Sanguine": {
      "word": "अनुशासनहीन",
      "description": "नियम और दिनचर्या नहीं निभाता"
    },
    "22:Choleric": {
      "word": "असंवेदनशील",
      "description": "दूसरों का दुख समझने में चूकता है"
    },
    "22:Phlegmatic": {
      "word": "उत्साहहीन",
      "description": "काम में रुचि कम दिखाता है"
    },
    "22:Melancholy": {
      "word": "क्षमा न करने वाला",
      "description": "पुरानी गलती छोड़ नहीं पाता"
    },
    "23:Phlegmatic": {
      "word": "अल्पभाषी",
      "description": "मन की बात दबाकर रखता है"
    },
    "23:Melancholy": {
      "word": "रुष्ट",
      "description": "मन में नाराजगी रखता है"
    },
    "23:Choleric": {
      "word": "विरोधी",
      "description": "बदलाव को स्वीकार नहीं करता"
    },
    "23:Sanguine": {
      "word": "दोहराने वाला",
      "description": "एक ही बात बार-बार कहता है"
    },
    "24:Melancholy": {
      "word": "नुक्ताचीनी करने वाला",
      "description": "छोटी कमियों पर अटकता है"
    },
    "24:Phlegmatic": {
      "word": "भयभीत",
      "description": "अनहोनी का डर रखता है"
    },
    "24:Sanguine": {
      "word": "भुलक्कड़",
      "description": "जरूरी बातें याद नहीं रखता"
    },
    "24:Choleric": {
      "word": "मुंहफट",
      "description": "परिणाम सोचे बिना साफ बोलता है"
    },
    "25:Choleric": {
      "word": "अधीर",
      "description": "देरी सहन नहीं कर पाता"
    },
    "25:Melancholy": {
      "word": "असुरक्षित",
      "description": "अपनी योग्यता पर संदेह करता है"
    },
    "25:Phlegmatic": {
      "word": "अनिर्णायक",
      "description": "फैसला लेने में अटकता है"
    },
    "25:Sanguine": {
      "word": "बीच में टोकने वाला",
      "description": "दूसरे की बात काटता है"
    },
    "26:Melancholy": {
      "word": "अलोकप्रिय",
      "description": "लोगों से तालमेल कम बनता है"
    },
    "26:Phlegmatic": {
      "word": "अलग रहने वाला",
      "description": "गतिविधियों में शामिल नहीं होता"
    },
    "26:Sanguine": {
      "word": "अप्रत्याशित",
      "description": "व्यवहार अचानक बदल देता है"
    },
    "26:Choleric": {
      "word": "स्नेह न दिखाने वाला",
      "description": "अपनापन व्यक्त नहीं करता"
    },
    "27:Choleric": {
      "word": "हठी",
      "description": "अपनी ही बात पर अड़ता है"
    },
    "27:Sanguine": {
      "word": "बेतरतीब",
      "description": "बिना क्रम के काम करता है"
    },
    "27:Melancholy": {
      "word": "मुश्किल से खुश होने वाला",
      "description": "आसानी से संतुष्ट नहीं होता"
    },
    "27:Phlegmatic": {
      "word": "हिचकिचाने वाला",
      "description": "कदम उठाने में संकोच करता है"
    },
    "28:Phlegmatic": {
      "word": "साधारण",
      "description": "खुद को खास ढंग से नहीं जताता"
    },
    "28:Melancholy": {
      "word": "निराशावादी",
      "description": "बुरा परिणाम पहले सोचता है"
    },
    "28:Choleric": {
      "word": "अभिमानी",
      "description": "खुद को दूसरों से ऊपर मानता है"
    },
    "28:Sanguine": {
      "word": "ढील देने वाला",
      "description": "गलत व्यवहार भी चलने देता है"
    },
    "29:Sanguine": {
      "word": "जल्दी नाराज होने वाला",
      "description": "छोटी बात पर गुस्सा होता है"
    },
    "29:Phlegmatic": {
      "word": "दिशाहीन",
      "description": "स्पष्ट लक्ष्य के बिना चलता है"
    },
    "29:Choleric": {
      "word": "बहसबाज",
      "description": "बात को बहस में बदलता है"
    },
    "29:Melancholy": {
      "word": "अलग-थलग",
      "description": "लोगों से दूरी महसूस करता है"
    },
    "30:Sanguine": {
      "word": "भोला",
      "description": "बिना जांचे जल्दी भरोसा करता है"
    },
    "30:Melancholy": {
      "word": "नकारात्मक",
      "description": "कमियां और बाधाएं पहले देखता है"
    },
    "30:Choleric": {
      "word": "धृष्ट",
      "description": "बिना झिझक सीमा लांघता है"
    },
    "30:Phlegmatic": {
      "word": "बेपरवाह",
      "description": "चिंता या रुचि कम दिखाता है"
    },
    "31:Phlegmatic": {
      "word": "चिंतित",
      "description": "संभावित मुश्किलें सोचता रहता है"
    },
    "31:Melancholy": {
      "word": "सिमटा हुआ",
      "description": "लोगों से बातचीत टालता है"
    },
    "31:Choleric": {
      "word": "काम में डूबा हुआ",
      "description": "आराम से ज्यादा काम को रखता है"
    },
    "31:Sanguine": {
      "word": "श्रेय चाहने वाला",
      "description": "अपने योगदान की प्रशंसा चाहता है"
    },
    "32:Melancholy": {
      "word": "अति संवेदनशील",
      "description": "बातों से जल्दी आहत होता है"
    },
    "32:Choleric": {
      "word": "अव्यवहारकुशल",
      "description": "बोलते समय भावना का ध्यान नहीं रखता"
    },
    "32:Phlegmatic": {
      "word": "दब्बू",
      "description": "आगे आने में डरता है"
    },
    "32:Sanguine": {
      "word": "बहुत बोलने वाला",
      "description": "दूसरों को बोलने का कम मौका देता है"
    },
    "33:Phlegmatic": {
      "word": "शंकालु",
      "description": "अपने फैसले पर भरोसा नहीं करता"
    },
    "33:Sanguine": {
      "word": "अव्यवस्थित",
      "description": "काम और चीजें संभाल नहीं पाता"
    },
    "33:Choleric": {
      "word": "दबदबा रखने वाला",
      "description": "दूसरों पर अपना नियंत्रण चाहता है"
    },
    "33:Melancholy": {
      "word": "उदास",
      "description": "निराशा में मन भारी रहता है"
    },
    "34:Sanguine": {
      "word": "अस्थिर",
      "description": "इरादे और व्यवहार बदलता रहता है"
    },
    "34:Melancholy": {
      "word": "अंतर्मुखी",
      "description": "अपने विचारों में अधिक रहता है"
    },
    "34:Choleric": {
      "word": "असहिष्णु",
      "description": "अलग तरीके सहन नहीं करता"
    },
    "34:Phlegmatic": {
      "word": "उदासीन",
      "description": "दूसरों के मामलों में रुचि नहीं लेता"
    },
    "35:Sanguine": {
      "word": "अस्तव्यस्त",
      "description": "चीजें बिखरी छोड़ देता है"
    },
    "35:Melancholy": {
      "word": "मिजाजी",
      "description": "मनःस्थिति जल्दी बदलती है"
    },
    "35:Phlegmatic": {
      "word": "बुदबुदाने वाला",
      "description": "धीमे और अस्पष्ट बोलता है"
    },
    "35:Choleric": {
      "word": "जोड़तोड़ करने वाला",
      "description": "लाभ के लिए दूसरों को मोड़ता है"
    },
    "36:Phlegmatic": {
      "word": "धीमा",
      "description": "काम शुरू करने में देर लगाता है"
    },
    "36:Choleric": {
      "word": "जिद्दी",
      "description": "राय बदलने से मना करता है"
    },
    "36:Sanguine": {
      "word": "दिखावटी",
      "description": "सबका ध्यान खुद पर चाहता है"
    },
    "36:Melancholy": {
      "word": "संदेहवादी",
      "description": "दूसरों की मंशा पर सवाल करता है"
    },
    "37:Melancholy": {
      "word": "एकाकी",
      "description": "अकेले रहना चुनता है"
    },
    "37:Choleric": {
      "word": "रोब जमाने वाला",
      "description": "खुद को अधिकारी बनाकर पेश करता है"
    },
    "37:Phlegmatic": {
      "word": "आलसी",
      "description": "मेहनत से बचने की कोशिश करता है"
    },
    "37:Sanguine": {
      "word": "ऊंची आवाज वाला",
      "description": "जरूरत से अधिक जोर से बोलता है"
    },
    "38:Phlegmatic": {
      "word": "सुस्त",
      "description": "काम में ऊर्जा कम लगाता है"
    },
    "38:Melancholy": {
      "word": "सशंक",
      "description": "दूसरों पर आसानी से भरोसा नहीं करता"
    },
    "38:Choleric": {
      "word": "चिड़चिड़ा",
      "description": "जल्दी अपना आपा खोता है"
    },
    "38:Sanguine": {
      "word": "भटका हुआ",
      "description": "ध्यान एक जगह नहीं टिकता"
    },
    "39:Melancholy": {
      "word": "बदला लेने वाला",
      "description": "चोट का बदला चुकाना चाहता है"
    },
    "39:Sanguine": {
      "word": "बेचैन",
      "description": "एक जगह टिकना मुश्किल लगता है"
    },
    "39:Phlegmatic": {
      "word": "अनिच्छुक",
      "description": "नई जिम्मेदारी लेने से कतराता है"
    },
    "39:Choleric": {
      "word": "उतावला",
      "description": "परिणाम सोचे बिना कदम उठाता है"
    },
    "40:Phlegmatic": {
      "word": "समझौता करने वाला",
      "description": "टकराव टालने को अपनी बात छोड़ता है"
    },
    "40:Melancholy": {
      "word": "आलोचक",
      "description": "दूसरों की गलतियां ढूंढ़ता है"
    },
    "40:Choleric": {
      "word": "चालाक",
      "description": "अपने लाभ के लिए चाल चलता है"
    },
    "40:Sanguine": {
      "word": "परिवर्तनशील",
      "description": "मन और पसंद जल्दी बदलता है"
    }
  },
  "gu": {
    "1:Choleric": {
      "word": "સાહસિક",
      "description": "નવા પડકારો સ્વીકારે છે"
    },
    "1:Phlegmatic": {
      "word": "અનુકૂળ",
      "description": "ફેરફારમાં ઢળી જાય છે"
    },
    "1:Sanguine": {
      "word": "જીવંત",
      "description": "હાવભાવથી ઉત્સાહ બતાવે છે"
    },
    "1:Melancholy": {
      "word": "વિશ્લેષક",
      "description": "વાતોને તર્કથી તપાસે છે"
    },
    "2:Melancholy": {
      "word": "દૃઢ",
      "description": "શરૂ કરેલું કામ પૂરું કરે છે"
    },
    "2:Sanguine": {
      "word": "રમૂજી",
      "description": "હાસ્ય અને રમત ગમે છે"
    },
    "2:Choleric": {
      "word": "સમજાવનાર",
      "description": "તથ્યોથી સહમત કરે છે"
    },
    "2:Phlegmatic": {
      "word": "શાંતિપ્રિય",
      "description": "ઝઘડાથી દૂર રહે છે"
    },
    "3:Phlegmatic": {
      "word": "આજ્ઞાંકિત",
      "description": "બીજાની વાત સહેલાઈથી માને છે"
    },
    "3:Melancholy": {
      "word": "ત્યાગી",
      "description": "બીજા માટે પોતાનો લાભ છોડે છે"
    },
    "3:Sanguine": {
      "word": "મિલનસાર",
      "description": "લોકો સાથે રહેવું ગમે છે"
    },
    "3:Choleric": {
      "word": "દૃઢ ઇચ્છાશક્તિવાળો",
      "description": "પોતાનો નિર્ણય નિભાવે છે"
    },
    "4:Melancholy": {
      "word": "વિચારશીલ",
      "description": "બીજાની લાગણીનું ધ્યાન રાખે છે"
    },
    "4:Phlegmatic": {
      "word": "સંયમિત",
      "description": "લાગણીઓને કાબૂમાં રાખે છે"
    },
    "4:Choleric": {
      "word": "સ્પર્ધાત્મક",
      "description": "જીતવાનો પ્રયાસ કરે છે"
    },
    "4:Sanguine": {
      "word": "પ્રભાવક",
      "description": "આકર્ષક રીતે વાત મનાવે છે"
    },
    "5:Sanguine": {
      "word": "તાજગી આપનાર",
      "description": "સાથે નવો ઉત્સાહ લાવે છે"
    },
    "5:Melancholy": {
      "word": "આદરપૂર્ણ",
      "description": "બીજાને માન આપે છે"
    },
    "5:Phlegmatic": {
      "word": "અલ્પભાષી",
      "description": "અંગત વાતો ઓછી કહે છે"
    },
    "5:Choleric": {
      "word": "સાધનસંપન્ન",
      "description": "ઉપલબ્ધ સાધનોથી ઉકેલ શોધે છે"
    },
    "6:Phlegmatic": {
      "word": "સંતુષ્ટ",
      "description": "જે છે તેમાં ખુશ રહે છે"
    },
    "6:Melancholy": {
      "word": "સંવેદનશીલ",
      "description": "લાગણીઓ ઝડપથી સમજે છે"
    },
    "6:Choleric": {
      "word": "આત્મનિર્ભર",
      "description": "પોતાના બળે કામ કરે છે"
    },
    "6:Sanguine": {
      "word": "જોશીલો",
      "description": "કામમાં ઊર્જા ભરે છે"
    },
    "7:Melancholy": {
      "word": "આયોજક",
      "description": "કામ અગાઉથી નક્કી કરે છે"
    },
    "7:Phlegmatic": {
      "word": "ધીરજવાળો",
      "description": "ચિડાયા વિના રાહ જુએ છે"
    },
    "7:Choleric": {
      "word": "હકારાત્મક",
      "description": "સારા પરિણામની આશા રાખે છે"
    },
    "7:Sanguine": {
      "word": "પ્રોત્સાહક",
      "description": "બીજાને ભાગ લેવા પ્રેરે છે"
    },
    "8:Choleric": {
      "word": "નિશ્ચિત",
      "description": "પોતાના નિર્ણય પર વિશ્વાસ રાખે છે"
    },
    "8:Sanguine": {
      "word": "સહજ",
      "description": "પ્રસંગે તરત પગલું ભરે છે"
    },
    "8:Melancholy": {
      "word": "સમયબદ્ધ",
      "description": "નક્કી સમય પ્રમાણે ચાલે છે"
    },
    "8:Phlegmatic": {
      "word": "શરમાળ",
      "description": "ધ્યાનનું કેન્દ્ર બનવાનું ટાળે છે"
    },
    "9:Melancholy": {
      "word": "સુવ્યવસ્થિત",
      "description": "વસ્તુઓ યોગ્ય જગ્યાએ રાખે છે"
    },
    "9:Phlegmatic": {
      "word": "સહયોગી",
      "description": "મદદ કરવા તૈયાર રહે છે"
    },
    "9:Choleric": {
      "word": "સ્પષ્ટવક્તા",
      "description": "પોતાની વાત ખુલ્લી કહે છે"
    },
    "9:Sanguine": {
      "word": "આશાવાદી",
      "description": "ભવિષ્યની સારી બાજુ જુએ છે"
    },
    "10:Phlegmatic": {
      "word": "મૈત્રીપૂર્ણ",
      "description": "જલદી મિત્રતા કરે છે"
    },
    "10:Melancholy": {
      "word": "નિષ્ઠાવાન",
      "description": "સંબંધોમાં વિશ્વાસ નિભાવે છે"
    },
    "10:Sanguine": {
      "word": "હસમુખો",
      "description": "હાસ્યથી લોકોને હસાવે છે"
    },
    "10:Choleric": {
      "word": "પ્રબળ",
      "description": "દૃઢતાથી કામ આગળ વધારે છે"
    },
    "11:Choleric": {
      "word": "નિર્ભય",
      "description": "જોખમથી ગભરાતો નથી"
    },
    "11:Sanguine": {
      "word": "મનભાવન",
      "description": "સાથમાં આનંદ આપે છે"
    },
    "11:Phlegmatic": {
      "word": "મુત્સદ્દી",
      "description": "મતભેદ કુશળતાથી ઉકેલે છે"
    },
    "11:Melancholy": {
      "word": "બારીકાઈવાળો",
      "description": "નાની વાતો પર ધ્યાન આપે છે"
    },
    "12:Sanguine": {
      "word": "પ્રસન્ન",
      "description": "ખુશમિજાજ રહે છે"
    },
    "12:Phlegmatic": {
      "word": "નિયમિત",
      "description": "વર્તનમાં સ્થિર રહે છે"
    },
    "12:Melancholy": {
      "word": "સુસંસ્કૃત",
      "description": "શિષ્ટાચાર અને કલા સમજે છે"
    },
    "12:Choleric": {
      "word": "આત્મવિશ્વાસુ",
      "description": "પોતાની ક્ષમતા પર વિશ્વાસ રાખે છે"
    },
    "13:Melancholy": {
      "word": "આદર્શવાદી",
      "description": "ઊંચા ધોરણો તરફ વધે છે"
    },
    "13:Choleric": {
      "word": "સ્વતંત્ર",
      "description": "પોતાના નિર્ણય જાતે લે છે"
    },
    "13:Phlegmatic": {
      "word": "બિનઆક્રમક",
      "description": "કોઈને દુઃખ આપવાનું ટાળે છે"
    },
    "13:Sanguine": {
      "word": "પ્રેરક",
      "description": "બીજામાં ઉત્સાહ જગાવે છે"
    },
    "14:Sanguine": {
      "word": "અભિવ્યક્તિશીલ",
      "description": "લાગણીઓ ખુલ્લી દર્શાવે છે"
    },
    "14:Choleric": {
      "word": "નિર્ણાયક",
      "description": "સમયસર સ્પષ્ટ નિર્ણય લે છે"
    },
    "14:Phlegmatic": {
      "word": "સૂક્ષ્મ રમૂજવાળો",
      "description": "ગંભીર સ્વરે રમૂજ કરે છે"
    },
    "14:Melancholy": {
      "word": "ગહન",
      "description": "વાતના ઊંડાણમાં વિચારે છે"
    },
    "15:Phlegmatic": {
      "word": "મધ્યસ્થી",
      "description": "ઝઘડતા લોકોમાં સમાધાન કરાવે છે"
    },
    "15:Melancholy": {
      "word": "સંગીતપ્રેમી",
      "description": "સંગીતનો લય અનુભવે છે"
    },
    "15:Choleric": {
      "word": "કર્મશીલ",
      "description": "લોકોને કામે લગાડે છે"
    },
    "15:Sanguine": {
      "word": "હળીમળીનાર",
      "description": "અજાણ્યા લોકો સાથે સહજ જોડાય છે"
    },
    "16:Melancholy": {
      "word": "વિચારપૂર્વક વર્તનાર",
      "description": "નિર્ણય પહેલાં બીજાનો વિચાર કરે છે"
    },
    "16:Choleric": {
      "word": "અડગ",
      "description": "મુશ્કેલીમાં પણ પ્રયત્ન છોડતો નથી"
    },
    "16:Sanguine": {
      "word": "વાતોડિયો",
      "description": "વાતચીત શરૂ કરવી ગમે છે"
    },
    "16:Phlegmatic": {
      "word": "સહનશીલ",
      "description": "જુદા વિચારો સ્વીકારે છે"
    },
    "17:Phlegmatic": {
      "word": "શ્રોતા",
      "description": "બીજાને ધ્યાનથી સાંભળે છે"
    },
    "17:Melancholy": {
      "word": "વફાદાર",
      "description": "સાથ અને વિશ્વાસ જાળવે છે"
    },
    "17:Choleric": {
      "word": "નેતા",
      "description": "દિશા આપી જવાબદારી લે છે"
    },
    "17:Sanguine": {
      "word": "જિંદાદિલ",
      "description": "ઊર્જાથી ભરપૂર રહે છે"
    },
    "18:Phlegmatic": {
      "word": "સંતોષી",
      "description": "પરિસ્થિતિમાં સંતોષ પામે છે"
    },
    "18:Choleric": {
      "word": "મુખ્ય",
      "description": "કામની કમાન સંભાળે છે"
    },
    "18:Melancholy": {
      "word": "ચાર્ટ બનાવનાર",
      "description": "માહિતીને ક્રમમાં ગોઠવે છે"
    },
    "18:Sanguine": {
      "word": "મોહક",
      "description": "મનોહર વર્તનથી ધ્યાન ખેંચે છે"
    },
    "19:Melancholy": {
      "word": "સંપૂર્ણતાવાદી",
      "description": "દરેક કામમાં ચોકસાઈ ઇચ્છે છે"
    },
    "19:Phlegmatic": {
      "word": "સુખદ",
      "description": "નમ્રતાથી સારું વાતાવરણ બનાવે છે"
    },
    "19:Choleric": {
      "word": "ઉત્પાદક",
      "description": "કામથી નક્કર પરિણામ લાવે છે"
    },
    "19:Sanguine": {
      "word": "લોકપ્રિય",
      "description": "લોકોને સાથે રહેવું ગમે છે"
    },
    "20:Sanguine": {
      "word": "ઉછળકૂદિયો",
      "description": "ઉછળતા ઉત્સાહથી ભરેલો રહે છે"
    },
    "20:Choleric": {
      "word": "નિર્ભીક",
      "description": "આત્મવિશ્વાસથી આગળ આવે છે"
    },
    "20:Melancholy": {
      "word": "શિષ્ટ",
      "description": "યોગ્ય વર્તનનું ધ્યાન રાખે છે"
    },
    "20:Phlegmatic": {
      "word": "સંતુલિત",
      "description": "લાગણીઓમાં સ્થિર રહે છે"
    },
    "21:Phlegmatic": {
      "word": "ભાવશૂન્ય",
      "description": "ચહેરા પર ઓછા ભાવ દર્શાવે છે"
    },
    "21:Melancholy": {
      "word": "સંકોચશીલ",
      "description": "ધ્યાન મળતાં અસ્વસ્થ થાય છે"
    },
    "21:Sanguine": {
      "word": "ઢીઠ",
      "description": "સંકોચ વિના પોતાને દર્શાવે છે"
    },
    "21:Choleric": {
      "word": "હુકમ ચલાવનાર",
      "description": "બીજાને આદેશ આપ્યા કરે છે"
    },
    "22:Sanguine": {
      "word": "શિસ્તહીન",
      "description": "નિયમ અને દિનચર્યા પાળતો નથી"
    },
    "22:Choleric": {
      "word": "અસંવેદનશીલ",
      "description": "બીજાનું દુઃખ સમજવામાં ચૂકે છે"
    },
    "22:Phlegmatic": {
      "word": "ઉત્સાહહીન",
      "description": "કામમાં રસ ઓછો દર્શાવે છે"
    },
    "22:Melancholy": {
      "word": "માફ ન કરનાર",
      "description": "જૂની ભૂલ છોડી શકતો નથી"
    },
    "23:Phlegmatic": {
      "word": "મિતભાષી",
      "description": "મનની વાત દબાવી રાખે છે"
    },
    "23:Melancholy": {
      "word": "રોષ રાખનાર",
      "description": "મનમાં નારાજગી રાખે છે"
    },
    "23:Choleric": {
      "word": "વિરોધી",
      "description": "ફેરફાર સ્વીકારતો નથી"
    },
    "23:Sanguine": {
      "word": "પુનરાવર્તક",
      "description": "એક જ વાત વારંવાર કહે છે"
    },
    "24:Melancholy": {
      "word": "ઝીણી વાતે વાંધો કાઢનાર",
      "description": "નાની ખામીઓ પર અટકે છે"
    },
    "24:Phlegmatic": {
      "word": "ભયભીત",
      "description": "અનિષ્ટનો ભય રાખે છે"
    },
    "24:Sanguine": {
      "word": "ભૂલકણો",
      "description": "જરૂરી વાતો યાદ રાખતો નથી"
    },
    "24:Choleric": {
      "word": "મોઢેફાટ",
      "description": "પરિણામ વિચાર્યા વિના બોલે છે"
    },
    "25:Choleric": {
      "word": "અધીરો",
      "description": "વિલંબ સહન કરી શકતો નથી"
    },
    "25:Melancholy": {
      "word": "અસુરક્ષિત",
      "description": "પોતાની યોગ્યતા પર શંકા કરે છે"
    },
    "25:Phlegmatic": {
      "word": "અનિર્ણાયક",
      "description": "નિર્ણય લેવામાં અટકે છે"
    },
    "25:Sanguine": {
      "word": "વચ્ચે ટોકનાર",
      "description": "બીજાની વાત કાપે છે"
    },
    "26:Melancholy": {
      "word": "અલોકપ્રિય",
      "description": "લોકો સાથે મેળ ઓછો પડે છે"
    },
    "26:Phlegmatic": {
      "word": "અલિપ્ત",
      "description": "પ્રવૃત્તિઓમાં સામેલ થતો નથી"
    },
    "26:Sanguine": {
      "word": "અણધાર્યો",
      "description": "વર્તન અચાનક બદલે છે"
    },
    "26:Choleric": {
      "word": "સ્નેહ ન દર્શાવનાર",
      "description": "આત્મીયતા વ્યક્ત કરતો નથી"
    },
    "27:Choleric": {
      "word": "હઠી",
      "description": "પોતાની જ વાતે અડે છે"
    },
    "27:Sanguine": {
      "word": "અસ્તવ્યસ્ત",
      "description": "ક્રમ વિના કામ કરે છે"
    },
    "27:Melancholy": {
      "word": "મુશ્કેલીથી ખુશ થનાર",
      "description": "સહેલાઈથી સંતુષ્ટ થતો નથી"
    },
    "27:Phlegmatic": {
      "word": "અચકાનાર",
      "description": "પગલું ભરવામાં સંકોચ કરે છે"
    },
    "28:Phlegmatic": {
      "word": "સાદો",
      "description": "પોતાને ખાસ રીતે દર્શાવતો નથી"
    },
    "28:Melancholy": {
      "word": "નિરાશાવાદી",
      "description": "ખરાબ પરિણામ પહેલાં વિચારે છે"
    },
    "28:Choleric": {
      "word": "અભિમાની",
      "description": "પોતાને બીજાથી ઊંચો માને છે"
    },
    "28:Sanguine": {
      "word": "ઢીલ આપનાર",
      "description": "ખોટું વર્તન પણ ચાલવા દે છે"
    },
    "29:Sanguine": {
      "word": "જલદી ગુસ્સે થનાર",
      "description": "નાની વાતે ગુસ્સે થાય છે"
    },
    "29:Phlegmatic": {
      "word": "દિશાહીન",
      "description": "સ્પષ્ટ લક્ષ્ય વિના ચાલે છે"
    },
    "29:Choleric": {
      "word": "દલીલબાજ",
      "description": "વાતને દલીલમાં ફેરવે છે"
    },
    "29:Melancholy": {
      "word": "અલગ પડેલો",
      "description": "લોકોથી અંતર અનુભવે છે"
    },
    "30:Sanguine": {
      "word": "ભોળો",
      "description": "તપાસ્યા વિના જલદી વિશ્વાસ કરે છે"
    },
    "30:Melancholy": {
      "word": "નકારાત્મક",
      "description": "ખામીઓ અને અવરોધો પહેલાં જુએ છે"
    },
    "30:Choleric": {
      "word": "ધૃષ્ટ",
      "description": "ખચકાટ વિના મર્યાદા ઓળંગે છે"
    },
    "30:Phlegmatic": {
      "word": "બેદરકાર",
      "description": "ચિંતા કે રસ ઓછો દર્શાવે છે"
    },
    "31:Phlegmatic": {
      "word": "ચિંતિત",
      "description": "સંભવિત મુશ્કેલીઓ વિચાર્યા કરે છે"
    },
    "31:Melancholy": {
      "word": "પોતામાં રહેનાર",
      "description": "લોકો સાથે વાતચીત ટાળે છે"
    },
    "31:Choleric": {
      "word": "કામમાં ડૂબેલો",
      "description": "આરામ કરતાં કામને વધુ રાખે છે"
    },
    "31:Sanguine": {
      "word": "શ્રેય ઇચ્છનાર",
      "description": "પોતાના યોગદાનની પ્રશંસા ઇચ્છે છે"
    },
    "32:Melancholy": {
      "word": "અતિ સંવેદનશીલ",
      "description": "વાતોથી જલદી દુભાય છે"
    },
    "32:Choleric": {
      "word": "વ્યવહારકુશળતાવિહોણો",
      "description": "બોલતાં લાગણીનું ધ્યાન રાખતો નથી"
    },
    "32:Phlegmatic": {
      "word": "દબાયેલો",
      "description": "આગળ આવતાં ડરે છે"
    },
    "32:Sanguine": {
      "word": "બહુ બોલનાર",
      "description": "બીજાને બોલવાનો ઓછો મોકો આપે છે"
    },
    "33:Phlegmatic": {
      "word": "શંકાશીલ",
      "description": "પોતાના નિર્ણય પર વિશ્વાસ કરતો નથી"
    },
    "33:Sanguine": {
      "word": "અવ્યવસ્થિત",
      "description": "કામ અને વસ્તુઓ સંભાળી શકતો નથી"
    },
    "33:Choleric": {
      "word": "વર્ચસ્વ જમાવનાર",
      "description": "બીજા પર પોતાનું નિયંત્રણ ઇચ્છે છે"
    },
    "33:Melancholy": {
      "word": "ઉદાસ",
      "description": "નિરાશામાં મન ભારે રહે છે"
    },
    "34:Sanguine": {
      "word": "અસ્થિર",
      "description": "ઇરાદા અને વર્તન બદલ્યા કરે છે"
    },
    "34:Melancholy": {
      "word": "અંતર્મુખી",
      "description": "પોતાના વિચારોમાં વધુ રહે છે"
    },
    "34:Choleric": {
      "word": "અસહિષ્ણુ",
      "description": "જુદી રીતો સહન કરતો નથી"
    },
    "34:Phlegmatic": {
      "word": "ઉદાસીન",
      "description": "બીજાની બાબતોમાં રસ લેતો નથી"
    },
    "35:Sanguine": {
      "word": "અસ્તવ્યસ્ત",
      "description": "વસ્તુઓ વિખેરેલી મૂકે છે"
    },
    "35:Melancholy": {
      "word": "મિજાજી",
      "description": "મનોદશા જલદી બદલાય છે"
    },
    "35:Phlegmatic": {
      "word": "બબડનાર",
      "description": "ધીમું અને અસ્પષ્ટ બોલે છે"
    },
    "35:Choleric": {
      "word": "ચાલબાજ",
      "description": "લાભ માટે બીજાને વાળે છે"
    },
    "36:Phlegmatic": {
      "word": "ધીમો",
      "description": "કામ શરૂ કરવામાં મોડું કરે છે"
    },
    "36:Choleric": {
      "word": "જિદ્દી",
      "description": "મત બદલવાની ના પાડે છે"
    },
    "36:Sanguine": {
      "word": "દેખાડો કરનાર",
      "description": "સૌનું ધ્યાન પોતે ઇચ્છે છે"
    },
    "36:Melancholy": {
      "word": "સંદેહવાદી",
      "description": "બીજાના હેતુ પર સવાલ કરે છે"
    },
    "37:Melancholy": {
      "word": "એકાકી",
      "description": "એકલા રહેવાનું પસંદ કરે છે"
    },
    "37:Choleric": {
      "word": "રોફ જમાવનાર",
      "description": "પોતાને અધિકારી તરીકે રજૂ કરે છે"
    },
    "37:Phlegmatic": {
      "word": "આળસુ",
      "description": "મહેનતથી બચવાનો પ્રયાસ કરે છે"
    },
    "37:Sanguine": {
      "word": "મોટા અવાજવાળો",
      "description": "જરૂર કરતાં વધુ જોરથી બોલે છે"
    },
    "38:Phlegmatic": {
      "word": "સુસ્ત",
      "description": "કામમાં ઊર્જા ઓછી લગાડે છે"
    },
    "38:Melancholy": {
      "word": "શંકાખોર",
      "description": "બીજા પર સહેલાઈથી વિશ્વાસ કરતો નથી"
    },
    "38:Choleric": {
      "word": "ચીડિયો",
      "description": "જલદી પોતાનો કાબૂ ગુમાવે છે"
    },
    "38:Sanguine": {
      "word": "વિખરાયેલા ધ્યાનવાળો",
      "description": "ધ્યાન એક જગ્યાએ ટકતું નથી"
    },
    "39:Melancholy": {
      "word": "બદલો લેનાર",
      "description": "દુઃખનો બદલો લેવા ઇચ્છે છે"
    },
    "39:Sanguine": {
      "word": "બેચેન",
      "description": "એક જગ્યાએ ટકવું મુશ્કેલ લાગે છે"
    },
    "39:Phlegmatic": {
      "word": "અનિચ્છુક",
      "description": "નવી જવાબદારી લેતાં કચવાય છે"
    },
    "39:Choleric": {
      "word": "ઉતાવળિયો",
      "description": "પરિણામ વિચાર્યા વિના પગલું ભરે છે"
    },
    "40:Phlegmatic": {
      "word": "સમાધાન કરનાર",
      "description": "ટકરાવ ટાળવા પોતાની વાત છોડે છે"
    },
    "40:Melancholy": {
      "word": "ટીકાકાર",
      "description": "બીજાની ભૂલો શોધે છે"
    },
    "40:Choleric": {
      "word": "કપટી",
      "description": "પોતાના લાભ માટે ચાલ ચાલે છે"
    },
    "40:Sanguine": {
      "word": "બદલાતો",
      "description": "મન અને પસંદ જલદી બદલે છે"
    }
  },
  "mr": {
    "1:Choleric": {
      "word": "साहसी",
      "description": "नवी आव्हाने स्वीकारतो"
    },
    "1:Phlegmatic": {
      "word": "जुळवून घेणारा",
      "description": "बदलाशी जुळवून घेतो"
    },
    "1:Sanguine": {
      "word": "उत्साही",
      "description": "हावभावातून उत्साह दाखवतो"
    },
    "1:Melancholy": {
      "word": "विश्लेषक",
      "description": "गोष्टी तर्काने तपासतो"
    },
    "2:Melancholy": {
      "word": "चिकाटीचा",
      "description": "सुरू केलेले काम पूर्ण करतो"
    },
    "2:Sanguine": {
      "word": "खेळकर",
      "description": "हसणे आणि खेळणे आवडते"
    },
    "2:Choleric": {
      "word": "पटवणारा",
      "description": "तथ्यांनी मत पटवतो"
    },
    "2:Phlegmatic": {
      "word": "शांतताप्रिय",
      "description": "वादापासून दूर राहतो"
    },
    "3:Phlegmatic": {
      "word": "आज्ञाधारक",
      "description": "इतरांचे मत सहज स्वीकारतो"
    },
    "3:Melancholy": {
      "word": "त्यागी",
      "description": "इतरांसाठी स्वतःचा लाभ सोडतो"
    },
    "3:Sanguine": {
      "word": "मिळूनमिसळून राहणारा",
      "description": "लोकांचा सहवास आवडतो"
    },
    "3:Choleric": {
      "word": "दृढ इच्छाशक्तीचा",
      "description": "स्वतःचा निर्णय पाळतो"
    },
    "4:Melancholy": {
      "word": "विचारी",
      "description": "इतरांच्या भावनांची काळजी घेतो"
    },
    "4:Phlegmatic": {
      "word": "संयमी",
      "description": "भावना नियंत्रणात ठेवतो"
    },
    "4:Choleric": {
      "word": "स्पर्धात्मक",
      "description": "जिंकण्यासाठी प्रयत्न करतो"
    },
    "4:Sanguine": {
      "word": "प्रभावी",
      "description": "आकर्षक पद्धतीने मत पटवतो"
    },
    "5:Sanguine": {
      "word": "प्रसन्न करणारा",
      "description": "सोबत नवा उत्साह आणतो"
    },
    "5:Melancholy": {
      "word": "आदरशील",
      "description": "इतरांना मान देतो"
    },
    "5:Phlegmatic": {
      "word": "मितभाषी",
      "description": "खासगी गोष्टी कमी सांगतो"
    },
    "5:Choleric": {
      "word": "उपायशील",
      "description": "उपलब्ध साधनांतून मार्ग शोधतो"
    },
    "6:Phlegmatic": {
      "word": "समाधानी",
      "description": "जे आहे त्यात आनंदी राहतो"
    },
    "6:Melancholy": {
      "word": "संवेदनशील",
      "description": "भावना लवकर समजतो"
    },
    "6:Choleric": {
      "word": "स्वावलंबी",
      "description": "स्वतःच्या बळावर काम करतो"
    },
    "6:Sanguine": {
      "word": "जोशपूर्ण",
      "description": "कामात ऊर्जा आणतो"
    },
    "7:Melancholy": {
      "word": "नियोजन करणारा",
      "description": "काम आधीच ठरवतो"
    },
    "7:Phlegmatic": {
      "word": "धीराचा",
      "description": "न चिडता वाट पाहतो"
    },
    "7:Choleric": {
      "word": "सकारात्मक",
      "description": "चांगल्या निकालाची आशा ठेवतो"
    },
    "7:Sanguine": {
      "word": "प्रोत्साहक",
      "description": "इतरांना सहभागी होण्यास प्रेरित करतो"
    },
    "8:Choleric": {
      "word": "खात्री असणारा",
      "description": "स्वतःच्या निर्णयावर विश्वास ठेवतो"
    },
    "8:Sanguine": {
      "word": "उत्स्फूर्त",
      "description": "प्रसंगानुसार लगेच कृती करतो"
    },
    "8:Melancholy": {
      "word": "वेळापत्रक पाळणारा",
      "description": "ठरलेल्या वेळेनुसार वागतो"
    },
    "8:Phlegmatic": {
      "word": "लाजाळू",
      "description": "लक्षाचे केंद्र होणे टाळतो"
    },
    "9:Melancholy": {
      "word": "नीटनेटका",
      "description": "वस्तू योग्य जागी ठेवतो"
    },
    "9:Phlegmatic": {
      "word": "सहकार्यशील",
      "description": "मदतीसाठी तयार असतो"
    },
    "9:Choleric": {
      "word": "स्पष्टवक्ता",
      "description": "स्वतःचे मत उघडपणे सांगतो"
    },
    "9:Sanguine": {
      "word": "आशावादी",
      "description": "भविष्याची चांगली बाजू पाहतो"
    },
    "10:Phlegmatic": {
      "word": "मैत्रीपूर्ण",
      "description": "लवकर मैत्री करतो"
    },
    "10:Melancholy": {
      "word": "निष्ठावान",
      "description": "नात्यांतील विश्वास जपतो"
    },
    "10:Sanguine": {
      "word": "विनोदी",
      "description": "विनोदाने लोकांना हसवतो"
    },
    "10:Choleric": {
      "word": "ठाम",
      "description": "दृढतेने काम पुढे नेतो"
    },
    "11:Choleric": {
      "word": "निर्भय",
      "description": "धोक्याला घाबरत नाही"
    },
    "11:Sanguine": {
      "word": "आनंददायी",
      "description": "सहवासात आनंद देतो"
    },
    "11:Phlegmatic": {
      "word": "मुत्सद्दी",
      "description": "मतभेद कुशलतेने सोडवतो"
    },
    "11:Melancholy": {
      "word": "तपशीलवार",
      "description": "लहान गोष्टींकडे लक्ष देतो"
    },
    "12:Sanguine": {
      "word": "प्रसन्न",
      "description": "आनंदी स्वभाव ठेवतो"
    },
    "12:Phlegmatic": {
      "word": "सातत्यपूर्ण",
      "description": "वर्तनात सातत्य ठेवतो"
    },
    "12:Melancholy": {
      "word": "सुसंस्कृत",
      "description": "शिष्टाचार आणि कला समजतो"
    },
    "12:Choleric": {
      "word": "आत्मविश्वासू",
      "description": "स्वतःच्या क्षमतेवर विश्वास ठेवतो"
    },
    "13:Melancholy": {
      "word": "आदर्शवादी",
      "description": "उच्च निकषांकडे वाटचाल करतो"
    },
    "13:Choleric": {
      "word": "स्वतंत्र",
      "description": "स्वतःचे निर्णय स्वतः घेतो"
    },
    "13:Phlegmatic": {
      "word": "न दुखावणारा",
      "description": "कोणाला दुखावणे टाळतो"
    },
    "13:Sanguine": {
      "word": "प्रेरणादायी",
      "description": "इतरांमध्ये उत्साह निर्माण करतो"
    },
    "14:Sanguine": {
      "word": "अभिव्यक्त",
      "description": "भावना उघडपणे दाखवतो"
    },
    "14:Choleric": {
      "word": "निर्णायक",
      "description": "वेळीच स्पष्ट निर्णय घेतो"
    },
    "14:Phlegmatic": {
      "word": "सूक्ष्म विनोदी",
      "description": "गंभीर स्वरात विनोद करतो"
    },
    "14:Melancholy": {
      "word": "सखोल",
      "description": "गोष्टीचा खोलवर विचार करतो"
    },
    "15:Phlegmatic": {
      "word": "मध्यस्थ",
      "description": "भांडणाऱ्या लोकांत समेट घडवतो"
    },
    "15:Melancholy": {
      "word": "संगीतप्रेमी",
      "description": "संगीताची लय जाणतो"
    },
    "15:Choleric": {
      "word": "कृतिशील",
      "description": "लोकांना कामाला लावतो"
    },
    "15:Sanguine": {
      "word": "सहज मिसळणारा",
      "description": "अनोळखी लोकांत सहज मिसळतो"
    },
    "16:Melancholy": {
      "word": "विचारपूर्वक वागणारा",
      "description": "निर्णयाआधी इतरांचा विचार करतो"
    },
    "16:Choleric": {
      "word": "चिकाटीचा",
      "description": "अडचणीतही प्रयत्न सोडत नाही"
    },
    "16:Sanguine": {
      "word": "बोलका",
      "description": "संवाद सुरू करायला आवडते"
    },
    "16:Phlegmatic": {
      "word": "सहनशील",
      "description": "वेगळी मते स्वीकारतो"
    },
    "17:Phlegmatic": {
      "word": "श्रोता",
      "description": "इतरांचे लक्षपूर्वक ऐकतो"
    },
    "17:Melancholy": {
      "word": "एकनिष्ठ",
      "description": "साथ आणि विश्वास टिकवतो"
    },
    "17:Choleric": {
      "word": "नेता",
      "description": "दिशा देऊन जबाबदारी घेतो"
    },
    "17:Sanguine": {
      "word": "चैतन्यशील",
      "description": "ऊर्जेने भरलेला असतो"
    },
    "18:Phlegmatic": {
      "word": "तृप्त",
      "description": "परिस्थितीत समाधान मानतो"
    },
    "18:Choleric": {
      "word": "प्रमुख",
      "description": "कामाची धुरा सांभाळतो"
    },
    "18:Melancholy": {
      "word": "तक्ते बनवणारा",
      "description": "माहिती क्रमाने मांडतो"
    },
    "18:Sanguine": {
      "word": "मोहक",
      "description": "मोहक वागण्याने लक्ष वेधतो"
    },
    "19:Melancholy": {
      "word": "परिपूर्णतावादी",
      "description": "प्रत्येक कामात अचूकता अपेक्षित करतो"
    },
    "19:Phlegmatic": {
      "word": "आल्हाददायक",
      "description": "नम्रतेने चांगले वातावरण बनवतो"
    },
    "19:Choleric": {
      "word": "उत्पादक",
      "description": "कामातून ठोस परिणाम आणतो"
    },
    "19:Sanguine": {
      "word": "लोकप्रिय",
      "description": "लोकांना सहवास आवडतो"
    },
    "20:Sanguine": {
      "word": "उत्साहाने भरलेला",
      "description": "उसळत्या उत्साहाने वागतो"
    },
    "20:Choleric": {
      "word": "धाडसी",
      "description": "आत्मविश्वासाने पुढे येतो"
    },
    "20:Melancholy": {
      "word": "शिष्ट",
      "description": "योग्य वर्तनाची काळजी घेतो"
    },
    "20:Phlegmatic": {
      "word": "संतुलित",
      "description": "भावनांत स्थिर राहतो"
    },
    "21:Phlegmatic": {
      "word": "भावनारहित दिसणारा",
      "description": "चेहऱ्यावर कमी भाव दाखवतो"
    },
    "21:Melancholy": {
      "word": "बुजरा",
      "description": "लक्ष मिळाल्यावर अस्वस्थ होतो"
    },
    "21:Sanguine": {
      "word": "निर्लज्जपणे वागणारा",
      "description": "संकोच न बाळगता स्वतःला मिरवतो"
    },
    "21:Choleric": {
      "word": "हुकूम गाजवणारा",
      "description": "इतरांना सतत आदेश देतो"
    },
    "22:Sanguine": {
      "word": "बेशिस्त",
      "description": "नियम आणि दिनक्रम पाळत नाही"
    },
    "22:Choleric": {
      "word": "असंवेदनशील",
      "description": "इतरांचे दुःख समजण्यात कमी पडतो"
    },
    "22:Phlegmatic": {
      "word": "निरुत्साही",
      "description": "कामात कमी रस दाखवतो"
    },
    "22:Melancholy": {
      "word": "क्षमा न करणारा",
      "description": "जुनी चूक विसरू शकत नाही"
    },
    "23:Phlegmatic": {
      "word": "अबोल",
      "description": "मनातील गोष्ट दाबून ठेवतो"
    },
    "23:Melancholy": {
      "word": "मनात राग धरणारा",
      "description": "मनात नाराजी ठेवतो"
    },
    "23:Choleric": {
      "word": "विरोध करणारा",
      "description": "बदल स्वीकारत नाही"
    },
    "23:Sanguine": {
      "word": "पुनरावृत्ती करणारा",
      "description": "तीच गोष्ट पुन्हा पुन्हा सांगतो"
    },
    "24:Melancholy": {
      "word": "कटकट करणारा",
      "description": "लहान उणिवांवर अडकतो"
    },
    "24:Phlegmatic": {
      "word": "भित्रा",
      "description": "वाईट घडण्याची भीती बाळगतो"
    },
    "24:Sanguine": {
      "word": "विसरभोळा",
      "description": "महत्त्वाच्या गोष्टी विसरतो"
    },
    "24:Choleric": {
      "word": "फटकळ",
      "description": "परिणाम न पाहता स्पष्ट बोलतो"
    },
    "25:Choleric": {
      "word": "अधीर",
      "description": "उशीर सहन करू शकत नाही"
    },
    "25:Melancholy": {
      "word": "असुरक्षित",
      "description": "स्वतःच्या योग्यतेवर शंका घेतो"
    },
    "25:Phlegmatic": {
      "word": "अनिर्णयी",
      "description": "निर्णय घेताना अडकतो"
    },
    "25:Sanguine": {
      "word": "मध्ये बोलणारा",
      "description": "दुसऱ्याचे बोलणे तोडतो"
    },
    "26:Melancholy": {
      "word": "अलोकप्रिय",
      "description": "लोकांशी कमी जुळते"
    },
    "26:Phlegmatic": {
      "word": "अलिप्त",
      "description": "उपक्रमांत सहभागी होत नाही"
    },
    "26:Sanguine": {
      "word": "अनपेक्षित",
      "description": "वर्तन अचानक बदलतो"
    },
    "26:Choleric": {
      "word": "माया न दाखवणारा",
      "description": "आपुलकी व्यक्त करत नाही"
    },
    "27:Choleric": {
      "word": "हट्टी",
      "description": "स्वतःच्याच मतावर अडतो"
    },
    "27:Sanguine": {
      "word": "अव्यवस्थित",
      "description": "क्रम न ठेवता काम करतो"
    },
    "27:Melancholy": {
      "word": "सहज न खूश होणारा",
      "description": "सहज समाधान होत नाही"
    },
    "27:Phlegmatic": {
      "word": "संकोचणारा",
      "description": "पाऊल उचलताना कचरतो"
    },
    "28:Phlegmatic": {
      "word": "साधा",
      "description": "स्वतःला ठळकपणे मांडत नाही"
    },
    "28:Melancholy": {
      "word": "निराशावादी",
      "description": "वाईट परिणाम आधी पाहतो"
    },
    "28:Choleric": {
      "word": "गर्विष्ठ",
      "description": "स्वतःला इतरांपेक्षा श्रेष्ठ मानतो"
    },
    "28:Sanguine": {
      "word": "अति मुभा देणारा",
      "description": "चुकीचे वर्तनही चालू देतो"
    },
    "29:Sanguine": {
      "word": "लवकर रागावणारा",
      "description": "लहान गोष्टीवर रागावतो"
    },
    "29:Phlegmatic": {
      "word": "दिशाहीन",
      "description": "स्पष्ट ध्येयाशिवाय वागतो"
    },
    "29:Choleric": {
      "word": "वाद घालणारा",
      "description": "गोष्टीचे वादात रूपांतर करतो"
    },
    "29:Melancholy": {
      "word": "दुरावलेला",
      "description": "लोकांपासून अंतर जाणवते"
    },
    "30:Sanguine": {
      "word": "भोळा",
      "description": "न तपासता लवकर विश्वास ठेवतो"
    },
    "30:Melancholy": {
      "word": "नकारात्मक",
      "description": "उणिवा आणि अडथळे आधी पाहतो"
    },
    "30:Choleric": {
      "word": "उद्धट",
      "description": "न कचरता मर्यादा ओलांडतो"
    },
    "30:Phlegmatic": {
      "word": "बेफिकीर",
      "description": "काळजी किंवा रस कमी दाखवतो"
    },
    "31:Phlegmatic": {
      "word": "काळजी करणारा",
      "description": "संभाव्य अडचणींचा विचार करत राहतो"
    },
    "31:Melancholy": {
      "word": "स्वतःत राहणारा",
      "description": "लोकांशी संवाद टाळतो"
    },
    "31:Choleric": {
      "word": "कामात बुडालेला",
      "description": "विश्रांतीपेक्षा कामाला प्राधान्य देतो"
    },
    "31:Sanguine": {
      "word": "श्रेय इच्छिणारा",
      "description": "स्वतःच्या योगदानाची प्रशंसा अपेक्षित करतो"
    },
    "32:Melancholy": {
      "word": "अति संवेदनशील",
      "description": "बोलण्याने लवकर दुखावतो"
    },
    "32:Choleric": {
      "word": "व्यवहारकुशलता नसलेला",
      "description": "बोलताना भावनांची काळजी घेत नाही"
    },
    "32:Phlegmatic": {
      "word": "भेदरट",
      "description": "पुढे येण्यास घाबरतो"
    },
    "32:Sanguine": {
      "word": "अतिबोलका",
      "description": "इतरांना बोलण्याची कमी संधी देतो"
    },
    "33:Phlegmatic": {
      "word": "साशंक",
      "description": "स्वतःच्या निर्णयावर विश्वास ठेवत नाही"
    },
    "33:Sanguine": {
      "word": "विस्कळीत",
      "description": "काम आणि वस्तू सांभाळू शकत नाही"
    },
    "33:Choleric": {
      "word": "वर्चस्व गाजवणारा",
      "description": "इतरांवर नियंत्रण ठेवू इच्छितो"
    },
    "33:Melancholy": {
      "word": "उदास",
      "description": "निराशेमुळे मन जड राहते"
    },
    "34:Sanguine": {
      "word": "असातत्यपूर्ण",
      "description": "हेतू आणि वर्तन बदलत राहतो"
    },
    "34:Melancholy": {
      "word": "अंतर्मुखी",
      "description": "स्वतःच्या विचारांत जास्त राहतो"
    },
    "34:Choleric": {
      "word": "असहिष्णू",
      "description": "वेगळ्या पद्धती सहन करत नाही"
    },
    "34:Phlegmatic": {
      "word": "उदासीन",
      "description": "इतरांच्या गोष्टींत रस घेत नाही"
    },
    "35:Sanguine": {
      "word": "पसारा करणारा",
      "description": "वस्तू विखुरलेल्या ठेवतो"
    },
    "35:Melancholy": {
      "word": "लहरी",
      "description": "मनःस्थिती लवकर बदलते"
    },
    "35:Phlegmatic": {
      "word": "पुटपुटणारा",
      "description": "हळू आणि अस्पष्ट बोलतो"
    },
    "35:Choleric": {
      "word": "हाताळणारा",
      "description": "फायद्यासाठी इतरांना वळवतो"
    },
    "36:Phlegmatic": {
      "word": "संथ",
      "description": "काम सुरू करायला वेळ लावतो"
    },
    "36:Choleric": {
      "word": "हट्टी",
      "description": "मत बदलायला नकार देतो"
    },
    "36:Sanguine": {
      "word": "दिखाऊ",
      "description": "सर्वांचे लक्ष स्वतःकडे हवे असते"
    },
    "36:Melancholy": {
      "word": "संशयवादी",
      "description": "इतरांच्या हेतूवर प्रश्न करतो"
    },
    "37:Melancholy": {
      "word": "एकटा राहणारा",
      "description": "एकटे राहणे निवडतो"
    },
    "37:Choleric": {
      "word": "रोब गाजवणारा",
      "description": "स्वतःला अधिकारी समजून वागतो"
    },
    "37:Phlegmatic": {
      "word": "आळशी",
      "description": "मेहनत टाळण्याचा प्रयत्न करतो"
    },
    "37:Sanguine": {
      "word": "मोठ्याने बोलणारा",
      "description": "गरजेपेक्षा मोठ्याने बोलतो"
    },
    "38:Phlegmatic": {
      "word": "सुस्त",
      "description": "कामात कमी ऊर्जा लावतो"
    },
    "38:Melancholy": {
      "word": "संशयी",
      "description": "इतरांवर सहज विश्वास ठेवत नाही"
    },
    "38:Choleric": {
      "word": "चिडखोर",
      "description": "लवकर संयम गमावतो"
    },
    "38:Sanguine": {
      "word": "विसराळू",
      "description": "लक्ष एका ठिकाणी टिकत नाही"
    },
    "39:Melancholy": {
      "word": "सूड घेणारा",
      "description": "दुखावल्याचा बदला घेऊ इच्छितो"
    },
    "39:Sanguine": {
      "word": "अस्वस्थ",
      "description": "एका ठिकाणी राहणे कठीण जाते"
    },
    "39:Phlegmatic": {
      "word": "अनुत्सुक",
      "description": "नवी जबाबदारी घेणे टाळतो"
    },
    "39:Choleric": {
      "word": "उतावळा",
      "description": "परिणाम न पाहता पाऊल उचलतो"
    },
    "40:Phlegmatic": {
      "word": "तडजोड करणारा",
      "description": "वाद टाळण्यासाठी स्वतःचे मत सोडतो"
    },
    "40:Melancholy": {
      "word": "टीकाकार",
      "description": "इतरांच्या चुका शोधतो"
    },
    "40:Choleric": {
      "word": "कपटी",
      "description": "स्वतःच्या फायद्यासाठी डाव खेळतो"
    },
    "40:Sanguine": {
      "word": "बदलणारा",
      "description": "मन आणि आवड लवकर बदलतो"
    }
  }
};

/** English always comes from the questionnaire to preserve its original wording. */
export function localizedOption(
  questionNumber: number,
  temperament: string,
  language: AssessmentLanguage,
): LocalizedOption | undefined {
  const original = CFL_PAW_QUESTIONS.find((question) => question.questionNumber === questionNumber)
    ?.options.find((option) => option.temperament === temperament);
  if (!original) return undefined;
  if (language === 'en') return { word: original.word, description: original.description };
  return OPTION_TRANSLATIONS[language][`${questionNumber}:${temperament}`];
}
