// Verified sample content for demo purposes.
// Quranic Arabic text and references are from the Holy Quran. English translations follow widely used meanings (e.g. Sahih International).
// Production systems must load Arabic text, translations, and audio from authenticated Quran datasets/APIs.

const VERSES = [
  {
    id: "94:5-6",
    surah: "Ash-Sharh",
    surahNumber: 94,
    ayah: "5-6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    translation_dv: "",
    themes: ["hope", "hardship", "patience", "sadness", "anxiety", "future", "loneliness", "overwhelmed"],
    meaning: "Allah reassures believers that difficulty is not permanent and that relief is tied to hardship.",
    reflection: "This verse reminds you that your current struggle is not the end of your story. Turning to Allah with patience and trust can bring ease in ways you may not yet see.",
    source: "Qur'an 94:5-6"
  },
  {
    id: "2:286",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayah: "286",
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَٰفِرِينَ",
    translation: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. \"Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.\"",
    translation_dv: "",
    themes: ["overwhelmed", "guilt", "mistakes", "burden", "anxiety", "forgiveness"],
    meaning: "Allah does not place a burden on a person beyond what they can bear, and He teaches believers to seek mercy and forgiveness.",
    reflection: "If you feel overwhelmed, remember that Allah knows your limits. Ask Him for strength, forgiveness, and relief, and take one manageable step at a time.",
    source: "Qur'an 2:286"
  },
  {
    id: "3:139",
    surah: "Aal 'Imran",
    surahNumber: 3,
    ayah: "139",
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    translation_dv: "",
    themes: ["sadness", "giving up", "grief", "strength", "hope", "loneliness", "despair"],
    meaning: "Allah encourages believers not to lose heart or be consumed by sorrow, and to remain steadfast in faith.",
    reflection: "Pain and setbacks can feel heavy, but faith invites resilience. Seek support, keep hope alive, and remember that Allah sees your struggle.",
    source: "Qur'an 3:139"
  },
  {
    id: "65:3",
    surah: "At-Talaq",
    surahNumber: 65,
    ayah: "3",
    arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ ۚ إِنَّ ٱللَّهَ بَٰلِغُ أَمْرِهِۦ ۚ قَدْ جَعَلَ ٱللَّهُ لِكُلِّ شَىْءٍۢ قَدْرًۭا",
    translation: "And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose. Allah has already set for everything a [decreed] extent.",
    translation_dv: "",
    themes: ["financial", "trapped", "fear", "future", "anxiety", "hardship"],
    meaning: "Taqwa (consciousness of Allah) is connected to Allah opening paths and providing in unexpected ways.",
    reflection: "When options seem limited, continue to act responsibly, make du'a, and trust that Allah can create openings beyond what you can plan.",
    source: "Qur'an 65:3"
  },
  {
    id: "12:87",
    surah: "Yusuf",
    surahNumber: 12,
    ayah: "87",
    arabic: "إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    translation: "Indeed, no one despairs of relief from Allah except the disbelieving people.",
    translation_dv: "",
    themes: ["hopeless", "loss", "grief", "family", "patience"],
    meaning: "This verse, spoken in the story of Prophet Ya'qub (AS), teaches that despairing of Allah's mercy and relief is not the path of faith.",
    reflection: "Hope in Allah can coexist with tears and pain. Keep making du'a and do not close the door on Allah's mercy.",
    source: "Qur'an 12:87"
  },
  {
    id: "21:87",
    surah: "Al-Anbiya",
    surahNumber: 21,
    ayah: "87",
    arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّى كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    translation_dv: "",
    themes: ["regret", "repentance", "overwhelmed", "mistakes", "forgiveness", "lost"],
    meaning: "This is the supplication of Prophet Yunus (AS), expressing Allah's oneness, glorification, humility, and repentance.",
    reflection: "When you feel trapped by regret or distress, turn back to Allah with sincere words, humility, and hope in His mercy.",
    source: "Qur'an 21:87"
  },
  {
    id: "2:153",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayah: "153",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
    translation_dv: "",
    themes: ["patience", "hardship", "anxiety", "grief", "strength", "loneliness", "sadness"],
    meaning: "Allah directs believers to seek help through sabr (patience/perseverance) and salah (prayer).",
    reflection: "In difficulty, combine spiritual practices with practical steps. Prayer and patience can steady the heart while you work through challenges.",
    source: "Qur'an 2:153"
  },
  {
    id: "39:53",
    surah: "Az-Zumar",
    surahNumber: 39,
    ayah: "53",
    arabic: "۞ قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
    translation: "Say, \"O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.\"",
    translation_dv: "",
    themes: ["forgiveness", "guilt", "mistakes", "repentance", "hopeless"],
    meaning: "Allah calls people who have sinned not to despair and to turn back to Him for forgiveness.",
    reflection: "No matter how far you feel you have gone, the door of sincere repentance is open. Return to Allah with honesty and hope.",
    source: "Qur'an 39:53"
  }
];

const STORIES = [
  {
    id: "ayyub",
    title: "Prophet Ayyub (AS) – Patience During Suffering",
    prophets: ["Ayyub"],
    themes: ["illness", "loss", "financial", "suffering", "patience", "hardship"],
    background: "Prophet Ayyub (AS) is mentioned in the Qur'an as a servant of Allah who faced severe trials and turned to his Lord with patience and supplication.",
    whatHappened: "The Qur'an describes Ayyub (AS) calling upon his Lord, saying that harm had afflicted him and that Allah is the Most Merciful of the merciful. Allah responded to him, removed the hardship, and restored blessings to him as a mercy and a reminder for worshippers.",
    references: ["Qur'an 21:83-84", "Qur'an 38:41-44"],
    challenges: ["Affliction and hardship", "Prolonged difficulty", "Need for patience and trust in Allah"],
    guidanceFromAllah: "Allah heard his sincere du'a, relieved his distress, and showed mercy. His story highlights steadfastness, humility, and turning to Allah in hardship.",
    lessons: [
      "Patience does not mean absence of pain; it means turning to Allah while enduring it.",
      "Sincere du'a is powerful, even when relief feels distant.",
      "Hardship can be followed by mercy and restoration by Allah's will."
    ],
    apply: "In ongoing illness, loss, or financial strain, combine sabr with du'a, seek lawful means of help, and remember that Allah's mercy is near.",
    source: "Based on Qur'anic accounts in Surah Al-Anbiya (21:83-84) and Surah Sad (38:41-44)."
  },
  {
    id: "yusuf",
    title: "Prophet Yusuf (AS) – Betrayal, Patience, and Relief",
    prophets: ["Yusuf", "Ya'qub"],
    themes: ["betrayal", "family", "loneliness", "unfair", "injustice", "forgiveness", "patience", "grief"],
    background: "Surah Yusuf recounts the life of Prophet Yusuf (AS), including family trials, separation, false accusation, imprisonment, and eventual honor by Allah's decree.",
    whatHappened: "Yusuf (AS) faced jealousy and harm from his brothers, was separated from his father, experienced slavery and imprisonment despite his innocence, and remained patient and faithful. Allah eventually brought truth to light, reunited him with his family, and raised his status.",
    references: ["Qur'an 12:4-101", "Qur'an 12:87", "Qur'an 12:90"],
    challenges: ["Betrayal by loved ones", "Loneliness and separation", "False accusation and injustice", "Years of waiting"],
    guidanceFromAllah: "Allah's plan unfolded over time. Yusuf (AS) maintained integrity, patience, and trust in Allah, and Allah granted relief and reunion.",
    lessons: [
      "Being wronged does not mean being forgotten by Allah.",
      "Patience and good character matter, even when outcomes are delayed.",
      "Forgiveness and reliance on Allah can heal deep family wounds."
    ],
    apply: "If you face betrayal or injustice, protect your dignity, seek fair support where possible, make du'a for ease, and trust Allah's timing.",
    source: "Based on the Qur'anic account in Surah Yusuf (12)."
  },
  {
    id: "musa",
    title: "Prophet Musa (AS) – Fear, Trust, and Allah’s Support",
    prophets: ["Musa"],
    themes: ["fear", "future", "trapped", "anxiety", "overwhelmed", "courage"],
    background: "Prophet Musa (AS) faced fear and immense responsibility, including confronting Pharaoh and leading the Children of Israel.",
    whatHappened: "When Musa (AS) and his people were pursued and fear arose, he expressed certainty that his Lord was with him and would guide him. Allah commanded him to strike the sea, creating a path to safety, and saved the believers while drowning Pharaoh and his followers.",
    references: ["Qur'an 26:61-66", "Qur'an 20:25-35", "Qur'an 28:7"],
    challenges: ["Fear of harm", "Overwhelming responsibility", "Facing powerful opposition", "Uncertainty about outcomes"],
    guidanceFromAllah: "Allah strengthened Musa (AS), supported him with signs and help, and made a way where there seemed to be none.",
    lessons: [
      "Fear is human; turning to Allah in fear is an act of faith.",
      "Allah can open paths that seem impossible.",
      "Preparation, du'a, and trust in Allah go together."
    ],
    apply: "When facing uncertainty or a daunting challenge, make du'a for clarity and courage, seek wise counsel, and take the next right step with trust in Allah.",
    source: "Based on Qur'anic accounts including Surah Ash-Shu'ara (26:61-66) and Surah Ta-Ha (20:25-35)."
  },
  {
    id: "yunus",
    title: "Prophet Yunus (AS) – Distress, Repentance, and Return to Allah",
    prophets: ["Yunus"],
    themes: ["regret", "repentance", "overwhelmed", "lost", "mistakes", "forgiveness", "despair"],
    background: "Prophet Yunus (AS) is mentioned in the Qur'an in the context of distress and sincere turning back to Allah.",
    whatHappened: "Yunus (AS) left in anger, was overtaken by distress, and called upon Allah from the darkness with the supplication acknowledging Allah's perfection and his own wrongdoing. Allah responded to him, relieved his distress, and saved him by His mercy.",
    references: ["Qur'an 21:87-88", "Qur'an 37:139-148"],
    challenges: ["Distress and isolation", "Regret", "Feeling overwhelmed"],
    guidanceFromAllah: "Allah accepted his sincere supplication and delivered him from hardship, showing the mercy of Allah to those who turn back.",
    lessons: [
      "Sincere repentance and remembrance of Allah bring light in darkness.",
      "Acknowledging mistakes with humility is a path to healing.",
      "Allah’s mercy reaches those who call upon Him sincerely."
    ],
    apply: "If you feel regret or spiritually lost, return to Allah with honest du'a, seek forgiveness, and take small steps toward what is right.",
    source: "Based on Qur'anic accounts in Surah Al-Anbiya (21:87-88) and Surah As-Saffat (37:139-148)."
  }
];

const CORE_DUAS = [
  {
    id: "dua-yunus",
    title: "Du'a of Prophet Yunus (AS) in Distress",
    tags: ["distress", "regret", "forgiveness", "overwhelmed", "repentance"],
    arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّى كُنتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa Anta, subhanaka inni kuntu minaz-zalimin.",
    meaning_en: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    meaning_dv: "",
    source: "Qur'an 21:87",
    source_url: "https://quran.com/21/87"
  },
  {
    id: "dua-burden",
    title: "Du'a for Relief from Burden",
    tags: ["overwhelmed", "anxiety", "mistakes", "forgiveness", "hardship"],
    arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
    transliteration: "Rabbana la tu'akhidhna in nasina aw akhta'na.",
    meaning_en: "Our Lord, do not impose blame upon us if we have forgotten or erred.",
    meaning_dv: "",
    source: "Qur'an 2:286",
    source_url: "https://quran.com/2/286"
  },
  {
    id: "dua-trust",
    title: "Reliance upon Allah",
    tags: ["fear", "anxiety", "future", "trust"],
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal wakeel.",
    meaning_en: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
    meaning_dv: "",
    source: "Qur'an 3:173 (words attributed to believers in context)",
    source_url: "https://quran.com/3/173"
  },
  {
    id: "dua-guidance",
    title: "Asking Allah for Steadfastness and Mercy",
    tags: ["guidance", "strength", "patience", "hope"],
    arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    transliteration: "Rabbana atina min ladunka rahmah wa hayyi' lana min amrina rashada.",
    meaning_en: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
    meaning_dv: "",
    source: "Qur'an 18:10",
    source_url: "https://quran.com/18/10"
  }
];

// Core Qur'anic duas first, then the wider Qur'anic collection curated from
// quran.com/duas (js/duas-quran.js), then all Hisn al-Muslim supplications
// (js/duas-hisn.js, retrieved from sunnah.com/hisn).
const HISN_DUAS = Array.isArray(window.HISN_DUAS) ? window.HISN_DUAS : [];
const QURAN_COM_DUAS = Array.isArray(window.QURAN_DUAS) ? window.QURAN_DUAS : [];

// Safety net against duplicates: reduce Arabic to a consonant skeleton so
// Uthmani and Imla'i spellings compare equal. The build script already removes
// duplicates; this keeps the merge honest if the data is regenerated.
function duaArabicKey(text) {
  return (text || '')
    .replace(/[\u0670\u0671]/g, '\u0627')
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    .replace(/\u0649/g, '\u064A')
    .replace(/\u0629/g, '\u0647')
    .replace(/[\u064B-\u065F\u06D6-\u06ED\u0640]/g, '')
    .replace(/[^\u0621-\u064A]/g, '')
    .replace(/[\u0627\u0648\u064A\u0647\u0621]/g, '');
}

const EXISTING_DUA_KEYS = new Set(
  [...CORE_DUAS, ...HISN_DUAS].map(d => duaArabicKey(d.arabic)).filter(Boolean)
);
const QURAN_DUAS = QURAN_COM_DUAS.filter(d => {
  const key = duaArabicKey(d.arabic);
  return key && !EXISTING_DUA_KEYS.has(key);
});

const DUAS = [
  ...CORE_DUAS.map(d => ({ ...d, origin: 'quran' })),
  ...QURAN_DUAS.map(d => ({ ...d, origin: 'qurancom' })),
  ...HISN_DUAS.map(d => ({ ...d, origin: 'hisn' }))
];

const DAILY_REFLECTIONS = [
  {
    title: "Ease is near",
    text: "Hardship can narrow our view, but Allah reminds us that ease accompanies difficulty. Keep your heart connected to du'a, prayer, and small acts of trust.",
    verseId: "94:5-6"
  },
  {
    title: "You are not beyond mercy",
    text: "Regret can feel heavy, but sincere repentance opens the door to Allah’s forgiveness. Turn back with humility and hope.",
    verseId: "39:53"
  },
  {
    title: "Help through patience and prayer",
    text: "When emotions surge, anchor yourself in salah and sabr. Strength often grows quietly, one prayer and one step at a time.",
    verseId: "2:153"
  }
];

const PROMPTS = [
  "I feel lonely and nobody understands me.",
  "I am struggling financially.",
  "I lost someone I love.",
  "I am afraid of my future.",
  "I have made many mistakes and want Allah to forgive me.",
  "I feel like giving up because life is difficult.",
  "I am struggling with patience."
];
