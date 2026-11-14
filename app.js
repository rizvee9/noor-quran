(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const CHAT_HISTORY_LIMIT = 40;

  const state = {
    screen: 'splash',
    view: 'home',
    theme: localStorage.getItem('noor_theme') || 'dark',
    language: localStorage.getItem('noor_language') || 'en',
    aiMode: localStorage.getItem('noor_ai_mode') || 'free',
    history: [],
    saved: { verses: [], stories: [], duas: [] }
  };
  state.history = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem('noor_history') || '[]');
      return Array.isArray(parsed)
        ? parsed.filter(m => m && (m.role === 'user' || m.role === 'ai')).slice(-CHAT_HISTORY_LIMIT)
        : [];
    } catch (e) { return []; }
  })();
  state.saved = (() => {
    try {
      return normalizeSaved(JSON.parse(localStorage.getItem('noor_saved') || 'null'));
    } catch (e) { return normalizeSaved(null); }
  })();

  const labels = {
    en: { home: 'Home', chat: 'AI Companion', guidance: 'Quranic Guidance', stories: 'Stories of the Quran', duas: 'Dua Collection', reflection: 'Daily Reflection', saved: 'Saved Content', settings: 'Profile & Settings', quran: 'The Holy Quran', prayer: 'Prayer Times', greeting: 'Assalamu alaikum' },
    dv: { home: 'މައި ޞަފްޙާ', chat: 'އެއައި އެހީތެރިޔާ', guidance: 'ޤުރުއާން އިރުޝާދު', stories: 'ޤުރުއާން ވާހަކަތައް', duas: 'ދުޢާތައް', reflection: 'ދުވަހުގެ ތަފައްކުރު', saved: 'ރައްކާކުރެވިފައި', settings: 'ސެޓިންގްސް', quran: 'ކީރިތި ޤުރުއާން', prayer: 'ނަމާދު ގަޑިތައް', greeting: 'އައްސަލާމް ޢަލައިކުމް' },
    ar: { home: 'الرئيسية', chat: 'الرفيق', guidance: 'هداية قرآنية', stories: 'قصص القرآن', duas: 'الأدعية', reflection: 'تدبر يومي', saved: 'المحفوظات', settings: 'الإعدادات', quran: 'القرآن الكريم', prayer: 'أوقات الصلاة', greeting: 'السلام عليكم' }
  };

  const I18N = {
    en: {
      chatIntro: 'Assalamu alaikum. Share what is on your heart, and I will offer one relevant Qur’anic verse, a practical step, and a du’a — with references.',
      privacyFree: 'Replies may use a free online AI for a more natural response · not a scholar, therapist, or doctor.',
      privacyLocal: 'Private to this device · not a scholar, therapist, or doctor.',
      inputPlaceholder: 'Share what’s on your heart...',
      send: 'Send',
      reflecting: 'Reflecting…',
      thinking: 'Thinking…',
      latest: 'Latest',
      copy: 'Copy',
      regenerate: 'Regenerate',
      openQuran: 'Open in Quran',
      moreDuas: 'More duas',
      save: 'Save',
      savedBtn: 'Saved',
      openDuas: 'Open Du’as',
      openPrayer: 'Open Prayer Times',
      openQibla: 'Open Qibla compass',
      openSurah: 'Open Surah',
      verseLabel: 'Qur’anic verse',
      comfortVerseLabel: 'A verse for comfort',
      relatedStory: 'Related story',
      practicalSteps: 'Practical steps',
      rightNow: 'Right now',
      closingReflection: 'Closing reflection',
      verifiedRefs: 'Verified references from Noor’s library:',
      disclaimer: 'Reflection companion · not a scholar, therapist, or doctor.',
      disclaimerAi: 'Free AI reply · verify important matters · not a scholar, therapist, or doctor.',
      disclaimerCrisis: 'If you are in immediate danger, contact your local emergency services now.',
      copied: 'Copied to clipboard',
      copyFail: 'Could not copy on this device',
      chatEmpty: 'Assalamu alaikum. I’m here to listen with care. Share what you are going through, and I will offer a relevant Qur’anic verse, a practical step, and a du’a from verified sources.',
      chatPrivateNote: 'Private to this device · not a scholar, therapist, or doctor.',
      aiModeHelpFree: 'Free AI uses free online services to generate warmer replies when available. Your message and recent context may be sent to those services; verses and du’as shown from Noor’s library remain verified. For private, offline replies, choose Local companion.',
      aiModeHelpLocal: 'Local companion builds replies on this device from Noor’s verified library and does not send your messages to an external AI service.',
      storyBackground: 'Background',
      storyWhat: 'What happened',
      storyGuidance: 'How Allah guided them',
      storyRefs: 'Qur’anic references',
      duaHisnLabel: 'Du’a from Hisn al-Muslim',
      duaQuranLabel: 'Du’a from the Qur’an',
      meaningLabel: 'Meaning',
      reflectionLabel: 'Reflection',
      whatCanDo: 'What can you do?',
      prompt_lonely: 'I feel lonely and nobody understands me.',
      prompt_financial: 'I am struggling financially.',
      prompt_grief: 'I lost someone I love.',
      prompt_future: 'I am afraid of my future.',
      prompt_forgive: 'I have made many mistakes and want Allah to forgive me.',
      prompt_giveup: 'I feel like giving up because life is difficult.',
      prompt_patience: 'I am struggling with patience.',
      tagline: 'Your Quran Companion',
      splashNote: 'Guidance, comfort, and reflection through the Quran',
      welcomeTitle: 'Welcome to Noor',
      welcomeLead: 'A peaceful space to seek comfort and guidance through the Holy Quran during life’s challenges.',
      important: 'Important:',
      disclaimerBox: 'Noor offers spiritual reflection based on verified Quranic sources. It is not a substitute for qualified scholars, medical care, or mental health professionals.',
      begin: 'Begin',
      homeGreeting: 'May your heart find peace today.',
      heroSub: 'Share what is on your mind, and explore verses, stories, and duas for your situation.',
      talkToNoor: 'Talk to Noor',
      dailyVerse: 'Daily Verse',
      todayTimesReminders: 'Today’s times and reminders',
      readQuran: 'Read Quran',
      all114: 'All 114 surahs',
      prayerTimes: 'Prayer Times',
      timesReminders: 'Times & reminders',
      qibla: 'Qibla',
      qiblaDir: 'Direction to the Kaaba',
      versesReflection: 'Verses & reflection',
      storiesTitle: 'Stories of the Quran',
      storiesSub: 'Accounts of Prophets and lessons relevant to life’s trials.',
      lessonsPatience: 'Lessons & patience',
      supplications: 'Supplications',
      pauseReflect: 'Pause & reflect',
      favourites: 'Favourites',
      noorNav: 'Noor',
      shareFeelings: 'Share your feelings',
      quranTitle: 'The Holy Quran',
      quranSub: 'All 114 surahs • Read the Arabic on its own, with meaning when you want it.',
      prayerSub: 'Daily salah times and gentle reminders.',
      duasTitle: 'Dua Collection',
      duasSub: "Qur'anic supplications from Quran.com and Hisn al-Muslim from Sunnah.com.",
      reflectionTitle: 'Daily Reflection',
      reflectionSub: 'A reminder to pause, reflect, and return to Allah.',
      savedTitle: 'Saved Content',
      savedSub: 'Your favourite verses, stories, and duas on this device.',
      settingsTitle: 'Profile & Settings',
      guidanceTitle: 'Quranic Guidance',
      guidanceSub: 'Selected verses with explanation and reflection.',
      languageLabel: 'Language',
      themeLabel: 'Theme',
      aiResponsesLabel: 'AI responses',
      languageHelp: 'Language preference updates interface labels where available. Quranic Arabic text is always shown in Arabic; translations use verified sources when provided.',
      privacyTitle: 'Privacy',
      privacyHelp: 'Saved items are stored locally on this device. In Local companion mode, conversations stay on-device in this demo build. No account is required.',
      deleteChat: 'Delete chat history',
      clearSaved: 'Clear saved content',
      aboutTitle: 'About this demo',
      aboutText: 'This build includes the complete Quran (114 surahs, Arabic with Saheeh International translation, bundled for offline reading), Qur’anic guidance and stories, 342 duas, and daily prayer times with city auto-detection, Qibla direction, a monthly timetable, and optional reminders while the app is open. Prayer times are calculated by Aladhan.com and should be confirmed with your local mosque.',
      searchSurah: 'Search surah name or number',
      searchDua: 'Search by situation (e.g. distress, forgiveness)',
      messageAria: 'Message',
      sendAria: 'Send'
    },
    dv: {
      chatIntro: 'އައްސަލާމް ޢަލައިކުމް. ހިތުގައި ހުރި ކަމެއް ހިއްސާ ކުރައްވާ. މުނާސަބު ޤުރުއާން އާޔަތެއް، ޢަމަލީ ފިޔަވަޅެއް، އަދި ދުޢާއެއް — މަސްދަރުތަކާއެކު — ހުށަހެޅުމަށް މަސައްކަތް ކުރާނަން.',
      tagline: 'ތިބާގެ ޤުރުއާން އެހީތެރިޔާ',
      splashNote: 'ޤުރުއާން މެދުވެރިކޮށް ހިދާޔަތާއި ހިތްހަމަޖެހުމާއި ތަފައްކުރުން',
      welcomeTitle: 'ނޫރަށް މަރުޙަބާ',
      welcomeLead: 'ދިރިއުޅުމުގެ ދަތިތަކުގެ ތެރޭގައި ކީރިތި ޤުރުއާން މެދުވެރިކޮށް ހިތްހަމަޖެހުމާއި ހިދާޔަތް ހޯދުމަށް ހަމަޖެހި ތަނެއް.',
      important: 'މުހިންމު:',
      disclaimerBox: 'ނޫރު ދެނީ ތަސްދީޤުކުރެވިފައިވާ ޤުރުއާނީ މަސްދަރުތަކުގެ ބިންގާމައްޗަށް ރޫޙާނީ ތަފައްކުރެކެވެ. މިއީ ޤާބިލު ޢާލިމުން، ޞިއްޙީ ފަރުވާ ނުވަތަ ނަފްސާނީ ފަރުވާގެ ބަދަލެއް ނޫން.',
      begin: 'ފަށާ',
      homeGreeting: 'މިއަދު ތިބާގެ ހިތަށް ހަމަޖެހުން ލިބިގެންދިޔުމަށް އެދެމެވެ.',
      heroSub: 'ހިތުގައި ހުރި ކަން ހިއްސާ ކުރައްވާ، އަދި ތިބާގެ ހާލަތަށް އެކަށީގެންވާ އާޔަތްތަކާއި ވާހަކަތަކާއި ދުޢާތައް ހޯދާލައްވާ.',
      talkToNoor: 'ނޫރާ ވާހަކަ ދައްކާ',
      dailyVerse: 'ދުވަހުގެ އާޔަތް',
      todayTimesReminders: 'މިއަދުގެ ގަޑިތަކާއި ހަނދާންކޮށްދިނުން',
      readQuran: 'ޤުރުއާން ކިޔަވާ',
      all114: 'ހުރިހާ 114 ސޫރަތް',
      prayerTimes: 'ނަމާދު ގަޑިތައް',
      timesReminders: 'ގަޑިތަކާއި ހަނދާންކޮށްދިނުން',
      qibla: 'ޤިބްލާ',
      qiblaDir: 'ކަޢުބާއަށް ދިމާ',
      versesReflection: 'އާޔަތްތަކާއި ތަފައްކުރުން',
      storiesTitle: 'ޤުރުއާން ވާހަކަތައް',
      storiesSub: 'ނަބިއްޔުންގެ ވާހަކަތަކާއި ދިރިއުޅުމަށް ބޭނުންވާ އިބުރަތްތައް.',
      lessonsPatience: 'އިބުރަތާއި ކެތްތެރިކަން',
      supplications: 'ދުޢާތައް',
      pauseReflect: 'މަޑުކޮށް ތަފައްކުރޭ',
      favourites: 'ފޭވަރިޓްތައް',
      noorNav: 'ނޫރު',
      shareFeelings: 'ހިތުގެ ހާލަތު ހިއްސާކުރޭ',
      quranTitle: 'ކީރިތި ޤުރުއާން',
      quranSub: 'ހުރިހާ 114 ސޫރަތް • ޢަރަބި އެކަނި ކިޔަވާ، ބޭނުންވާ ވަގުތު މާނަ ބަލާ.',
      prayerSub: 'ދުވަހުގެ ނަމާދު ގަޑިތަކާއި ހަމަޖެހި ހަނދާންކޮށްދިނުން.',
      duasTitle: 'ދުޢާތަކުގެ ޖަމާއަތް',
      duasSub: 'Quran.com އާއި Sunnah.com އިން ޤުރުއާނީ އަދި ޙިޞްނުލް މުސްލިމްގެ ދުޢާތައް.',
      reflectionTitle: 'ދުވަހުގެ ތަފައްކުރު',
      reflectionSub: 'މަޑުކޮށް ތަފައްކުރަން އަދި ﷲ އަށް އެނބުރި ދިއުމަށް ހަނދާންކޮށްދިނުން.',
      savedTitle: 'ރައްކާކުރެވިފައިވާ ކަންތައް',
      savedSub: 'މި ޑިވައިސްގައި ތިބާ ރައްކާކުރި އާޔަތްތަކާއި ވާހަކަތަކާއި ދުޢާތައް.',
      settingsTitle: 'ޕްރޮފައިލް އަދި ސެޓިންގްސް',
      guidanceTitle: 'ޤުރުއާން އިރުޝާދު',
      guidanceSub: 'ބަޔާނާއި ތަފައްކުރުމާއެކު ހޮވާފައިވާ އާޔަތްތައް.',
      languageLabel: 'ބަސް',
      themeLabel: 'ތީމް',
      aiResponsesLabel: 'އެއައި ޖަވާބުތައް',
      languageHelp: 'ބަހުގެ އިންތިޚާބުން ލިބެން ހުރި ތަންތަނުގެ އިންޓަރފޭސް ލޭބަލްތައް ބަދަލުވާނެ. ޤުރުއާން ޢަރަބި ލިޔުން އަބަދުވެސް ޢަރަބިން ދައްކާނެ.',
      privacyTitle: 'ޕްރައިވެސީ',
      privacyHelp: 'ރައްކާކުރާ އެއްޗެއް މި ޑިވައިސްގައި ލޯކަލްކޮށް ރައްކާކުރެވެ. ލޯކަލް ކޮމްޕެނިއަން މޯޑުގައި ވާހަކަތައް މި ޑިވައިސްގައި ހުރެދާނެ.',
      deleteChat: 'ޗެޓް ހިސްޓްރީ ފޮހެލާ',
      clearSaved: 'ރައްކާކުރެވިފައިވާ އެއްޗެއް ފޮހެލާ',
      aboutTitle: 'މި ޑެމޯއާ ބެހޭ',
      aboutText: 'މި ބިލްޑުގައި މުޅި ޤުރުއާން (114 ސޫރަތް)، ޤުރުއާނީ އިރުޝާދާއި ވާހަކަތައް، 342 ދުޢާ، އަދި ނަމާދު ގަޑިތަކާއި ޤިބްލާ ހިމެނޭ. ނަމާދު ގަޑިތައް Aladhan.com އިން ހިސާބު ކުރެވެ؛ ލޯކަލް މިސްކިތުން ޔަގީން ކުރައްވާ.',
      searchSurah: 'ސޫރަތުގެ ނަން ނުވަތަ ނަންބަރު ހޯދާ',
      searchDua: 'ހާލަތަށް ބަލައިގެން ހޯދާ (މިސާލު: ދަތި، ފާފަފުއްސެވުން)',
      messageAria: 'މެސެޖު',
      sendAria: 'ފޮނުވާ',
      privacyFree: 'އިތުރަށް ތަބީޢީ ޖަވާބަކަށް ހިލޭ އޮންލައިން އެއައި ބޭނުން ކުރެވިދާނެ · ޢާލިމެއް، ތެރަޕިސްޓެއް ނުވަތަ ޑޮކްޓަރެއް ނޫން.',
      privacyLocal: 'މި ޑިވައިސްގައި މަތީ ޕްރައިވެޓް · ޢާލިމެއް، ތެރަޕިސްޓެއް ނުވަތަ ޑޮކްޓަރެއް ނޫން.',
      inputPlaceholder: 'ހިތުގައި ހުރި ކަމެއް ލިޔުއްވާ...',
      send: 'ފޮނުވާ',
      reflecting: 'ވިސްނަނީ…',
      thinking: 'ވިސްނަނީ…',
      latest: 'އެންމެ ފަހު',
      copy: 'ކޮޕީ',
      regenerate: 'އަލުން ހެދުމަށް',
      openQuran: 'ޤުރުއާނުގައި ހުޅުވާ',
      moreDuas: 'އިތުރު ދުޢާތައް',
      save: 'ރައްކާކުރޭ',
      savedBtn: 'ރައްކާކުރެވިއްޖެ',
      openDuas: 'ދުޢާތައް ހުޅުވާ',
      openPrayer: 'ނަމާދު ގަޑިތައް ހުޅުވާ',
      openQibla: 'ޤިބްލާ ކޮމްޕަސް ހުޅުވާ',
      openSurah: 'ސޫރަތް ހުޅުވާ',
      verseLabel: 'ޤުރުއާން އާޔަތެއް',
      comfortVerseLabel: 'ހިތްހަމަޖެހޭ އާޔަތެއް',
      relatedStory: 'ގުޅުންހުރި ވާހަކަ',
      practicalSteps: 'ޢަމަލީ ފިޔަވަޅުތައް',
      rightNow: 'މިހާރު',
      closingReflection: 'ނިންމުމުގެ ތަފައްކުރު',
      verifiedRefs: 'ނޫރުގެ ތަސްދީޤުކުރެވިފައިވާ މަސްދަރުތައް:',
      disclaimer: 'ތަފައްކުރުމަށް އެހީތެރިއެއް · ޢާލިމެއް، ތެރަޕިސްޓެއް ނުވަތަ ޑޮކްޓަރެއް ނޫން.',
      disclaimerAi: 'ހިލޭ އެއައި ޖަވާބެއް · މުހިންމު ކަންކަން ޔަގީންކުރައްވާ · ޢާލިމެއް، ތެރަޕިސްޓެއް ނުވަތަ ޑޮކްޓަރެއް ނޫން.',
      disclaimerCrisis: 'ވަގުތުން ނުރައްކާތެރި ހާލަތެއްގައި ވާނަމަ، ހަމައެކަނި އެމަޖެންސީ ޚިދުމަތަށް ގުޅުއްވާ.',
      copied: 'ކޮޕީ ކުރެވިއްޖެ',
      copyFail: 'މި ޑިވައިސްގައި ކޮޕީ ނުކުރެވުނު',
      chatEmpty: 'އައްސަލާމް ޢަލައިކުމް. އަޅުގަނޑު އިހުތިމާމާއެކު އަޑު އަހާނަން. ތިޔަ ކުރިމަތިވެފައިވާ ކަމެއް ހިއްސާ ކުރައްވާ، މުނާސަބު ޤުރުއާން އާޔަތެއް، ޢަމަލީ ފިޔަވަޅެއް އަދި ދުޢާއެއް ތަސްދީޤުކުރެވިފައިވާ މަސްދަރުތަކުން ހުށަހެޅުމަށް މަސައްކަތް ކުރާނަން.',
      chatPrivateNote: 'މި ޑިވައިސްގައި މަތީ ޕްރައިވެޓް · ޢާލިމެއް، ތެރަޕިސްޓެއް ނުވަތަ ޑޮކްޓަރެއް ނޫން.',
      aiModeHelpFree: 'ހިލޭ އެއައި އެވޭލަބަލް ވާހިނދު، އިތުރަށް ތަބީޢީ ޖަވާބުތައް ހެދުމަށް ހިލޭ އޮންލައިން ޚިދުމަތްތައް ބޭނުންކުރާނެ. ތިޔަ މެސެޖާއި ފަހު ކޮންޓެކްސްޓް އެ ޚިދުމަތްތަކަށް ފޮނުވިދާނެ؛ ނަމަވެސް ނޫރުގެ ލައިބްރަރީން ދައްކާ އާޔަތާއި ދުޢާތައް ތަސްދީޤުކުރެވިފައި ހުންނާނެ. ޕްރައިވެޓް އޮފްލައިން ޖަވާބަކަށް ލޯކަލް ކޮމްޕެނިއަން ހޮވާ.',
      aiModeHelpLocal: 'ލޯކަލް ކޮމްޕެނިއަން ނޫރުގެ ތަސްދީޤުކުރެވިފައިވާ ލައިބްރަރީން މި ޑިވައިސްގައި ޖަވާބު ހެދުމާއި، ބޭރު އެއައި ޚިދުމަތަކަށް މެސެޖު ނުފޮނުވާނެ.',
      storyBackground: 'ޕަސްބިން',
      storyWhat: 'ދިމާވި ކަންތައް',
      storyGuidance: 'ﷲ އެންމެންނަށް މަގުދެއްކެވި ގޮތް',
      storyRefs: 'ޤުރުއާނީ މަސްދަރުތައް',
      duaHisnLabel: 'ޙިޞްނުލް މުސްލިމްގެ ދުޢާއެއް',
      duaQuranLabel: 'ޤުރުއާންގެ ދުޢާއެއް',
      meaningLabel: 'މާނަ',
      reflectionLabel: 'ތަފައްކުރު',
      whatCanDo: 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟',
      prompt_lonely: 'އަހަރެން ވަކިވެފައި އަދި އެއްވެސް މީހަކަށް އަހަރެން ނޭނގެ.',
      prompt_financial: 'މާލީ ހުރަހެއް އަހަރެން ކުރިމަތިވަނީ.',
      prompt_grief: 'އަހަރެން ލޯތްބޭކަލަކު ގެއްލިއްޖެ.',
      prompt_future: 'މުސްތަޤްބަލަށް އަހަރެން ބިރު ގަންނަން.',
      prompt_forgive: 'އަހަރެން ގިނަ ކުށްތަކެއް ކޮށްފައިވާ، ﷲ ފާފަ ފުއްސަވާލައްވާނެ ކަމަށް އެދެން.',
      prompt_giveup: 'ދިރިއުޅުން އުނދަގޫތީ ދޫކޮށްލަން ހަދަނީ.',
      prompt_patience: 'ކެތްތެރިވުމަށް އަހަރެން މަސައްކަތް ކުރަނީ.'
    },
    ar: {
      chatIntro: labels && labels.ar ? 'السلام عليكم. شارك ما في قلبك، وسأحاول أن أقدم لك آية قرآنية مناسبة، وخطوة عملية، ودعاء مع المراجع.' : '',
      privacyFree: 'قد تستخدم الردود ذكاءً اصطناعياً مجانياً عبر الإنترنت · لست عالماً أو معالجاً أو طبيباً.',
      privacyLocal: 'خاص بهذا الجهاز · لست عالماً أو معالجاً أو طبيباً.',
      inputPlaceholder: 'شارك ما في قلبك...',
      send: 'إرسال',
      reflecting: 'أتأمل…',
      thinking: 'أفكر…',
      latest: 'الأحدث',
      copy: 'نسخ',
      regenerate: 'إعادة',
      openQuran: 'افتح في القرآن',
      moreDuas: 'المزيد من الأدعية',
      save: 'حفظ',
      savedBtn: 'محفوظ',
      openDuas: 'فتح الأدعية',
      openPrayer: 'فتح أوقات الصلاة',
      openQibla: 'فتح بوصلة القبلة',
      openSurah: 'فتح السورة',
      verseLabel: 'آية قرآنية',
      comfortVerseLabel: 'آية للمواساة',
      relatedStory: 'قصة ذات صلة',
      practicalSteps: 'خطوات عملية',
      rightNow: 'الآن',
      closingReflection: 'تأمل ختامي',
      verifiedRefs: 'مراجع موثقة من مكتبة نور:',
      disclaimer: 'رفيق للتأمل · لست عالماً أو معالجاً أو طبيباً.',
      disclaimerAi: 'رد بالذكاء الاصطناعي · تحقق من الأمور المهمة · لست عالماً أو معالجاً أو طبيباً.',
      disclaimerCrisis: 'إذا كنت في خطر مباشر، فاتصل بخدمات الطوارئ المحلية الآن.',
      copied: 'تم النسخ',
      copyFail: 'تعذر النسخ',
      chatEmpty: 'السلام عليكم. أنا هنا للاستماع بعناية. شارك ما تمر به، وسأقدم آية قرآنية مناسبة وخطوة عملية ودعاء من مصادر موثقة.',
      chatPrivateNote: 'خاص بهذا الجهاز · لست عالماً أو معالجاً أو طبيباً.',
      whatCanDo: 'ماذا يمكنك أن تفعل؟'
    }
  };

  function tr(key, fallback) {
    const lang = state.language || 'en';
    const dict = I18N[lang] || I18N.en;
    return (dict && dict[key]) || (I18N.en && I18N.en[key]) || fallback || key;
  }

  function safeParse(value, fallback) {
    try { return JSON.parse(value); } catch (e) { return fallback; }
  }

  function saveState() {
    const persist = () => {
      localStorage.setItem('noor_theme', state.theme);
      localStorage.setItem('noor_language', state.language);
      localStorage.setItem('noor_ai_mode', state.aiMode || 'free');
      localStorage.setItem('noor_history', JSON.stringify(state.history));
      localStorage.setItem('noor_saved', JSON.stringify(state.saved));
    };
    try {
      persist();
    } catch (e) {
      // Storage may be full or unavailable (private mode). Trim old chat turns
      // and retry once so the conversation still works.
      try {
        state.history = state.history.slice(-20);
        persist();
      } catch (e2) {
        console.warn('Noor: could not save local state', e2);
      }
    }
  }

  function normalizeSaved(saved) {
    const base = { verses: [], stories: [], duas: [] };
    if (!saved || typeof saved !== 'object') return base;
    return {
      verses: Array.isArray(saved.verses) ? saved.verses : [],
      stories: Array.isArray(saved.stories) ? saved.stories : [],
      duas: Array.isArray(saved.duas) ? saved.duas : []
    };
  }

  const THEME_ICONS = {
    sun: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 15.3A8.5 8.5 0 0 1 8.7 3.5a8.5 8.5 0 1 0 11.8 11.8Z"/></svg>'
  };

  function applyTheme() {
    $('#app').setAttribute('data-theme', state.theme);
    $('#setting-theme').value = state.theme;
    const btn = $('#btn-theme');
    btn.innerHTML = state.theme === 'dark' ? THEME_ICONS.sun : THEME_ICONS.moon;
    btn.setAttribute('aria-label', state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    btn.title = btn.getAttribute('aria-label');
  }

  function setText(sel, key, fallback) {
    const el = $(sel);
    if (el) el.textContent = tr(key, fallback || (el ? el.textContent : ''));
  }
  function setPlaceholder(sel, key, fallback) {
    const el = $(sel);
    if (el) el.placeholder = tr(key, fallback || el.placeholder || '');
  }
  function setAria(sel, key, fallback) {
    const el = $(sel);
    if (el) el.setAttribute('aria-label', tr(key, fallback || el.getAttribute('aria-label') || ''));
  }

  function applyLanguage() {
    const lang = state.language || 'en';
    document.documentElement.lang = lang === 'dv' ? 'dv' : (lang === 'ar' ? 'ar' : 'en');
    document.body.dir = (lang === 'dv' || lang === 'ar') ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-dv', lang === 'dv');

    setTopbar(state.view);
    updateAiModeUi();

    const input = $('#chat-input');
    if (input) input.placeholder = tr('inputPlaceholder', 'Share what\u2019s on your heart...');
    const scrollSpan = $('#chat-scroll span');
    if (scrollSpan) scrollSpan.textContent = tr('latest', 'Latest');
    const intro = $('#chat-intro-text');
    if (intro) intro.textContent = tr('chatIntro');

    // Static UI
    setText('.tagline', 'tagline', 'Your Quran Companion');
    setText('.splash-note', 'splashNote', 'Guidance, comfort, and reflection through the Quran');
    const onboard = $('.onboard-card h2'); if (onboard) onboard.textContent = tr('welcomeTitle', onboard.textContent);
    const lead = $('.onboard-card .lead'); if (lead) lead.textContent = tr('welcomeLead', lead.textContent);
    const disc = $('.disclaimer-box'); if (disc) disc.innerHTML = `<strong>${escapeHtml(tr('important','Important:'))}</strong> ${escapeHtml(tr('disclaimerBox','Noor offers spiritual reflection based on verified Quranic sources. It is not a substitute for qualified scholars, medical care, or mental health professionals.'))}`;
    setText('#btn-start', 'begin', 'Begin');
    setText('#home-greeting', 'homeGreeting', 'May your heart find peace today.');
    const heroSub = $('.hero-sub'); if (heroSub) heroSub.textContent = tr('heroSub', heroSub.textContent);
    const talkBtn = $('.hero-card .btn.primary'); if (talkBtn) talkBtn.textContent = tr('talkToNoor', 'Talk to Noor');

    // Section heads common
    $$('#view-home .section-head h3').forEach((h, i) => {
      if (i === 0) h.textContent = tr('dailyVerse', 'Daily Verse');
      if (i === 1) h.textContent = tr('prayer', 'Prayer');
      if (i === 2) h.textContent = tr('reflection', 'Daily Reflection');
    });
    const prayerSub = $$('#view-home .section-head p')[0]; if (prayerSub) prayerSub.textContent = tr('todayTimesReminders', "Today\u2019s times and reminders");

    // Quick grid labels
    const qc = $$('#view-home .quick-card');
    const qMap = [
      [tr('chat','AI Companion'), tr('shareFeelings','Share your feelings')],
      [tr('readQuran','Read Quran'), tr('all114','All 114 surahs')],
      [tr('prayerTimes','Prayer Times'), tr('timesReminders','Times & reminders')],
      [tr('qibla','Qibla'), tr('qiblaDir','Direction to the Kaaba')],
      [tr('guidance','Quranic Guidance'), tr('versesReflection','Verses & reflection')],
      [tr('stories','Quranic Stories'), tr('lessonsPatience','Lessons & patience')],
      [tr('duas','Duas'), tr('supplications','Supplications')],
      [tr('reflection','Daily Reflection'), tr('pauseReflect','Pause & reflect')],
      [tr('saved','Saved'), tr('favourites','Favourites')]
    ];
    qc.forEach((card, i) => {
      const spans = card.querySelectorAll('span:not(.quick-icon), small');
      const m = qMap[i];
      if (m && spans[0]) spans[0].textContent = m[0];
      if (m && spans[1]) spans[1].textContent = m[1];
    });

    // Bottom nav
    const navMap = { home: tr('home','Home'), quran: tr('quran','Quran'), prayer: tr('prayer','Prayer'), chat: tr('noorNav','Noor'), duas: tr('duas','Duas'), settings: tr('settings','Settings') };
    $$('.nav-btn').forEach(btn => { const sp = btn.querySelectorAll('span'); if (sp[1] && navMap[btn.dataset.nav]) sp[1].textContent = navMap[btn.dataset.nav]; });

    // Settings/static forms
    setPlaceholder('#quran-search', 'searchSurah', 'Search surah name or number');
    setPlaceholder('#dua-search', 'searchDua', 'Search by situation (e.g. distress, forgiveness)');
    setPlaceholder('#chat-input', 'inputPlaceholder', 'Share what\u2019s on your heart...');

    // Key section titles
    const vq = $('#view-quran .section-head h3'); if (vq) vq.textContent = tr('quranTitle','The Holy Quran');
    const vqP = $('#view-quran .section-head p'); if (vqP) vqP.textContent = tr('quranSub','All 114 surahs • Read the Arabic on its own, with meaning when you want it.');
    const vp = $('#view-prayer .section-head h3'); if (vp) vp.textContent = tr('prayerTimes','Prayer Times');
    const vpP = $('#view-prayer .section-head p'); if (vpP) vpP.textContent = tr('prayerSub','Daily salah times and gentle reminders.');
    const vs = $('#view-stories .section-head h3'); if (vs) vs.textContent = tr('storiesTitle','Stories of the Quran');
    const vsP = $('#view-stories .section-head p'); if (vsP) vsP.textContent = tr('storiesSub','Accounts of Prophets and lessons relevant to life\u2019s trials.');
    const vd = $('#view-duas .section-head h3'); if (vd) vd.textContent = tr('duasTitle','Dua Collection');
    const vdP = $('#view-duas .section-head p'); if (vdP) vdP.textContent = tr('duasSub',"Qur'anic supplications from Quran.com and Hisn al-Muslim from Sunnah.com.");
    const vr = $('#view-reflection .section-head h3'); if (vr) vr.textContent = tr('reflectionTitle','Daily Reflection');
    const vrP = $('#view-reflection .section-head p'); if (vrP) vrP.textContent = tr('reflectionSub','A reminder to pause, reflect, and return to Allah.');
    const vsa = $('#view-saved .section-head h3'); if (vsa) vsa.textContent = tr('savedTitle','Saved Content');
    const vsaP = $('#view-saved .section-head p'); if (vsaP) vsaP.textContent = tr('savedSub','Your favourite verses, stories, and duas on this device.');
    const vset = $('#view-settings .section-head h3'); if (vset) vset.textContent = tr('settingsTitle','Profile & Settings');
    const vg = $('#view-guidance .section-head h3'); if (vg) vg.textContent = tr('guidanceTitle','Quranic Guidance');
    const vgP = $('#view-guidance .section-head p'); if (vgP) vgP.textContent = tr('guidanceSub','Selected verses with explanation and reflection.');

    // Settings labels/buttons (best-effort by text/ids)
    const setLabels = $$('#view-settings .form-card label.field > span');
    if (setLabels[0]) setLabels[0].textContent = tr('languageLabel','Language');
    if (setLabels[1]) setLabels[1].textContent = tr('themeLabel','Theme');
    if (setLabels[2]) setLabels[2].textContent = tr('aiResponsesLabel','AI responses');
    const helps = $$('#view-settings .help');
    if (helps[0]) helps[0].textContent = tr('languageHelp','Language preference updates interface labels where available. Quranic Arabic text is always shown in Arabic; translations use verified sources when provided.');
    if (helps[2]) helps[2].textContent = tr('privacyHelp','Saved items are stored locally on this device. In Local companion mode, conversations stay on-device in this demo build. No account is required.');
    const h4s = $$('#view-settings h4');
    if (h4s[0]) h4s[0].textContent = tr('privacyTitle','Privacy');
    if (h4s[1]) h4s[1].textContent = tr('aboutTitle','About this demo');
    const clearHist = $('#btn-clear-history'); if (clearHist) clearHist.textContent = tr('deleteChat','Delete chat history');
    const clearSaved = $('#btn-clear-saved'); if (clearSaved) clearSaved.textContent = tr('clearSaved','Clear saved content');
    const aboutHelp = $('#view-settings .card:last-child .help'); if (aboutHelp) aboutHelp.textContent = tr('aboutText', aboutHelp.textContent);

    // Chat form aria
    setAria('#chat-input', 'messageAria', 'Message');
    setAria('.send-btn', 'sendAria', 'Send');

    // Re-render dynamic views that depend on language
    renderHistory();
    renderSaved();
  }

  function updateAiModeUi() {
    const note = $('#chat-privacy-note');
    const help = $('#ai-mode-help');
    if (note) {
      note.textContent = state.aiMode === 'free' ? tr('privacyFree') : tr('privacyLocal');
    }
    if (help) {
      help.textContent = state.aiMode === 'free'
        ? tr('aiModeHelpFree', 'Free AI uses free online services to generate warmer replies when available. Your message and recent context may be sent to those services; verses and du\u2019as shown from Noor\u2019s library remain verified. For private, offline replies, choose Local companion.')
        : tr('aiModeHelpLocal', 'Local companion builds replies on this device from Noor\u2019s verified library and does not send your messages to an external AI service.');
    }
  }

  function t(key) { return (labels[state.language] && labels[state.language][key]) || labels.en[key] || key; }

  function setTopbar(view) {
    const titles = { home: t('home'), chat: t('chat'), guidance: t('guidance'), stories: t('stories'), duas: t('duas'), reflection: t('reflection'), saved: t('saved'), settings: t('settings'), quran: t('quran'), prayer: t('prayer') };
    $('#topbar-title').textContent = titles[view] || 'Noor';
    $('#topbar-eyebrow').textContent = t('greeting');
  }

  function showScreen(id) {
    $$('.screen').forEach(s => s.classList.remove('active'));
    const el = id ? document.getElementById(`screen-${id}`) : null;
    if (el) el.classList.add('active');
    state.screen = id;
  }

  function showView(view) {
    state.view = view;
    $$('.view').forEach(v => v.classList.remove('active'));
    const viewEl = $(`#view-${view}`);
    if (viewEl) viewEl.classList.add('active');
    const content = $('.content');
    if (content) content.classList.toggle('chat-active', view === 'chat');
    const chatForm = $('#chat-form');
    if (chatForm) chatForm.classList.toggle('is-hidden', view !== 'chat');
    // Recitation belongs to the reader; leaving it stops the stream.
    if (view !== 'quran') {
      stopQuranAudio(true);
      closeAudioSheet();
    }
    if (view !== 'prayer') closeQiblaSheet();
    $$('.nav-btn').forEach(b => {
      const active = b.dataset.nav === view;
      b.classList.toggle('active', active);
      if (active) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    setTopbar(view);
    if (view === 'saved') renderSaved();
    if (view === 'chat') updateChatScrollButton();
    else updateChatScrollButton();
    if (view === 'guidance') renderGuidance();
    if (view === 'quran') renderQuranView();
    if (view === 'prayer') renderPrayerView();
    if (view === 'home') updateHomePrayer();
  }

  function scrollChatToBottom() {
    // The chat view scrolls inside .chat-wrap so the composer stays fixed.
    const content = $('.content');
    const chatWrap = $('.chat-wrap');
    const doScroll = () => {
      if (chatWrap) chatWrap.scrollTop = chatWrap.scrollHeight;
      if (content) content.scrollTop = content.scrollHeight;
      // Fallback for browsers where the document itself scrolls.
      window.scrollTo(0, document.documentElement.scrollHeight);
    };
    // Scroll immediately, then again after layout/fonts settle. rAF can be
    // paused in a background tab, so do not rely on it alone.
    doScroll();
    requestAnimationFrame(doScroll);
    setTimeout(doScroll, 80);
    setTimeout(() => { doScroll(); updateChatScrollButton(); }, 350);
  }

  function escapeHtml(str='') {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function getDaily() {
    const day = Math.floor(Date.now() / 86400000);
    return DAILY_REFLECTIONS[day % DAILY_REFLECTIONS.length];
  }

  function renderDaily() {
    const daily = getDaily();
    const verse = VERSES.find(v => v.id === daily.verseId) || VERSES[0];
    $('#daily-reflection').innerHTML = `<h4 style="margin:0 0 6px">${escapeHtml(daily.title)}</h4><p class="muted" style="margin:0">${escapeHtml(daily.text)}</p>`;
    $('#reflection-full').innerHTML = `<h4 style="margin:0 0 6px">${escapeHtml(daily.title)}</h4><p class="muted" style="margin:0">${escapeHtml(daily.text)}</p>`;
    const verseHtml = renderVerseCard(verse, true);
    $('#daily-verse').innerHTML = verseHtml;
    $('#reflection-verse').innerHTML = renderVerseCard(verse, true);
  }

  function isSaved(type, id) { return (state.saved[type] || []).includes(id); }
  function toggleSave(type, id) {
    const arr = state.saved[type] || (state.saved[type] = []);
    const idx = arr.indexOf(id);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(id);
    saveState();
    renderSaved();
    renderGuidance();
    renderStories($('#stories-list'));
    renderDuas();
  }
  window.__toggleSave = toggleSave;

  function saveButton(type, id) {
    const saved = isSaved(type, id);
    return `<button class="save-btn ${saved ? 'saved' : ''}" onclick="__toggleSave('${type}','${id}')">${saved ? '★ ' + escapeHtml(tr('savedBtn', 'Saved')) : '☆ ' + escapeHtml(tr('save', 'Save'))}</button>`;
  }

  function renderVerseCard(v, compact=false) {
    const dv = v.translation_dv ? `<p class="translation"><strong>Dhivehi:</strong> ${escapeHtml(v.translation_dv)}</p>` : (state.language === 'dv' ? `<p class="muted">Dhivehi translation: available in verified sources (not bundled in this demo).</p>` : '');
    return `
      <div>
        <div class="meta">Surah ${escapeHtml(v.surah)} (${v.surahNumber}:${escapeHtml(v.ayah)})</div>
        <div class="arabic">${v.arabic}</div>
        <p class="translation"><strong>English:</strong> ${escapeHtml(v.translation)}</p>
        ${dv}
        ${compact ? '' : `<p class="muted"><strong>Meaning:</strong> ${escapeHtml(v.meaning)}</p><p class="muted"><strong>Reflection:</strong> ${escapeHtml(v.reflection)}</p>`}
        <p class="muted"><strong>Source:</strong> ${escapeHtml(v.source)}</p>
        <div class="save-row">${v.themes.slice(0,3).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')} ${saveButton('verses', v.id)}</div>
      </div>`;
  }

  function renderGuidance() {
    const recent = lastGuidanceVerses();
    const list = recent.length ? recent : VERSES.slice(0,4);
    $('#guidance-list').innerHTML = list.map(v => `<div class="card">${renderVerseCard(v)}</div>`).join('');
  }

  function renderStories(container = $('#stories-list'), items = STORIES) {
    container.innerHTML = items.map(s => `
      <div class="card">
        <div class="meta">${escapeHtml(s.title)}</div>
        <p class="muted"><strong>Background:</strong> ${escapeHtml(s.background)}</p>
        <p class="muted"><strong>What happened:</strong> ${escapeHtml(s.whatHappened)}</p>
        <p class="muted"><strong>Challenges:</strong> ${escapeHtml(s.challenges.join('; '))}</p>
        <p class="muted"><strong>How Allah guided them:</strong> ${escapeHtml(s.guidanceFromAllah)}</p>
        <p class="muted"><strong>Lessons:</strong></p>
        <ul class="muted">${s.lessons.map(l=>`<li>${escapeHtml(l)}</li>`).join('')}</ul>
        <p class="muted"><strong>Apply to your life:</strong> ${escapeHtml(s.apply)}</p>
        <p class="muted"><strong>References:</strong> ${escapeHtml(s.references.join(', '))}</p>
        <p class="muted"><strong>Source:</strong> ${escapeHtml(s.source)}</p>
        <div class="save-row">${s.themes.slice(0,4).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')} ${saveButton('stories', s.id)}</div>
      </div>
    `).join('');
  }

  let duaLimit = 24;
  let duaTagFilter = 'all';
  const DUA_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'anxiety', label: 'Anxiety & sorrow' },
    { id: 'forgiveness', label: 'Forgiveness' },
    { id: 'financial', label: 'Debt & provision' },
    { id: 'protection', label: 'Fear & protection' },
    { id: 'illness', label: 'Illness' },
    { id: 'family', label: 'Family' },
    { id: 'parents', label: 'Parents' },
    { id: 'patience', label: 'Patience' },
    { id: 'travel', label: 'Travel' },
    { id: 'prayer', label: 'Prayer' },
    { id: 'guidance', label: 'Guidance & knowledge' },
    { id: 'gratitude', label: 'Gratitude' },
    { id: 'faith', label: 'Faith & trust' },
    { id: 'heart', label: 'Heart' },
    { id: 'death', label: 'Grief & death' },
    { id: 'hereafter', label: 'Hereafter' },
    { id: 'daily', label: 'Daily life' }
  ];

  function renderDuaFilters() {
    const el = $('#dua-filters');
    if (!el) return;
    el.innerHTML = DUA_FILTERS.map(f => `<button type="button" class="chip ${duaTagFilter === f.id ? 'chip-active' : ''}" data-dua-tag="${f.id}">${f.label}</button>`).join('');
    $$('#dua-filters .chip').forEach(btn => btn.addEventListener('click', () => {
      duaTagFilter = btn.dataset.duaTag;
      duaLimit = 24;
      renderDuas();
    }));
  }

  function duaSearchText(d) {
    return [d.title, d.chapter_en, d.chapter_ar, d.transliteration, d.meaning_en, d.source, d.reference, ...(d.tags || [])].join(' ').toLowerCase();
  }

  function renderDuaCard(d) {
    const isHisn = d.origin === 'hisn';
    const sourceLabel = escapeHtml(d.source || '');
    const source = d.source_url
      ? `<a class="source-link" href="${escapeHtml(d.source_url)}" target="_blank" rel="noopener noreferrer">${sourceLabel} ↗</a>`
      : sourceLabel;
    return `
      <div class="card dua-card">
        <div class="meta">${isHisn ? `Hisn al-Muslim ${d.n}` : 'Qur’anic Du‘ā'}</div>
        <h4 class="dua-title">${escapeHtml(d.title || 'Supplication')}</h4>
        ${d.chapter_ar ? `<p class="dua-arabic-chapter" lang="ar" dir="rtl">${escapeHtml(d.chapter_ar)}</p>` : ''}
        <div class="arabic">${d.arabic}</div>
        ${d.transliteration ? `<p class="translation"><strong>Transliteration:</strong> ${escapeHtml(d.transliteration)}</p>` : ''}
        <p class="translation"><strong>Meaning (English):</strong> ${escapeHtml(d.meaning_en)}</p>
        ${d.meaning_dv ? `<p class="translation"><strong>Meaning (Dhivehi):</strong> ${escapeHtml(d.meaning_dv)}</p>` : ''}
        <p class="muted"><strong>Source:</strong> ${source}</p>
        <div class="save-row">${(d.tags || []).slice(0,4).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')} ${saveButton('duas', d.id)}</div>
      </div>`;
  }

  function renderDuas(items = null) {
    const q = ($('#dua-search')?.value || '').toLowerCase().trim();
    const filtered = (items || DUAS).filter(d => {
      if (q && !duaSearchText(d).includes(q)) return false;
      if (duaTagFilter !== 'all' && !(d.tags || []).includes(duaTagFilter)) return false;
      return true;
    });
    const shown = filtered.slice(0, duaLimit);
    const count = $('#dua-count');
    if (count) {
      const quranicCount = CORE_DUAS.length + QURAN_DUAS.length;
      count.textContent = filtered.length === DUAS.length
        ? `${DUAS.length} duas — ${quranicCount} Qur'anic • ${HISN_DUAS.length} Hisn al-Muslim`
        : `${filtered.length} of ${DUAS.length} duas match`;
    }
    $('#duas-list').innerHTML = shown.map(renderDuaCard).join('') || `<div class="card empty">No duas found for this search. Try another situation or clear the filters.</div>`;
    if (filtered.length > shown.length) {
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'btn secondary';
      more.textContent = `Show all ${filtered.length} results`;
      more.addEventListener('click', () => { duaLimit = filtered.length; renderDuas(items); });
      $('#duas-list').appendChild(more);
    }
    renderDuaFilters();
  }

  function renderSaved() {
    const sv = state.saved.verses.map(id => VERSES.find(v=>v.id===id)).filter(Boolean);
    const ss = state.saved.stories.map(id => STORIES.find(v=>v.id===id)).filter(Boolean);
    const sd = state.saved.duas.map(id => DUAS.find(v=>v.id===id)).filter(Boolean);
    if (!sv.length && !ss.length && !sd.length) {
      $('#saved-list').innerHTML = `<div class="card empty">You have no saved items yet. Tap “Save” on verses, stories, or duas.</div>`;
      return;
    }
    let html = '';
    if (sv.length) html += `<h4 class="section-head">Verses</h4>` + sv.map(v=>`<div class="card">${renderVerseCard(v)}</div>`).join('');
    if (ss.length) {
      const wrap = document.createElement('div');
      renderStories(wrap, ss);
      html += `<h4 class="section-head">Stories</h4>` + wrap.innerHTML;
    }
    if (sd.length) {
      html += `<h4 class="section-head">Duas</h4>` + sd.map(renderDuaCard).join('');
    }
    $('#saved-list').innerHTML = html;
  }

  // ---------- Whole Quran reader ----------
  const QURAN_SCRIPT_SRC = 'quran-text.js?v=3';
  let quranLoadPromise = null;
  let quranQuery = '';
  let quranCurrent = null;
  // Translation is off by default so the reader shows the Arabic on its own.
  // The switch reveals every ayah, and each ayah can be opened on its own.
  let quranMeaning = localStorage.getItem('noor_quran_meaning') === '1';
  let quranFont = Math.min(38, Math.max(20, Number(localStorage.getItem('noor_quran_font')) || 27));

  // ---------- Quran recitation ----------
  // Audio is streamed per ayah from the Islamic Network CDN (AlQuran Cloud).
  // Each reciter has its own available bitrate folder.
  const QURAN_RECITERS = [
    { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', short: 'Alafasy', bitrate: 128 },
    { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)', short: 'Abdul Basit', bitrate: 192 },
    { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman As-Sudais', short: 'As-Sudais', bitrate: 192 },
    { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', short: 'Al-Husary', bitrate: 128 },
    { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', short: 'Al-Minshawi', bitrate: 128 },
    { id: 'ar.mahermuaiqly', name: 'Maher Al-Muaiqly', short: 'Al-Muaiqly', bitrate: 128 },
    { id: 'ar.shaatree', name: 'Abu Bakr Ash-Shaatree', short: 'Ash-Shaatree', bitrate: 128 }
  ];
  let quranReciter = localStorage.getItem('noor_quran_reciter') || QURAN_RECITERS[0].id;
  if (!QURAN_RECITERS.some(r => r.id === quranReciter)) quranReciter = QURAN_RECITERS[0].id;
  let audioEl = null;
  let sheetAyah = null;
  let audioSeeking = false;
  const audioState = { surah: null, index: 0, playing: false, loading: false, repeat: localStorage.getItem('noor_quran_repeat') === '1', completed: false };

  function loadQuranText() {
    if (Array.isArray(window.QURAN_TEXT)) return Promise.resolve(window.QURAN_TEXT);
    if (quranLoadPromise) return quranLoadPromise;
    quranLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = QURAN_SCRIPT_SRC;
      script.onload = () => resolve(window.QURAN_TEXT || []);
      script.onerror = () => { quranLoadPromise = null; reject(new Error('Could not load the Quran text.')); };
      document.body.appendChild(script);
    });
    return quranLoadPromise;
  }

  function renderQuranView() {
    if (quranCurrent) { openSurah(quranCurrent, true); return; }
    if (Array.isArray(window.QURAN_TEXT)) { renderQuranList(); return; }
    $('#quran-browser').classList.remove('hidden');
    $('#quran-reader').classList.add('hidden');
    $('#quran-list').innerHTML = `<div class="card empty">Loading the Quran…</div>`;
    loadQuranText().then(renderQuranList).catch(() => {
      $('#quran-list').innerHTML = `<div class="card empty"><p>The Quran text could not be loaded.</p><button type="button" class="btn secondary" id="quran-retry">Try again</button></div>`;
      const retry = $('#quran-retry');
      if (retry) retry.addEventListener('click', () => { quranLoadPromise = null; renderQuranView(); });
    });
  }

  // Surah names have many accepted transliterations (Baqarah / Al-Baqara,
  // Fatiha / Al-Faatiha). Compare a stripped, consonant-skeleton form so
  // spelling variants still find the right surah.
  function surahSearchForms(text) {
    const lower = String(text || '').toLowerCase();
    const latin = lower
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
    const bare = latin.replace(/^al/, '').replace(/h$/, '');
    const skeleton = bare.replace(/[aeiouy]/g, '').replace(/(.)\1+/g, '$1');
    const arabic = Array.from(lower)
      .filter(ch => !/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/.test(ch))
      .join('')
      .replace(/[ٱأإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه');
    return { latin, bare, skeleton, arabic };
  }
  function surahMatches(s, rawQuery) {
    const query = rawQuery.trim();
    if (!query) return true;
    if (String(s.number) === query) return true;
    const q = surahSearchForms(query);
    for (const field of [s.englishName, s.englishNameTranslation]) {
      const t = surahSearchForms(field);
      if (q.latin && (t.latin.includes(q.latin) || t.bare.includes(q.bare))) return true;
      if (q.skeleton.length >= 2 && t.skeleton.includes(q.skeleton)) return true;
    }
    if (q.arabic) {
      const name = surahSearchForms(s.name);
      if (name.arabic.includes(q.arabic)) return true;
    }
    return false;
  }

  function renderQuranList() {
    const quran = window.QURAN_TEXT || [];
    if (!quran.length) return;
    const filtered = quran.filter(s => surahMatches(s, quranQuery));
    const totalAyahs = quran.reduce((n, s) => n + s.ayahs.length, 0);
    $('#quran-count').textContent = filtered.length === quran.length
      ? `${quran.length} surahs • ${totalAyahs.toLocaleString()} ayahs`
      : `${filtered.length} of ${quran.length} surahs match`;
    $('#quran-list').innerHTML = filtered.map(s => `
      <button type="button" class="quran-surah" data-surah="${s.number}">
        <span class="quran-surah-num">${s.number}</span>
        <span class="quran-surah-main">
          <strong>${escapeHtml(s.englishName)}</strong>
          <small>${escapeHtml(s.englishNameTranslation)} • ${s.ayahs.length} ayahs • ${escapeHtml(s.revelationType)}</small>
        </span>
        <span class="quran-surah-ar" lang="ar" dir="rtl">${escapeHtml(s.name)}</span>
      </button>`).join('') || `<div class="card empty">No surah matches that search.</div>`;
    $$('#quran-list .quran-surah').forEach(btn => btn.addEventListener('click', () => openSurah(Number(btn.dataset.surah))));
    renderQuranContinue();
  }

  function renderQuranContinue() {
    const el = $('#quran-continue');
    if (!el) return;
    const last = Number(localStorage.getItem('noor_last_surah') || 0);
    const surah = (window.QURAN_TEXT || []).find(s => s.number === last);
    if (!surah) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <button type="button" class="card continue-card" data-continue="${surah.number}">
        <span class="continue-label">Continue reading</span>
        <strong>${escapeHtml(surah.englishName)} • ${escapeHtml(surah.englishNameTranslation)}</strong>
        <small>${surah.ayahs.length} ayahs</small>
      </button>`;
    const btn = el.querySelector('[data-continue]');
    if (btn) btn.addEventListener('click', () => openSurah(surah.number));
  }

  function openSurah(number, keepScroll = false) {
    const surah = (window.QURAN_TEXT || []).find(s => s.number === number);
    if (!surah) return;
    // Moving to another surah ends the current recitation.
    if (audioState.surah != null && audioState.surah !== number) stopQuranAudio(true);
    quranCurrent = number;
    try { localStorage.setItem('noor_last_surah', String(number)); } catch (e) {}
    $('#quran-browser').classList.add('hidden');
    $('#quran-reader').classList.remove('hidden');
    renderSurah(surah);
    if (!keepScroll) {
      const content = $('.content');
      if (content) content.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
  function normalizeArabicChar(ch) {
    const code = ch.codePointAt(0);
    if ((code >= 0x064B && code <= 0x065F) || code === 0x0670 || code === 0x0640 || (code >= 0x06D6 && code <= 0x06ED)) return '';
    if (ch === 'ٱ' || ch === 'أ' || ch === 'إ' || ch === 'آ') return 'ا';
    if (ch === 'ى') return 'ي';
    if (ch === 'ة') return 'ه';
    return ch;
  }
  // The Uthmani edition prefixes the Basmala to the first ayah of every surah
  // except Al-Fatihah (where it is ayah 1) and At-Tawba (which has none).
  function stripBasmala(text, surahNumber) {
    if (surahNumber === 1 || surahNumber === 9) return text;
    const target = Array.from(BASMALA).map(normalizeArabicChar).join('');
    const chars = Array.from(text);
    let norm = '';
    let end = -1;
    for (let i = 0; i < chars.length; i++) {
      const c = normalizeArabicChar(chars[i]);
      if (c) norm += c;
      if (norm.length >= target.length) {
        if (norm.slice(0, target.length) === target) end = i + 1;
        break;
      }
      if (!target.startsWith(norm)) return text;
    }
    if (end < 0) return text;
    while (end < chars.length && normalizeArabicChar(chars[end]) === '') end++;
    return chars.slice(end).join('').trim();
  }

  function toArabicNumber(n) {
    return String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  }

  function applyQuranMeaning() {
    const toggle = $('#quran-meaning');
    if (toggle) toggle.checked = quranMeaning;
    const hint = $('#quran-reading-hint');
    if (hint) hint.classList.toggle('hidden', quranMeaning);
  }

  function applyQuranFont() {
    const reader = $('#quran-reader');
    if (reader) reader.style.setProperty('--mushaf-size', quranFont + 'px');
  }

  function setQuranMeaning(on) {
    if (quranMeaning === !!on) return;
    quranMeaning = !!on;
    try {
      localStorage.setItem('noor_quran_meaning', quranMeaning ? '1' : '0');
    } catch (e) {}
    applyQuranMeaning();
    const content = $('.content');
    const scroll = content ? content.scrollTop : 0;
    const surah = (window.QURAN_TEXT || []).find(s => s.number === quranCurrent);
    if (surah) renderSurah(surah);
    if (content) content.scrollTop = scroll;
  }

  function setQuranFont(delta) {
    quranFont = Math.min(38, Math.max(20, quranFont + delta));
    try {
      localStorage.setItem('noor_quran_font', String(quranFont));
    } catch (e) {}
    applyQuranFont();
  }

  function openAyahSheet(number) {
    const surah = (window.QURAN_TEXT || []).find(s => s.number === quranCurrent);
    if (!surah) return;
    const ayah = surah.ayahs.find(a => a.n === number);
    if (!ayah) return;
    sheetAyah = number;
    $('#ayah-sheet-title').textContent = `${surah.englishName} • Ayah ${number}`;
    $('#ayah-sheet-ar').textContent = stripBasmala(ayah.arabic, surah.number).replace(/^\uFEFF/, '');
    $('#ayah-sheet-en').textContent = ayah.english;
    const sheet = $('#ayah-sheet');
    sheet.classList.remove('hidden');
    updateSheetLock();
    const close = sheet.querySelector('.ayah-sheet-close');
    if (close) close.focus({ preventScroll: true });
  }

  function closeAyahSheet() {
    const sheet = $('#ayah-sheet');
    if (!sheet || sheet.classList.contains('hidden')) return;
    sheet.classList.add('hidden');
    sheetAyah = null;
    updateSheetLock();
  }

  function updateSheetLock() {
    const open = ['#ayah-sheet', '#audio-sheet', '#qibla-sheet'].some(sel => {
      const sheet = $(sel);
      return sheet && !sheet.classList.contains('hidden');
    });
    const app = $('#app');
    if (app) app.classList.toggle('sheet-open', open);
  }

  function reciterInfo(id = quranReciter) {
    return QURAN_RECITERS.find(r => r.id === id) || QURAN_RECITERS[0];
  }

  function audioSrc(ayah) {
    const reciter = reciterInfo();
    return `https://cdn.islamic.network/quran/audio/${reciter.bitrate}/${reciter.id}/${ayah.global}.mp3`;
  }

  function activeAudioSurah() {
    return (window.QURAN_TEXT || []).find(s => s.number === audioState.surah) || null;
  }

  function audioSheetIsOpen() {
    const sheet = $('#audio-sheet');
    return !!sheet && !sheet.classList.contains('hidden');
  }

  function ensureAudio() {
    if (audioEl) return audioEl;
    audioEl = new Audio();
    audioEl.preload = 'auto';
    audioEl.addEventListener('play', () => {
      audioState.playing = true;
      audioState.loading = false;
      audioState.completed = false;
      syncAudioUI();
    });
    audioEl.addEventListener('pause', () => {
      if (audioEl.ended) return;
      audioState.playing = false;
      syncAudioUI();
    });
    audioEl.addEventListener('waiting', () => {
      audioState.loading = true;
      syncAudioUI();
    });
    audioEl.addEventListener('playing', () => {
      audioState.playing = true;
      audioState.loading = false;
      syncAudioUI();
    });
    audioEl.addEventListener('canplay', () => {
      audioState.loading = false;
      syncAudioUI();
    });
    audioEl.addEventListener('loadedmetadata', updateAudioProgress);
    audioEl.addEventListener('durationchange', updateAudioProgress);
    audioEl.addEventListener('timeupdate', () => { if (!audioSeeking) updateAudioProgress(); });
    audioEl.addEventListener('ended', handleAudioEnded);
    audioEl.addEventListener('error', () => {
      if (!audioEl || !audioEl.getAttribute('src')) return;
      audioState.playing = false;
      audioState.loading = false;
      syncAudioUI();
      showToast('Could not load this recitation. Check your internet connection and try again.');
    });
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => audioEl.play().catch(() => {}));
        navigator.mediaSession.setActionHandler('pause', () => audioEl.pause());
        navigator.mediaSession.setActionHandler('previoustrack', audioPrev);
        navigator.mediaSession.setActionHandler('nexttrack', audioNext);
      } catch (e) {}
    }
    return audioEl;
  }

  function formatTime(seconds) {
    const s = Math.max(0, Math.floor(Number(seconds) || 0));
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  }

  function updateAudioProgress() {
    const seek = $('#quran-audio-seek');
    const current = $('#quran-audio-current');
    const duration = $('#quran-audio-duration');
    const total = audioEl && isFinite(audioEl.duration) ? audioEl.duration : 0;
    const position = audioEl && isFinite(audioEl.currentTime) ? audioEl.currentTime : 0;
    if (seek) {
      seek.max = String(total || 0);
      if (!audioSeeking) seek.value = String(Math.min(position, total || 0));
    }
    if (current) current.textContent = formatTime(position);
    if (duration) duration.textContent = formatTime(total);
  }

  function updateMediaSession(surah, ayah) {
    if (!('mediaSession' in navigator) || typeof window.MediaMetadata !== 'function') return;
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: `${surah.englishName} · Ayah ${ayah.n}`,
        artist: reciterInfo().name,
        album: 'The Holy Quran'
      });
    } catch (e) {}
  }

  function highlightAudioAyah() {
    $$('#quran-ayahs .is-playing').forEach(el => el.classList.remove('is-playing'));
    if (audioState.surah == null || audioState.surah !== quranCurrent) return;
    const surah = activeAudioSurah();
    if (!surah) return;
    const ayah = surah.ayahs[audioState.index];
    if (!ayah) return;
    const el = $(`#quran-ayahs [data-ayah="${ayah.n}"]`);
    if (el) el.classList.add('is-playing');
  }

  function scrollToAudioAyah(number) {
    if (state.view !== 'quran' || audioSheetIsOpen()) return;
    const el = $(`#quran-ayahs [data-ayah="${number}"]`);
    if (!el) return;
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    catch (e) { el.scrollIntoView(); }
  }

  function syncAudioUI() {
    const surah = (window.QURAN_TEXT || []).find(s => s.number === quranCurrent) || null;
    const active = audioState.surah != null && surah && audioState.surah === surah.number;
    const ayah = active && surah ? surah.ayahs[audioState.index] : null;
    const reciter = reciterInfo();
    const playing = audioState.playing;

    const bar = $('#mushaf-audio');
    if (bar) {
      bar.classList.toggle('is-playing', playing);
      bar.classList.toggle('is-loading', audioState.loading);
    }
    $$('.ma-ic-play').forEach(el => el.classList.toggle('hidden', playing));
    $$('.ma-ic-pause').forEach(el => el.classList.toggle('hidden', !playing));
    const playLabel = playing ? 'Pause recitation' : 'Play recitation';
    ['#quran-play', '#quran-play-big'].forEach(sel => {
      const btn = $(sel);
      if (btn) btn.setAttribute('aria-label', playLabel);
    });

    const title = $('#quran-audio-title');
    if (title) title.textContent = active && surah ? surah.englishName : 'Listen to this surah';
    const status = $('#quran-audio-status');
    if (status) {
      if (!active || !surah) status.textContent = reciter.name;
      else if (audioState.loading) status.textContent = 'Loading audio…';
      else if (audioState.completed) status.textContent = 'Surah complete · Tap play';
      else status.textContent = `${playing ? 'Playing' : 'Paused'} · Ayah ${audioState.index + 1} of ${surah.ayahs.length}`;
    }

    const sheetTitle = $('#audio-sheet-title');
    if (sheetTitle) sheetTitle.textContent = surah ? surah.englishName : 'The Holy Quran';
    const sheetSub = $('#audio-sheet-sub');
    if (sheetSub) sheetSub.textContent = surah ? `Surah ${surah.number} · ${surah.revelationType}` : 'Choose a surah to listen';
    const ayahLabel = $('#audio-ayah-label');
    if (ayahLabel) {
      if (active && surah && ayah) ayahLabel.textContent = `Ayah ${audioState.index + 1} of ${surah.ayahs.length}`;
      else ayahLabel.textContent = 'Choose an ayah to begin';
    }
    const reciterName = $('#audio-reciter-name');
    if (reciterName) reciterName.textContent = reciter.name;
    const repeat = $('#quran-audio-repeat');
    if (repeat) repeat.checked = audioState.repeat;
    const barReciter = $('#quran-reciter');
    if (barReciter) barReciter.value = quranReciter;
    const sheetReciter = $('#quran-reciter-sheet');
    if (sheetReciter) sheetReciter.value = quranReciter;
    if ('mediaSession' in navigator) {
      try { navigator.mediaSession.playbackState = playing ? 'playing' : 'paused'; } catch (e) {}
    }

    highlightAudioAyah();
  }

  function loadQuranAyah(index, autoplay = true, scroll = true) {
    const surah = (window.QURAN_TEXT || []).find(s => s.number === quranCurrent);
    if (!surah || !surah.ayahs.length) return;
    const i = Math.max(0, Math.min(surah.ayahs.length - 1, index));
    const ayah = surah.ayahs[i];
    audioState.surah = surah.number;
    audioState.index = i;
    audioState.completed = false;
    const el = ensureAudio();
    const src = audioSrc(ayah);
    if (el.getAttribute('src') !== src) el.setAttribute('src', src);
    updateMediaSession(surah, ayah);
    syncAudioUI();
    if (autoplay) {
      audioState.loading = true;
      syncAudioUI();
      const promise = el.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(err => {
          audioState.loading = false;
          audioState.playing = false;
          syncAudioUI();
          if (err && err.name === 'NotAllowedError') showToast('Tap play to start the recitation.');
          else showToast('Could not play this recitation. Check your internet connection.');
        });
      }
    }
    if (scroll && ayah) scrollToAudioAyah(ayah.n);
  }

  function toggleQuranAudio() {
    const surah = (window.QURAN_TEXT || []).find(s => s.number === quranCurrent);
    if (!surah) return;
    const el = ensureAudio();
    if (audioState.surah !== surah.number) {
      loadQuranAyah(0, true);
      return;
    }
    if (!el.paused) { el.pause(); return; }
    if (audioState.completed) { loadQuranAyah(0, true); return; }
    if (!el.getAttribute('src')) { loadQuranAyah(audioState.index, true); return; }
    const promise = el.play();
    if (promise && typeof promise.catch === 'function') promise.catch(() => {
      audioState.playing = false;
      audioState.loading = false;
      syncAudioUI();
      showToast('Could not play this recitation. Check your internet connection.');
    });
  }

  function audioNext() {
    const surah = activeAudioSurah();
    if (!surah) {
      loadQuranAyah(0, true);
      return;
    }
    if (audioState.index < surah.ayahs.length - 1) {
      loadQuranAyah(audioState.index + 1, true);
    } else if (audioState.repeat) {
      loadQuranAyah(0, true);
    } else {
      if (audioEl) audioEl.pause();
      audioState.playing = false;
      audioState.completed = true;
      syncAudioUI();
      showToast('Surah complete. Tap play to listen again.');
    }
  }

  function audioPrev() {
    const surah = activeAudioSurah();
    if (!surah) {
      loadQuranAyah(0, true);
      return;
    }
    if (audioState.index > 0) {
      loadQuranAyah(audioState.index - 1, true);
    } else if (audioEl) {
      audioEl.currentTime = 0;
      const promise = audioEl.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
    }
  }

  function handleAudioEnded() {
    const surah = activeAudioSurah();
    if (!surah) return;
    if (audioState.index < surah.ayahs.length - 1) loadQuranAyah(audioState.index + 1, true);
    else if (audioState.repeat) loadQuranAyah(0, true);
    else {
      audioState.playing = false;
      audioState.completed = true;
      syncAudioUI();
    }
  }

  function pauseQuranAudio() {
    if (audioEl && !audioEl.paused) audioEl.pause();
  }

  function stopQuranAudio(reset = true) {
    if (audioEl) audioEl.pause();
    audioState.playing = false;
    audioState.loading = false;
    audioState.completed = false;
    if (reset) {
      audioState.surah = null;
      audioState.index = 0;
      if (audioEl) audioEl.removeAttribute('src');
      updateAudioProgress();
    }
    syncAudioUI();
  }

  function setQuranReciter(id) {
    const next = reciterInfo(id);
    if (next.id === quranReciter) { syncAudioUI(); return; }
    quranReciter = next.id;
    try { localStorage.setItem('noor_quran_reciter', quranReciter); } catch (e) {}
    if (audioState.surah != null) {
      const wasPlaying = audioState.playing;
      loadQuranAyah(audioState.index, wasPlaying, false);
    } else {
      syncAudioUI();
    }
  }

  function openAudioSheet() {
    syncAudioUI();
    const sheet = $('#audio-sheet');
    if (!sheet) return;
    sheet.classList.remove('hidden');
    updateSheetLock();
    const close = sheet.querySelector('.ayah-sheet-close');
    if (close) close.focus({ preventScroll: true });
  }

  function closeAudioSheet() {
    const sheet = $('#audio-sheet');
    if (!sheet || sheet.classList.contains('hidden')) return;
    sheet.classList.add('hidden');
    updateSheetLock();
  }


  function renderSurah(surah) {
    const showBasmala = surah.number !== 1 && surah.number !== 9;
    const ayahs = surah.ayahs.map(a => ({
      n: a.n,
      ar: stripBasmala(a.arabic, surah.number).replace(/^\uFEFF/, ''),
      en: a.english
    }));

    $('#quran-sura-name').textContent = `Surah ${surah.number} · ${surah.englishName}`;
    $('#quran-sura-meta').textContent = `Surah ${surah.number} • ${surah.revelationType}`;
    $('#quran-reader-title').textContent = surah.name;
    $('#quran-reader-subtitle').textContent = `${surah.englishName} · ${surah.englishNameTranslation}`;
    $('#mushaf-eyebrow').textContent = quranMeaning ? 'Arabic with Saheeh International' : 'Read in Arabic';
    const bismillah = $('#mushaf-bismillah');
    bismillah.textContent = showBasmala ? BASMALA : '';
    bismillah.classList.toggle('hidden', !showBasmala);

    const container = $('#quran-ayahs');
    if (quranMeaning) {
      container.classList.add('with-translation');
      container.innerHTML = ayahs.map(a => `
        <div class="mushaf-row" data-ayah="${a.n}">
          <p class="mushaf-ar">${escapeHtml(a.ar)}<span class="ayah-mark" aria-hidden="true">${toArabicNumber(a.n)}</span></p>
          <p class="mushaf-en">${escapeHtml(a.en)}</p>
        </div>`).join('');
    } else {
      container.classList.remove('with-translation');
      container.innerHTML = ayahs.map(a => `<span class="mushaf-ayah" role="button" tabindex="0" data-ayah="${a.n}" aria-label="Ayah ${a.n}. Show meaning">${escapeHtml(a.ar)}<span class="ayah-mark" aria-hidden="true">${toArabicNumber(a.n)}</span></span> `).join('');
      $$('#quran-ayahs .mushaf-ayah').forEach(el => {
        const open = () => openAyahSheet(Number(el.dataset.ayah));
        el.addEventListener('click', open);
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
      });
    }

    $('#mushaf-foot-name').textContent = surah.englishName;
    $('#mushaf-foot-ayahs').textContent = `${surah.ayahs.length} ayahs`;

    const quran = window.QURAN_TEXT || [];
    const prev = quran.find(s => s.number === surah.number - 1);
    const next = quran.find(s => s.number === surah.number + 1);
    const prevBtn = $('#quran-prev');
    const nextBtn = $('#quran-next');
    if (prev) {
      prevBtn.disabled = false;
      prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18 9 12l6-6"/></svg><span>${escapeHtml(prev.englishName)}</span>`;
      prevBtn.onclick = () => openSurah(prev.number);
    } else {
      prevBtn.disabled = true;
      prevBtn.innerHTML = '<span></span>';
      prevBtn.onclick = null;
    }
    if (next) {
      nextBtn.disabled = false;
      nextBtn.innerHTML = `<span>${escapeHtml(next.englishName)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`;
      nextBtn.onclick = () => openSurah(next.number);
    } else {
      nextBtn.disabled = true;
      nextBtn.innerHTML = '<span></span>';
      nextBtn.onclick = null;
    }

    applyQuranMeaning();
    applyQuranFont();
    syncAudioUI();
  }

  function showQuranList() {
    stopQuranAudio(true);
    closeAudioSheet();
    quranCurrent = null;
    $('#quran-reader').classList.add('hidden');
    $('#quran-browser').classList.remove('hidden');
    renderQuranList();
    const content = $('.content');
    if (content) content.scrollTop = 0;
  }

  // ---------- Prayer times and reminders ----------
  const PRAYER_ORDER = [
    { key: 'Fajr', label: 'Fajr', ar: 'الفجر' },
    { key: 'Dhuhr', label: 'Dhuhr', ar: 'الظهر' },
    { key: 'Asr', label: 'Asr', ar: 'العصر' },
    { key: 'Maghrib', label: 'Maghrib', ar: 'المغرب' },
    { key: 'Isha', label: 'Isha', ar: 'العشاء' }
  ];
  const PRAYER_METHODS = [
    { id: 3, label: 'Muslim World League' },
    { id: 2, label: 'Islamic Society of North America (ISNA)' },
    { id: 1, label: 'University of Islamic Sciences, Karachi' },
    { id: 4, label: 'Umm Al-Qura, Makkah' },
    { id: 5, label: 'Egyptian General Authority of Survey' },
    { id: 8, label: 'Gulf Region' },
    { id: 17, label: 'JAKIM, Malaysia' }
  ];

  // Quick picks keep the two most common setup paths instant and also give us
  // reliable coordinates for the Qibla bearing.
  const PRAYER_CITIES = [
    { city: 'Malé', country: 'Maldives', lat: 4.1755, lon: 73.5093 },
    { city: 'Makkah', country: 'Saudi Arabia', lat: 21.4225, lon: 39.8262 },
    { city: 'Madinah', country: 'Saudi Arabia', lat: 24.4672, lon: 39.6111 },
    { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
    { city: 'Doha', country: 'Qatar', lat: 25.2854, lon: 51.5310 },
    { city: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lon: 46.6753 },
    { city: 'Cairo', country: 'Egypt', lat: 30.0444, lon: 31.2357 },
    { city: 'Istanbul', country: 'Türkiye', lat: 41.0082, lon: 28.9784 },
    { city: 'Karachi', country: 'Pakistan', lat: 24.8607, lon: 67.0011 },
    { city: 'Lahore', country: 'Pakistan', lat: 31.5204, lon: 74.3587 },
    { city: 'Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
    { city: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lon: 90.4125 },
    { city: 'Colombo', country: 'Sri Lanka', lat: 6.9271, lon: 79.8612 },
    { city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lon: 101.6869 },
    { city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lon: 106.8456 },
    { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
    { city: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060 },
    { city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
    { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
    { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241 }
  ];
  const KAABA = { lat: 21.422487, lon: 39.826206 };

  const prayerState = (() => {
    const saved = safeParse(localStorage.getItem('noor_prayer'), null) || {};
    return {
      lat: typeof saved.lat === 'number' ? saved.lat : null,
      lon: typeof saved.lon === 'number' ? saved.lon : null,
      city: saved.city || '',
      country: saved.country || '',
      label: saved.label || '',
      method: Number(saved.method) || 3,
      reminders: saved.reminders === true
    };
  })();
  let prayerCache = (() => {
    const cached = safeParse(localStorage.getItem('noor_prayer_cache'), null);
    return cached && cached.key ? cached : null;
  })();
  let prayerFetching = false;
  let prayerLastNext = '';
  let prayerTimer = null;
  let toastTimer = null;
  let prayerAutoTrying = false;
  let prayerMonthCache = null;
  let prayerMonthFetching = false;

  // Qibla compass state. Sensor listeners only run while the sheet is open.
  let qiblaSheetOpen = false;
  let qiblaBearingValue = null;
  let qiblaSmoothed = null;
  let qiblaLive = false;
  let qiblaAligned = false;
  let qiblaListening = false;
  let qiblaSensorSeen = false;
  let qiblaSensorTimer = null;
  let qiblaPermissionGranted = false;
  try { qiblaPermissionGranted = localStorage.getItem('noor_qibla_compass') === '1'; } catch (e) {}

  function pad2(n) { return String(n).padStart(2, '0'); }
  function todayKey() { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function aladhanDate() { const d = new Date(); return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`; }
  function hasPrayerLocation() { return (prayerState.lat != null && prayerState.lon != null) || !!prayerState.city; }
  function prayerLabel() {
    if (prayerState.label) return prayerState.label;
    if (prayerState.city) return `${prayerState.city}${prayerState.country ? ', ' + prayerState.country : ''}`;
    return 'Your location';
  }
  function prayerLocationKey() {
    if (prayerState.lat != null && prayerState.lon != null) return `geo:${prayerState.lat.toFixed(3)},${prayerState.lon.toFixed(3)}`;
    return `city:${prayerState.city.toLowerCase()}|${prayerState.country.toLowerCase()}`;
  }
  function prayerCacheKey() { return `${todayKey()}|${prayerLocationKey()}|${prayerState.method}`; }
  function activePrayerCache() { return prayerCache && prayerCache.key === prayerCacheKey() ? prayerCache : null; }
  function savePrayerState() {
    try { localStorage.setItem('noor_prayer', JSON.stringify(prayerState)); } catch (e) {}
  }

  function timeToday(hhmm) {
    const parts = String(hhmm || '').split(':').map(Number);
    if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    const d = new Date();
    d.setHours(parts[0], parts[1], 0, 0);
    return d;
  }
  function countdownText(ms) {
    const total = Math.max(0, Math.round(ms / 60000));
    const h = Math.floor(total / 60);
    const m = total % 60;
    if (h <= 0) return `in ${m} min`;
    return `in ${h}h ${m}m`;
  }
  function getNextPrayer(timings) {
    if (!timings) return null;
    const now = new Date();
    for (const p of PRAYER_ORDER) {
      const d = timeToday(timings[p.key]);
      if (d && d > now) return { ...p, time: timings[p.key], date: d, countdown: countdownText(d - now), tomorrow: false };
    }
    const fajr = timeToday(timings.Fajr);
    if (!fajr) return null;
    fajr.setDate(fajr.getDate() + 1);
    return { ...PRAYER_ORDER[0], time: timings.Fajr, date: fajr, countdown: countdownText(fajr - now), tomorrow: true };
  }

  // Which prayer window are we in right now? After sunrise the Fajr window has
  // ended, so show Duha until Dhuhr, matching the way prayer apps label the day.
  function getCurrentPrayerWindow(timings) {
    if (!timings) return null;
    const now = new Date();
    const fajr = timeToday(timings.Fajr);
    const sunrise = timeToday(timings.Sunrise);
    const dhuhr = timeToday(timings.Dhuhr);
    if (fajr && now >= fajr && (!sunrise || now < sunrise)) return { key: 'Fajr', label: 'Fajr', ar: 'الفجر' };
    if (sunrise && now >= sunrise && (!dhuhr || now < dhuhr)) return { key: 'Duha', label: 'Duha', ar: 'الضحى' };
    let current = null;
    for (const p of PRAYER_ORDER) {
      const d = timeToday(timings[p.key]);
      if (d && d <= now) current = p;
    }
    return current || PRAYER_ORDER[4];
  }

  function qiblaBearing(lat, lon) {
    const toRad = d => d * Math.PI / 180;
    const dLon = toRad(KAABA.lon - lon);
    const y = Math.sin(dLon);
    const x = Math.cos(toRad(lat)) * Math.tan(toRad(KAABA.lat)) - Math.sin(toRad(lat)) * Math.cos(dLon);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function prayerCoordinates() {
    if (prayerState.lat != null && prayerState.lon != null) {
      return { lat: Number(prayerState.lat), lon: Number(prayerState.lon) };
    }
    return null;
  }

  function cleanTiming(value) {
    return String(value || '').split(' ')[0];
  }

  function prayerMonthKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}|${prayerLocationKey()}|${prayerState.method}`;
  }

  function showToast(message) {
    const app = $('#app');
    let toast = $('#noor-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'noor-toast';
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      app.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 6000);
  }

  function prayerMethodCardHtml() {
    return `
      <div class="card">
        <h4>Calculation method</h4>
        <label class="field"><span>Method</span>
          <select id="prayer-method">
            ${PRAYER_METHODS.map(m => `<option value="${m.id}" ${prayerState.method === m.id ? 'selected' : ''}>${escapeHtml(m.label)}</option>`).join('')}
          </select>
        </label>
        <p class="help">Choose the method used by your local mosque or authority.</p>
      </div>`;
  }

  function prayerSetupHtml() {
    const autoOff = localStorage.getItem('noor_prayer_autodetect') === 'off';
    const cityChips = PRAYER_CITIES.map((c, i) => `
      <button type="button" class="pb-city-chip" data-prayer-city="${i}" title="${escapeHtml(c.city + ', ' + c.country)}">${escapeHtml(c.city)}</button>`).join('');
    return `
      <div class="card prayer-setup">
        <h4>Choose your location</h4>
        <p class="help">See today’s prayer times, the next prayer countdown, Qibla direction, and this month’s timetable for your city.</p>
        <p class="pb-detect" id="prayer-detect-status">${autoOff ? 'Automatic detection is off. Choose a city below.' : 'Detecting your city automatically…'}</p>
        <div class="pb-city-chips">${cityChips}</div>
        <div class="pb-setup-actions">
          <button type="button" class="btn primary" id="prayer-geo">Use device location</button>
          <button type="button" class="btn secondary" id="prayer-detect">Detect city automatically</button>
        </div>
        <div class="divider"></div>
        <label class="field"><span>City</span><input id="prayer-city" type="text" placeholder="e.g. Malé" autocomplete="address-level2" /></label>
        <label class="field"><span>Country</span><input id="prayer-country" type="text" placeholder="e.g. Maldives" autocomplete="country-name" /></label>
        <button type="button" class="btn secondary" id="prayer-save-city">Save city</button>
        <p class="help">Automatic detection estimates your city from your IP address using ipwho.is. Your saved location stays on this device.</p>
      </div>
      ${prayerMethodCardHtml()}
      <p class="muted dua-attribution">Prayer times from <a class="source-link" href="https://aladhan.com" target="_blank" rel="noopener noreferrer">Aladhan.com ↗</a>. Confirm locally with your mosque and a qualified scholar.</p>`;
  }

  function renderPrayerView() {
    const el = $('#prayer-content');
    if (!el) return;
    if (!hasPrayerLocation()) {
      el.innerHTML = prayerSetupHtml();
      bindPrayerControls();
      autoDetectPrayerLocation();
      return;
    }
    const cached = activePrayerCache();
    if (cached) { renderPrayerData(cached); return; }
    el.innerHTML = `<div class="card empty">Fetching prayer times for ${escapeHtml(prayerLabel())}…</div>`;
    fetchPrayerTimes();
  }

  function setPrayerCity(index) {
    const city = PRAYER_CITIES[index];
    if (!city) return;
    prayerState.lat = city.lat;
    prayerState.lon = city.lon;
    prayerState.city = city.city;
    prayerState.country = city.country;
    prayerState.label = `${city.city}, ${city.country}`;
    savePrayerState();
    prayerCache = null;
    prayerMonthCache = null;
    try { localStorage.setItem('noor_prayer_autodetect', 'off'); } catch (e) {}
    renderPrayerView();
  }

  function normalizePlace(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Typed cities start without coordinates, which would leave the Qibla card
  // hidden. Geocode the name so the compass and coordinate-based times work.
  async function geocodePrayerCity(city, country) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('geocode unavailable');
    const json = await res.json();
    const results = Array.isArray(json.results) ? json.results : [];
    if (!results.length) return null;
    const wantedCountry = normalizePlace(country);
    const wantedCity = normalizePlace(city);
    const exact = results.filter(r => normalizePlace(r.name) === wantedCity);
    let hit = null;
    if (wantedCountry) {
      const inCountry = results.filter(r =>
        normalizePlace(r.country) === wantedCountry ||
        normalizePlace(r.country_code) === wantedCountry
      );
      hit = inCountry.find(r => exact.includes(r)) || inCountry[0] || null;
      if (!hit) {
        hit = results.find(r => normalizePlace(r.country).includes(wantedCountry)) || null;
      }
    } else if (exact.length) {
      // Prefer exact name matches so "Malé" does not resolve to Malegaon.
      hit = exact[0];
    } else if (results.length === 1) {
      hit = results[0];
    }
    if (!hit) return null;
    const lat = Number(hit.latitude);
    const lon = Number(hit.longitude);
    if (!isFinite(lat) || !isFinite(lon)) return null;
    return {
      lat,
      lon,
      city: hit.name || city,
      country: hit.country || country
    };
  }

  function bindPrayerControls() {
    const geo = $('#prayer-geo');
    if (geo) geo.addEventListener('click', requestPrayerLocation);
    $$('#prayer-content [data-prayer-city]').forEach(btn => {
      btn.addEventListener('click', () => setPrayerCity(Number(btn.dataset.prayerCity)));
    });
    const detect = $('#prayer-detect');
    if (detect) detect.addEventListener('click', () => {
      try { localStorage.removeItem('noor_prayer_autodetect'); } catch (e) {}
      const status = $('#prayer-detect-status');
      if (status) status.textContent = 'Detecting your city automatically…';
      autoDetectPrayerLocation(true);
    });
    const save = $('#prayer-save-city');
    if (save) save.addEventListener('click', async () => {
      const city = ($('#prayer-city')?.value || '').trim();
      const country = ($('#prayer-country')?.value || '').trim();
      if (!city) { showToast('Please enter a city first.'); return; }
      save.disabled = true;
      save.textContent = 'Saving…';
      let geo = null;
      try { geo = await geocodePrayerCity(city, country); } catch (e) {}
      prayerState.lat = geo ? geo.lat : null;
      prayerState.lon = geo ? geo.lon : null;
      prayerState.city = (geo && geo.city) || city;
      prayerState.country = (geo && geo.country) || country;
      prayerState.label = `${prayerState.city}${prayerState.country ? ', ' + prayerState.country : ''}`;
      savePrayerState();
      prayerCache = null;
      prayerMonthCache = null;
      try { localStorage.setItem('noor_prayer_autodetect', 'off'); } catch (e) {}
      renderPrayerView();
      if (geo) showToast(`Location set to ${prayerState.label}. Qibla is ready.`);
      else showToast('Location saved. Use device location if you want the live Qibla compass.');
    });
    bindPrayerMethod();
  }

  function bindPrayerMethod() {
    const sel = $('#prayer-method');
    if (!sel) return;
    sel.addEventListener('change', () => {
      prayerState.method = Number(sel.value) || 3;
      savePrayerState();
      prayerCache = null;
      prayerMonthCache = null;
      renderPrayerView();
    });
  }

  function requestPrayerLocation() {
    if (!navigator.geolocation) {
      showToast('This browser cannot access your location. Enter a city instead.');
      return;
    }
    const btn = $('#prayer-geo');
    if (btn) { btn.disabled = true; btn.textContent = 'Locating…'; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        prayerState.lat = pos.coords.latitude;
        prayerState.lon = pos.coords.longitude;
        prayerState.city = '';
        prayerState.country = '';
        prayerState.label = 'Your location';
        savePrayerState();
        prayerCache = null;
        prayerMonthCache = null;
        try { localStorage.setItem('noor_prayer_autodetect', 'off'); } catch (e) {}
        renderPrayerView();
      },
      () => {
        if (btn) { btn.disabled = false; btn.textContent = 'Use device location'; }
        showToast('Could not access your location. Enter a city instead.');
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 }
    );
  }

  // Quran Majeed detects the city from the connection. We do the same with a
  // lightweight IP lookup, then the times themselves still come from Aladhan.
  function autoDetectPrayerLocation(force = false) {
    if (hasPrayerLocation() || prayerAutoTrying) return;
    if (!force && localStorage.getItem('noor_prayer_autodetect') === 'off') return;
    prayerAutoTrying = true;
    fetch('https://ipwho.is/')
      .then(res => res.json())
      .then(info => {
        const lat = Number(info && info.latitude);
        const lon = Number(info && info.longitude);
        if (!info || info.success === false || !isFinite(lat) || !isFinite(lon)) throw new Error('not found');
        if (hasPrayerLocation()) return;
        prayerState.lat = lat;
        prayerState.lon = lon;
        prayerState.city = info.city || '';
        prayerState.country = info.country || '';
        prayerState.label = [info.city, info.country].filter(Boolean).join(', ') || 'Your location';
        savePrayerState();
        prayerCache = null;
        prayerMonthCache = null;
        try { localStorage.setItem('noor_prayer_autodetect', 'done'); } catch (e) {}
        showToast(`Prayer times set for ${prayerLabel()} — change it anytime.`);
        if (state.view === 'prayer') renderPrayerView();
        else fetchPrayerTimes();
        updateHomePrayer();
      })
      .catch(() => {
        const status = $('#prayer-detect-status');
        if (status) status.textContent = 'Could not detect your city automatically. Choose one below.';
      })
      .finally(() => { prayerAutoTrying = false; });
  }

  async function fetchPrayerTimes(force = false) {
    if (!hasPrayerLocation() || prayerFetching) return;
    if (!force && activePrayerCache()) { renderPrayerData(activePrayerCache()); return; }
    prayerFetching = true;
    try {
      const date = aladhanDate();
      const method = prayerState.method || 3;
      let url;
      if (prayerState.lat != null && prayerState.lon != null) {
        url = `https://api.aladhan.com/v1/timings/${date}?latitude=${encodeURIComponent(prayerState.lat)}&longitude=${encodeURIComponent(prayerState.lon)}&method=${method}`;
      } else {
        url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(prayerState.city)}&country=${encodeURIComponent(prayerState.country)}&method=${method}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || json.code !== 200 || !json.data || !json.data.timings) throw new Error((json && json.status) || 'Prayer times unavailable');
      const data = json.data;
      const hijri = data.date && data.date.hijri
        ? `${data.date.hijri.day} ${(data.date.hijri.month && data.date.hijri.month.en) || ''} ${data.date.hijri.year} AH`.replace(/\s+/g, ' ').trim()
        : '';
      prayerCache = {
        key: prayerCacheKey(),
        timings: data.timings,
        readable: (data.date && data.date.readable) || '',
        hijri,
        timezone: (data.meta && data.meta.timezone) || '',
        methodName: (data.meta && data.meta.method && data.meta.method.name) || '',
        fetchedAt: Date.now()
      };
      try { localStorage.setItem('noor_prayer_cache', JSON.stringify(prayerCache)); } catch (e) {}
      if (state.view === 'prayer') renderPrayerData(prayerCache);
      updateHomePrayer();
    } catch (e) {
      if (state.view === 'prayer') {
        const el = $('#prayer-content');
        el.innerHTML = `<div class="card empty"><p>Prayer times could not be loaded right now.</p><p class="help">${escapeHtml(e.message || 'Check your connection and try again.')}</p><button type="button" class="btn secondary" id="prayer-retry">Try again</button></div>`;
        const retry = $('#prayer-retry');
        if (retry) retry.addEventListener('click', () => fetchPrayerTimes(true));
      }
    } finally {
      prayerFetching = false;
    }
  }

  const PRAYER_ICONS = {
    Fajr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18h18"/><path d="M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M12 4v3"/><path d="m5.2 7.2 1.8 1.8"/><path d="m18.8 7.2-1.8 1.8"/></svg>',
    Dhuhr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
    Asr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="10.5" r="4"/><path d="M12 2v2M4.9 4.4l1.4 1.4M19.1 4.4l-1.4 1.4M2 10.5h2M20 10.5h2"/><path d="M3 19h18"/></svg>',
    Maghrib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18h18"/><path d="M6.5 18a5.5 5.5 0 0 1 11 0"/><path d="M12 7V4M5.2 10.2 3.8 8.8M18.8 10.2l1.4-1.4"/></svg>',
    Isha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 7.5 7.5 0 1 0 20 14.5Z"/><path d="M17 3.5v2M21 6v2"/></svg>'
  };

  function renderPrayerData(data) {
    const el = $('#prayer-content');
    if (!el) return;
    const next = getNextPrayer(data.timings);
    prayerLastNext = next ? `${next.key}|${next.time}` : '';
    const tiles = PRAYER_ORDER.map(p => {
      const time = data.timings[p.key];
      if (!time) return '';
      const isNext = next && next.key === p.key;
      return `
        <div class="pb-tile ${isNext ? 'pb-tile-next' : ''}">
          <span class="pb-tile-icon">${PRAYER_ICONS[p.key] || ''}</span>
          <span class="pb-tile-name">${escapeHtml(p.label)}</span>
          <span class="pb-tile-time">${escapeHtml(time)}</span>
        </div>`;
    }).join('');
    const sunrise = data.timings.Sunrise
      ? `<p class="pb-sunrise"><span>Sunrise</span><strong>${escapeHtml(data.timings.Sunrise)}</strong></p>`
      : '';
    const reminderSupported = 'Notification' in window;
    const permission = reminderSupported ? Notification.permission : 'unsupported';
    const nextBlock = next ? `
      <div class="pb-next">
        <span class="pb-next-label">Next prayer</span>
        <div class="pb-next-main">
          <span class="pb-next-name">${escapeHtml(next.label)}<em lang="ar" dir="rtl">${escapeHtml(next.ar)}</em></span>
          <span class="pb-next-time">${escapeHtml(next.time)}</span>
        </div>
        <p class="pb-countdown"><span id="prayer-countdown">${escapeHtml(next.countdown)}${next.tomorrow ? ' (tomorrow)' : ''}</span></p>
      </div>` : '';
    const currentWindow = getCurrentPrayerWindow(data.timings);
    const nowBlock = currentWindow ? `
      <p class="pb-now">
        <span class="pb-now-dot" aria-hidden="true"></span>
        <span>It’s <strong>${escapeHtml(currentWindow.label)}</strong> time</span>
        <em lang="ar" dir="rtl">${escapeHtml(currentWindow.ar)}</em>
      </p>` : '';
    const coords = prayerCoordinates();
    const qibla = coords ? qiblaBearing(coords.lat, coords.lon) : null;
    const qiblaBlock = qibla == null ? '' : `
      <div class="card pb-qibla-card" id="qibla-open" role="button" tabindex="0" aria-haspopup="dialog" aria-controls="qibla-sheet" aria-label="Open the live Qibla compass">
        <div class="pb-qibla-copy">
          <h4>Qibla direction</h4>
          <p class="pb-qibla-deg">${Math.round(qibla)}° <span>from true north</span></p>
          <p class="help">From ${escapeHtml(prayerLabel())}. Tap to open the live compass.</p>
        </div>
        <div class="pb-compass" style="--qibla:${qibla.toFixed(1)}deg" aria-hidden="true">
          <span class="pb-compass-n">N</span>
          <span class="pb-needle"><span class="pb-kaaba"></span></span>
          <span class="pb-compass-center"></span>
        </div>
      </div>`;
    const monthOpen = !!$('#prayer-month') && !$('#prayer-month').classList.contains('hidden');
    el.innerHTML = `
      <section class="prayer-board">
        <div class="pb-head">
          <span class="pb-loc">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>
            ${escapeHtml(prayerLabel())}
          </span>
          <button type="button" class="pb-refresh" id="prayer-refresh" aria-label="Refresh prayer times">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/></svg>
          </button>
        </div>
        <p class="pb-date">${escapeHtml(data.readable)}${data.hijri ? ' • ' + escapeHtml(data.hijri) : ''}</p>
        ${nowBlock}
        ${nextBlock}
        <div class="pb-grid">${tiles}</div>
        ${sunrise}
        <p class="pb-note">${escapeHtml(data.methodName || '')}${data.timezone ? ' • ' + escapeHtml(data.timezone) : ''}</p>
      </section>
      ${qiblaBlock}
      <div class="card pb-month-card">
        <button type="button" class="pb-month-toggle" id="prayer-month-toggle" aria-expanded="${monthOpen}" aria-controls="prayer-month">
          <span class="pb-month-title"><strong>This month</strong><small>Daily prayer timetable</small></span>
          <svg class="pb-month-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div id="prayer-month" class="pb-month${monthOpen ? '' : ' hidden'}"></div>
      </div>
      <div class="card prayer-rem-card">
        <h4>Adhan reminders</h4>
        <label class="toggle-row">
          <span>Notify me at prayer time</span>
          <input type="checkbox" id="prayer-reminders" ${prayerState.reminders ? 'checked' : ''} />
        </label>
        <p class="help">Reminders appear while Noor is open in your browser.${permission === 'denied' ? ' Notifications are blocked for this app; in-app reminders will still show.' : ''}</p>
        <button type="button" class="btn secondary" id="prayer-test">Send test reminder</button>
      </div>
      ${prayerMethodCardHtml()}
      <div class="card">
        <h4>Location</h4>
        <p class="muted">${escapeHtml(prayerLabel())}</p>
        <button type="button" class="btn secondary" id="prayer-change-location">Change location</button>
      </div>
      <p class="muted dua-attribution">Prayer times from <a class="source-link" href="https://aladhan.com" target="_blank" rel="noopener noreferrer">Aladhan.com ↗</a>. Times are calculated for ${escapeHtml(prayerLabel())}${data.timezone ? ' (' + escapeHtml(data.timezone) + ')' : ''}; confirm locally with your mosque and a qualified scholar.</p>`;
    bindPrayerData();
    if (monthOpen) togglePrayerMonth(true);
  }

  function bindPrayerData() {
    bindPrayerMethod();
    const reminders = $('#prayer-reminders');
    if (reminders) reminders.addEventListener('change', () => setPrayerReminders(reminders.checked));
    const test = $('#prayer-test');
    if (test) test.addEventListener('click', () => notifyPrayer('Fajr', true));
    const change = $('#prayer-change-location');
    if (change) change.addEventListener('click', () => {
      prayerState.lat = null;
      prayerState.lon = null;
      prayerState.city = '';
      prayerState.country = '';
      prayerState.label = '';
      savePrayerState();
      prayerCache = null;
      prayerMonthCache = null;
      try { localStorage.setItem('noor_prayer_autodetect', 'off'); } catch (e) {}
      renderPrayerView();
    });
    const refresh = $('#prayer-refresh');
    if (refresh) refresh.addEventListener('click', () => fetchPrayerTimes(true));
    const qiblaOpen = $('#qibla-open');
    if (qiblaOpen) {
      qiblaOpen.addEventListener('click', openQiblaSheet);
      qiblaOpen.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQiblaSheet(); }
      });
    }
    const monthToggle = $('#prayer-month-toggle');
    if (monthToggle) monthToggle.addEventListener('click', () => togglePrayerMonth());
  }

  function togglePrayerMonth(force) {
    const wrap = $('#prayer-month');
    const btn = $('#prayer-month-toggle');
    if (!wrap || !btn) return;
    const open = typeof force === 'boolean' ? force : wrap.classList.contains('hidden');
    wrap.classList.toggle('hidden', !open);
    btn.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) loadPrayerMonth();
  }

  async function loadPrayerMonth() {
    const wrap = $('#prayer-month');
    if (!wrap) return;
    const key = prayerMonthKey();
    if (prayerMonthCache && prayerMonthCache.key === key) {
      renderPrayerMonth(prayerMonthCache);
      return;
    }
    if (prayerMonthFetching) return;
    prayerMonthFetching = true;
    wrap.innerHTML = '<p class="pb-month-loading">Loading this month’s times…</p>';
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const method = prayerState.method || 3;
      let url;
      if (prayerState.lat != null && prayerState.lon != null) {
        url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${encodeURIComponent(prayerState.lat)}&longitude=${encodeURIComponent(prayerState.lon)}&method=${method}`;
      } else {
        url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(prayerState.city)}&country=${encodeURIComponent(prayerState.country)}&method=${method}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || json.code !== 200 || !Array.isArray(json.data)) throw new Error('unavailable');
      prayerMonthCache = { key, days: json.data };
      const current = $('#prayer-month');
      if (current && !current.classList.contains('hidden')) renderPrayerMonth(prayerMonthCache);
    } catch (e) {
      const current = $('#prayer-month');
      if (current) {
        current.innerHTML = '<p class="pb-month-loading">Could not load this month’s timetable. <button type="button" class="pb-month-retry" id="prayer-month-retry">Try again</button></p>';
        const retry = $('#prayer-month-retry');
        if (retry) retry.addEventListener('click', () => { prayerMonthCache = null; loadPrayerMonth(); });
      }
    } finally {
      prayerMonthFetching = false;
    }
  }

  function renderPrayerMonth(cache) {
    const wrap = $('#prayer-month');
    if (!wrap || !cache) return;
    const today = aladhanDate();
    const rows = cache.days.map(day => {
      const g = (day.date && day.date.gregorian) || {};
      const isToday = g.date === today;
      const weekday = (g.weekday && g.weekday.en) ? g.weekday.en.slice(0, 3) : '';
      const cells = PRAYER_ORDER.map(p => `<td>${escapeHtml(cleanTiming(day.timings && day.timings[p.key]))}</td>`).join('');
      return `<tr class="${isToday ? 'is-today' : ''}"><th scope="row"><span>${escapeHtml(String(g.day || ''))}</span><small>${escapeHtml(weekday)}</small></th>${cells}</tr>`;
    }).join('');
    const heads = PRAYER_ORDER.map(p => `<th>${escapeHtml(p.label === 'Maghrib' ? 'Magh.' : p.label)}</th>`).join('');
    wrap.innerHTML = `
      <div class="pb-month-scroll">
        <table class="pb-month-table">
          <thead><tr><th>Day</th>${heads}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <p class="pb-month-note">Calculated with ${escapeHtml(prayerState.method === 3 ? 'Muslim World League' : (PRAYER_METHODS.find(m => m.id === prayerState.method) || {}).label || 'your chosen method')}. Confirm locally with your mosque.</p>`;
  }

  // ----- Live Qibla compass -----

  function qiblaNormalize(deg) { return ((deg % 360) + 360) % 360; }

  // Shortest signed angle from current to target, in (-180, 180].
  function qiblaDelta(target, current) { return ((target - current + 540) % 360) - 180; }

  function setQiblaStatus(main, sub) {
    const status = $('#qibla-status');
    const diff = $('#qibla-diff');
    if (status) status.textContent = main;
    if (diff) diff.textContent = sub || '';
  }

  function updateQiblaVisual() {
    if (qiblaBearingValue == null) return;
    const rose = $('#qibla-rose');
    const heading = qiblaSmoothed == null ? 0 : qiblaSmoothed;
    if (rose) {
      rose.style.setProperty('--heading', heading.toFixed(1));
      rose.style.setProperty('--bearing', qiblaBearingValue.toFixed(1));
    }
    const stage = $('#qibla-stage');
    if (stage) {
      stage.classList.toggle('is-live', qiblaLive);
      stage.classList.toggle('is-aligned', qiblaAligned);
    }
    const deg = $('#qibla-deg');
    if (deg) deg.textContent = `${Math.round(qiblaBearingValue)}°`;
    const headingEl = $('#qibla-heading');
    if (headingEl) headingEl.textContent = qiblaLive ? `${Math.round(heading)}°` : '—';
    if (!qiblaLive) return;

    const diff = qiblaDelta(qiblaBearingValue, heading);
    const abs = Math.abs(diff);
    const aligned = abs <= 5;
    if (aligned !== qiblaAligned) {
      qiblaAligned = aligned;
      if (stage) stage.classList.toggle('is-aligned', aligned);
      if (aligned && navigator.vibrate) {
        try { navigator.vibrate(30); } catch (e) {}
      }
    }
    if (aligned) {
      setQiblaStatus('Facing the Qibla', 'You are aligned with the Kaaba. May Allah accept your prayer.');
    } else {
      const direction = diff > 0 ? 'right' : 'left';
      setQiblaStatus(`Turn ${direction} ${Math.round(abs)}°`, 'Rotate until the gold Kaaba marker reaches the top.');
    }
  }

  // Sensor events arrive at most once per frame on most phones. Updating a few
  // CSS custom properties and two text nodes synchronously keeps the needle
  // aligned with the latest heading and avoids depending on rAF scheduling.
  function scheduleQiblaVisual() {
    updateQiblaVisual();
  }

  function qiblaNeedsPermission() {
    return typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function';
  }

  function qiblaOnOrientation(event) {
    let heading = null;
    const webkitHeading = typeof event.webkitCompassHeading === 'number' && isFinite(event.webkitCompassHeading);
    if (webkitHeading) {
      heading = event.webkitCompassHeading;
    } else if (event.type === 'deviceorientationabsolute' || event.absolute === true) {
      if (typeof event.alpha !== 'number' || !isFinite(event.alpha)) return;
      heading = 360 - event.alpha;
    } else {
      // Relative-only events have no fixed north, so they cannot give a Qibla bearing.
      return;
    }
    if (heading == null || !isFinite(heading)) return;

    qiblaSensorSeen = true;
    if (qiblaSensorTimer) { clearTimeout(qiblaSensorTimer); qiblaSensorTimer = null; }
    if (!qiblaLive) {
      qiblaLive = true;
      const enable = $('#qibla-enable');
      if (enable) enable.classList.add('hidden');
      const help = $('#qibla-help');
      if (help) help.textContent = 'If the compass drifts or jumps, move away from metal and wave your phone in a figure 8 to calibrate.';
    }

    const next = qiblaNormalize(heading);
    if (qiblaSmoothed == null) {
      qiblaSmoothed = next;
    } else {
      const delta = qiblaDelta(next, qiblaSmoothed);
      qiblaSmoothed = Math.abs(delta) > 120 ? next : qiblaNormalize(qiblaSmoothed + delta * 0.4);
    }
    scheduleQiblaVisual();
  }

  function attachQiblaSensors() {
    if (qiblaListening) return;
    qiblaListening = true;
    qiblaSensorSeen = false;
    window.addEventListener('deviceorientationabsolute', qiblaOnOrientation, true);
    window.addEventListener('deviceorientation', qiblaOnOrientation, true);
    if (qiblaSensorTimer) clearTimeout(qiblaSensorTimer);
    qiblaSensorTimer = setTimeout(() => {
      qiblaSensorTimer = null;
      if (qiblaSensorSeen || !qiblaSheetOpen) return;
      stopQiblaSensors();
      if (qiblaNeedsPermission() && !qiblaPermissionGranted) {
        const enable = $('#qibla-enable');
        if (enable) enable.classList.remove('hidden');
        setQiblaStatus('Enable the live compass', 'Your browser needs permission to use the compass sensor.');
      } else {
        qiblaSensorUnavailable();
      }
    }, 1600);
  }

  function stopQiblaSensors() {
    window.removeEventListener('deviceorientationabsolute', qiblaOnOrientation, true);
    window.removeEventListener('deviceorientation', qiblaOnOrientation, true);
    qiblaListening = false;
    qiblaSensorSeen = false;
    if (qiblaSensorTimer) { clearTimeout(qiblaSensorTimer); qiblaSensorTimer = null; }
    qiblaLive = false;
    qiblaAligned = false;
    qiblaSmoothed = null;
    const stage = $('#qibla-stage');
    if (stage) stage.classList.remove('is-live', 'is-aligned');
  }

  function qiblaSensorUnavailable() {
    qiblaLive = false;
    qiblaAligned = false;
    qiblaSmoothed = null;
    const stage = $('#qibla-stage');
    if (stage) stage.classList.remove('is-live', 'is-aligned');
    updateQiblaVisual();
    const enable = $('#qibla-enable');
    if (enable) enable.classList.add('hidden');
    const help = $('#qibla-help');
    if (help) help.textContent = 'This device is not reporting a compass heading. Use the bearing above with a physical compass, or open Noor in a browser on your phone.';
    setQiblaStatus('Compass not available', `Qibla is ${Math.round(qiblaBearingValue)}° from true north.`);
  }

  function startQiblaSensors() {
    if (!qiblaSheetOpen) return;
    // Start listening optimistically. If the browser already allows motion
    // access the compass works immediately; otherwise the timer reveals the
    // permission button.
    attachQiblaSensors();
    if (qiblaNeedsPermission() && !qiblaPermissionGranted) {
      const enable = $('#qibla-enable');
      if (enable) enable.classList.remove('hidden');
    }
  }

  async function enableQiblaCompass() {
    const btn = $('#qibla-enable');
    if (qiblaNeedsPermission() && !qiblaPermissionGranted) {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result !== 'granted') {
          if (btn) btn.classList.add('hidden');
          setQiblaStatus('Compass permission declined', 'You can still follow the bearing above with a physical compass.');
          const help = $('#qibla-help');
          if (help) help.textContent = 'Allow motion access in your browser settings to use the live compass.';
          return;
        }
        qiblaPermissionGranted = true;
        try { localStorage.setItem('noor_qibla_compass', '1'); } catch (e) {}
      } catch (e) {
        if (btn) btn.classList.add('hidden');
        setQiblaStatus('Compass not available', `Qibla is ${Math.round(qiblaBearingValue)}° from true north.`);
        return;
      }
    }
    if (btn) { btn.disabled = true; btn.textContent = 'Starting compass…'; }
    setQiblaStatus('Starting compass…', 'Hold your phone flat, away from metal.');
    attachQiblaSensors();
    setTimeout(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Enable live compass'; }
    }, 2000);
  }

  function openQiblaSheet() {
    const coords = prayerCoordinates();
    if (!coords) {
      showToast('Choose a city with coordinates to see the Qibla direction.');
      return;
    }
    qiblaBearingValue = qiblaBearing(coords.lat, coords.lon);
    qiblaSmoothed = null;
    qiblaLive = false;
    qiblaAligned = false;
    const sheet = $('#qibla-sheet');
    if (!sheet) return;
    const loc = $('#qibla-sheet-loc');
    if (loc) loc.textContent = prayerLabel();
    const enable = $('#qibla-enable');
    if (enable) {
      enable.classList.remove('hidden');
      enable.disabled = false;
      enable.textContent = 'Enable live compass';
    }
    const help = $('#qibla-help');
    if (help) help.textContent = 'The gold Kaaba marker points to the Qibla. Turn your phone until it reaches the top.';
    const stage = $('#qibla-stage');
    if (stage) stage.classList.remove('is-live', 'is-aligned');
    setQiblaStatus('Checking compass…', 'Hold your phone flat and away from metal.');
    updateQiblaVisual();
    sheet.classList.remove('hidden');
    qiblaSheetOpen = true;
    updateSheetLock();
    const close = sheet.querySelector('.ayah-sheet-close');
    if (close) close.focus({ preventScroll: true });
    startQiblaSensors();
  }

  function closeQiblaSheet() {
    const sheet = $('#qibla-sheet');
    if (!sheet || sheet.classList.contains('hidden')) return;
    sheet.classList.add('hidden');
    qiblaSheetOpen = false;
    stopQiblaSensors();
    updateSheetLock();
  }

  async function setPrayerReminders(enabled) {
    prayerState.reminders = enabled;
    savePrayerState();
    if (!enabled) { showToast('Prayer reminders are off.'); return; }
    if (!('Notification' in window)) {
      showToast('This browser does not support notifications. In-app reminders will still appear while Noor is open.');
      return;
    }
    if (Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') showToast('Notifications were not allowed. In-app reminders will still appear while Noor is open.');
      } catch (e) {}
    } else if (Notification.permission === 'denied') {
      showToast('Notifications are blocked in your browser settings. In-app reminders will still appear while Noor is open.');
    } else {
      showToast('Prayer reminders are on.');
    }
  }

  function notifyPrayer(name, isTest = false) {
    const title = isTest ? 'Test prayer reminder' : `It’s time for ${name}`;
    const body = isTest ? 'This is how a Noor prayer reminder will look.' : 'Take a moment to pray. May Allah accept it from you.';
    if ('Notification' in window && Notification.permission === 'granted') {
      try { new Notification(title, { body, tag: `noor-prayer-${name}` }); } catch (e) {}
    }
    showToast(`${title} — ${body}`);
  }

  function checkPrayerReminders() {
    if (!prayerState.reminders) return;
    const data = activePrayerCache();
    if (!data) return;
    const now = new Date();
    const hhmm = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    for (const p of PRAYER_ORDER) {
      if (data.timings[p.key] === hhmm) {
        const id = `${todayKey()}-${p.key}-${hhmm}`;
        if (localStorage.getItem('noor_prayer_notified') === id) return;
        try { localStorage.setItem('noor_prayer_notified', id); } catch (e) {}
        notifyPrayer(p.label);
        return;
      }
    }
  }

  const PRAYER_HOME_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><path d="M5 20v-6.2c0-2.6 3-4.3 7-7.3 4 3 7 4.7 7 7.3V20"/><path d="M9 20v-4.2a3 3 0 0 1 6 0V20"/><path d="M12 3.2v2"/></svg>';

  function updateHomePrayer() {
    const card = $('#home-next-prayer');
    if (!card) return;
    if (!hasPrayerLocation()) {
      card.innerHTML = `<span class="prayer-home-icon">${PRAYER_HOME_ICON}</span><span class="prayer-home-main"><strong>Set up prayer times</strong><small>Tap to add your city</small></span><span class="prayer-home-arrow">→</span>`;
      return;
    }
    const data = activePrayerCache();
    const next = data ? getNextPrayer(data.timings) : null;
    if (!next) {
      card.innerHTML = `<span class="prayer-home-icon">${PRAYER_HOME_ICON}</span><span class="prayer-home-main"><strong>${escapeHtml(prayerLabel())}</strong><small>Tap to load today’s prayer times</small></span><span class="prayer-home-arrow">→</span>`;
      return;
    }
    card.innerHTML = `<span class="prayer-home-icon">${PRAYER_HOME_ICON}</span><span class="prayer-home-main"><strong>${escapeHtml(next.label)} ${escapeHtml(next.time)}</strong><small>${escapeHtml(next.countdown)}${next.tomorrow ? ' (tomorrow)' : ''} • ${escapeHtml(prayerLabel())}</small></span><span class="prayer-home-arrow">→</span>`;
  }

  function updatePrayerCountdown() {
    if (state.view !== 'prayer') return;
    const data = activePrayerCache();
    const next = data ? getNextPrayer(data.timings) : null;
    if (!next) return;
    if (`${next.key}|${next.time}` !== prayerLastNext) { renderPrayerData(data); return; }
    const cd = $('#prayer-countdown');
    if (cd) cd.textContent = next.countdown + (next.tomorrow ? ' (tomorrow)' : '');
  }

  function startPrayerClock() {
    if (prayerTimer) clearInterval(prayerTimer);
    prayerTimer = setInterval(() => {
      updateHomePrayer();
      updatePrayerCountdown();
      checkPrayerReminders();
    }, 30000);
    updateHomePrayer();
  }

  function renderPrompts() {
    const base = state.language === 'dv'
      ? [tr('whatCanDo'), tr('prompt_lonely'), tr('prompt_financial'), tr('prompt_grief'), tr('prompt_future'), tr('prompt_forgive'), tr('prompt_giveup'), tr('prompt_patience')]
      : [tr('whatCanDo', 'What can you do?'), ...PROMPTS];
    $('#prompt-chips').innerHTML = base.map(p => `<button type="button" class="chip" data-prompt="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('');
    $$('#prompt-chips .chip').forEach(btn => btn.addEventListener('click', () => {
      $('#chat-input').value = btn.dataset.prompt;
      submitChat(btn.dataset.prompt);
    }));
  }

  function analyzeMessage(text) {
    const t = text.toLowerCase();
    // Whole-word matching with common English suffixes, so short keywords such
    // as "sin" no longer match inside words like "blessing" or "sincere".
    const wordPatterns = new Map();
    function matchesWord(haystack, word) {
      let re = wordPatterns.get(word);
      if (!re) {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        re = new RegExp('\\b' + escaped + '(?:s|es|ed|ing|ly|ness|ful)?\\b');
        wordPatterns.set(word, re);
      }
      return re.test(haystack);
    }
    const scores = { hope:0, hardship:0, sadness:0, anxiety:0, future:0, financial:0, grief:0, loneliness:0, family:0, betrayal:0, unfair:0, forgiveness:0, guilt:0, mistakes:0, repentance:0, patience:0, overwhelmed:0, trapped:0, fear:0, giving:0, illness:0, loss:0, regret:0, despair:0, knowledge:0, guidance:0, gratitude:0, faith:0, protection:0, parents:0, children:0, hereafter:0, justice:0, confidence:0, waswas:0, prayer:0, daily:0, travel:0 };
    const map = [
      ['hope', ['hope','hopeless','give up','no point']],
      ['hardship', ['difficult','hardship','struggle','hard time','problem']],
      ['sadness', ['sad','depressed','down','cry','unhappy']],
      ['anxiety', ['anxious','anxiety','worry','worried','stress','stressed','calm','calming','peace','peaceful','uneasy']],
      ['future', ['future','what will happen','tomorrow']],
      ['financial', ['money','financial','debt','job','income','bills','poor']],
      ['grief', ['lost someone','death','died','grief','bereave','passed away','miss them']],
      ['loneliness', ['lonely','alone','nobody understands','isolated']],
      ['family', ['family','parents','mother','father','sibling','brother','sister','husband','wife','children']],
      ['betrayal', ['betrayed','betrayal','cheated','backstab']],
      ['unfair', ['unfair','injustice','wronged','treated badly']],
      ['forgiveness', ['forgive','forgiveness','mercy']],
      ['guilt', ['guilty','shame','ashamed']],
      ['mistakes', ['mistake','mistakes','sinned','sin','wrong']],
      ['repentance', ['repent','tawbah','forgive me']],
      ['patience', ['patience','patient','sabr','wait']],
      ['overwhelmed', ['overwhelmed','too much','can\'t cope','cannot cope','burden']],
      ['trapped', ['trapped','stuck','no way out']],
      ['fear', ['afraid','fear','scared']],
      ['giving up', ['giving up','give up','quit']],
      ['illness', ['ill','sick','disease','pain','health']],
      ['loss', ['loss','lost','lose']],
      ['regret', ['regret','wish i hadn\'t']],
      ['despair', ['despair','desperate']],
      ['knowledge', ['knowledge','learn','learning','study','studying','exam','exams','revision','school','college','university','memorise','memorize','memorising','memorizing','understanding','focus','concentration']],
      ['guidance', ['guidance','guide','guided','decision','decide','choice','choices','confused','direction','purpose','lost my way']],
      ['gratitude', ['grateful','gratitude','thankful','thank allah','alhamdulillah','blessed','blessing','blessings']],
      ['faith', ['faith','iman','belief','believe','trust in allah','tawakkul','doubt','doubts','certainty']],
      ['protection', ['protect','protection','safety','safe','harm','danger','evil eye','envy','jealousy','jealous','black magic','sihr','harmed']],
      ['parents', ['parents','parent','mother','father','mum','mom','dad','abbu','ummi']],
      ['children', ['child','children','son','daughter','kids','pregnant','pregnancy','baby']],
      ['hereafter', ['hereafter','akhirah','paradise','jannah','hellfire','judgement day','day of judgment','day of judgement']],
      ['justice', ['justice','injustice','oppression','oppressed','unfair','wronged']],
      ['confidence', ['confidence','confident','courage','nervous','public speaking','presentation','interview','speak up','anxious to speak']],
      ['waswas', ['waswas','whisper','whispers','whispering','shaytan','satan','evil thoughts','waswasa']],
      ['prayer', ['prayer','salah','salat','namaz','pray','worship','mosque','masjid','sujood','sujud']],
      ['travel', ['travel','travelling','traveling','journey','flight','trip','moving abroad','migrate']],
      ['daily', ['daily','every day','routine','morning','evening','sleep','food','eat']]
    ];
    map.forEach(([k, words]) => words.forEach(w => { if (matchesWord(t, w)) scores[k] = (scores[k] || 0) + 1; }));
    // Dua tags are broader than the situations users describe, so let a specific
    // situation also lift its related tag (e.g. exams -> guidance duas).
    if (scores.knowledge) scores.guidance += scores.knowledge;
    if (scores.waswas) scores.protection += scores.waswas;
    if (scores.confidence) scores.faith += scores.confidence;
    if (scores.parents) scores.family += scores.parents;
    if (scores.children) scores.family += scores.children;
    if (scores.hereafter) scores.death += scores.hereafter;
    if (scores.justice) scores.unfair += scores.justice;
    // direct keyword boosts
    if (t.includes('lonely')) scores.loneliness += 2;
    if (t.includes('financial') || t.includes('money')) scores.financial += 2;
    if (t.includes('forgive')) { scores.forgiveness += 2; scores.repentance += 1; scores.mistakes += 1; }
    if (t.includes('afraid') || t.includes('future')) scores.fear += 1, scores.future += 1;
    if (t.includes('family')) scores.family += 2;
    if (t.includes('giving up')) scores.hope += 2, scores.sadness += 1;
    if (t.includes('patience')) scores.patience += 2;
    if (t.includes('lost someone') || t.includes('died')) scores.grief += 2;
    return scores;
  }

  function rankByThemes(items, scores, key='themes') {
    return items.map(item => {
      let score = 0;
      (item[key] || []).forEach(theme => { score += (scores[theme] || 0) * 2; });
      // partials
      Object.entries(scores).forEach(([k,v]) => { if (v && (item[key] || []).some(th => th.includes(k) || k.includes(th))) score += v; });
      return { item, score };
    }).sort((a,b) => b.score - a.score || (a.item[key] || []).length - (b.item[key] || []).length);
  }

  // ---------- AI Companion: intent routing and response building ----------
  // The companion is deliberately transparent: it ranks the verified content
  // bundled with the app and can search the full Qur'an translation. It does
  // not invent verses, tafsir, hadith, or rulings.

  const CHAT_STOPWORDS = new Set(('a about above after again against all am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves feel feeling feels felt think thought know need want really im i\'m ive i\'ve dont don\'t cant can\'t please help struggling struggle life today').split(/\s+/));

  const CRISIS_PATTERNS = [
    'suicide', 'suicidal', 'kill myself', 'killing myself', 'end my life', 'ending my life',
    'end it all', 'take my own life', 'take my life', 'want to die', 'wanna die', 'wish i was dead',
    'wish i were dead', 'better off dead', 'self harm', 'self-harm', 'hurt myself', 'hurting myself',
    'cut myself', 'overdose', 'no reason to live', 'nothing to live for', 'dont want to live',
    "don't want to live", 'do not want to live', "can't go on", 'cant go on', "can't keep going",
    'not worth living', 'planning to kill myself'
  ];

  const ABUSE_PATTERNS = [
    'hitting me', 'hits me', 'hit me', 'beats me', 'abusing me', 'abused me', 'domestic violence',
    'sexual assault', 'raped me', 'rape me', 'unsafe at home', 'afraid of my husband', 'afraid of my wife',
    'afraid of my father', 'afraid of my mother', 'threatened to kill me'
  ];

  const GREETING_PATTERNS = ['salam', 'salaam', 'assalamu alaikum', 'assalamualaikum', 'as-salamu alaykum', 'hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'];
  const THANKS_PATTERNS = ['thank you', 'thanks', 'thank u', 'jazak allah', 'jazakallah', 'shukran', 'barakallahu feek', 'appreciate it'];
  const META_PATTERNS = ['who are you', 'what are you', 'what can you do', 'how do you work', 'are you real', 'are you a human', 'are you an ai', 'are you a bot', 'what is this app', 'how can you help'];
  const RULING_PATTERNS = ['is it haram', 'is it halal', 'is this haram', 'is this halal', 'halal or haram', 'haram or halal', 'is it permissible', 'is it allowed', 'is this allowed', 'am i allowed', 'can i eat', 'can i drink', 'can i marry', 'is it a sin', 'is it sinful', 'fatwa', 'what is the ruling', 'ruling on', 'is music haram', 'is smoking haram', 'is dating haram', 'is interest haram', 'is riba haram'];
  const HADITH_PATTERNS = ['hadith', 'hadeeth', 'sunnah of the prophet', 'prophetic tradition', 'what did the prophet say', 'what did prophet muhammad say', 'narration', 'sahih bukhari', 'sahih muslim', 'riwayah'];
  const PRAYER_PATTERNS = ['prayer time', 'prayer times', 'salah time', 'salah times', 'salat time', 'namaz time', 'next prayer', 'time for prayer', 'prayer schedule', 'when is fajr', 'when is dhuhr', 'when is asr', 'when is maghrib', 'when is isha', 'what time is fajr', 'what time is dhuhr', 'what time is asr', 'what time is maghrib', 'what time is isha', 'prayer countdown'];
  const QIBLA_PATTERNS = ['qibla', 'qiblah', 'kaaba direction', 'direction of the kaaba', 'which way is the kaaba', 'direction of prayer', 'face the kaaba'];
  const DUA_PATTERNS = ["du'a for", 'dua for', "du'a to", 'dua to', 'supplication for', 'supplication to', 'what should i say', 'what do i say', 'prayer to say', 'give me a dua', "give me a du'a", 'a dua for', "a du'a for", 'make dua for', 'dua about', "du'a about", 'need a dua', 'want a dua', 'any dua', "need a du'a", "want a du'a"];
  const STORY_PATTERNS = ['tell me a story', 'tell me the story', 'story of', 'stories of', 'about prophet', 'prophet musa', 'prophet yusuf', 'prophet ayyub', 'prophet yunus', 'prophet ibrahim', 'prophet nuh', 'prophet adam'];

  let lastGuidance = { verses: [], stories: [], duas: [] };
  let chatBusy = false;
  let lastChatContext = null;
  let regenExcludeVerseId = null;
  let regenExcludeGlobal = null;
  const quranSearchCache = new Map();

  function normalizeChatText(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function phraseHit(text, phrase) {
    const escaped = String(phrase).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('(^|[^a-z0-9])' + escaped + '($|[^a-z0-9])', 'i').test(text);
  }

  function hasAnyPhrase(text, list) {
    return list.some(p => phraseHit(text, p));
  }

  function detectCrisis(text) {
    const t = normalizeChatText(text);
    return hasAnyPhrase(t, CRISIS_PATTERNS);
  }

  function detectAbuse(text) {
    const t = normalizeChatText(text);
    return hasAnyPhrase(t, ABUSE_PATTERNS);
  }

  function hasEmotionalSignal(text) {
    return /\b(sad|sadness|lonely|alone|anxious|anxiety|depress\w*|scared|afraid|angry|hurt|grief|grieving|stress\w*|worried|worry|struggl\w*|pain|die|dying|suicid\w*|overwhelmed|hopeless)\b/i.test(text);
  }

  function isGreeting(text) {
    const words = text.split(/\s+/).filter(Boolean);
    return words.length <= 6 && !hasEmotionalSignal(text) && hasAnyPhrase(text, GREETING_PATTERNS);
  }

  function isThanks(text) {
    return text.split(/\s+/).filter(Boolean).length <= 8 && !hasEmotionalSignal(text) && hasAnyPhrase(text, THANKS_PATTERNS);
  }

  function isMetaQuestion(text) {
    return hasAnyPhrase(text, META_PATTERNS);
  }

  function isRulingQuestion(text) {
    return hasAnyPhrase(text, RULING_PATTERNS);
  }

  function isHadithQuestion(text) {
    return hasAnyPhrase(text, HADITH_PATTERNS);
  }

  function isPrayerQuestion(text) {
    return hasAnyPhrase(text, PRAYER_PATTERNS);
  }

  function isQiblaQuestion(text) {
    return hasAnyPhrase(text, QIBLA_PATTERNS);
  }

  function isDuaRequest(text) {
    return hasAnyPhrase(text, DUA_PATTERNS);
  }

  function isStoryRequest(text) {
    if (hasAnyPhrase(text, STORY_PATTERNS)) return true;
    return /\b(ayyub|yusuf|musa|yunus)\b/i.test(text) && /\b(story|prophet|patience|distress)\b/i.test(text);
  }

  function isFollowup(text) {
    if (!lastChatContext) return false;
    const bare = text.trim();
    if (['yes', 'ok', 'okay', 'please', 'more', 'another', 'next', 'continue', 'go on', 'really'].includes(bare)) return true;
    if (text.split(/\s+/).filter(Boolean).length > 9) return false;
    return hasAnyPhrase(text, [
      'more', 'another', 'next', 'continue', 'go on', 'explain', 'why', 'how so',
      'what else', 'tell me more', 'another verse', 'another story', 'another dua',
      'show me another', 'one more', 'open it', 'open that', 'show in quran',
      'open in quran', 'open the quran', 'open the surah',
      'what can i do', 'what should i do', 'practical'
    ]);
  }

  function parseVerseReference(text) {
    const colon = text.match(/\b(\d{1,3})\s*[:.]\s*(\d{1,3})\b/);
    if (colon) {
      const surah = Number(colon[1]);
      const ayah = Number(colon[2]);
      if (surah >= 1 && surah <= 114 && ayah >= 1) return { surah, ayah };
    }
    const numbered = text.match(/\bsurah\s+(\d{1,3})(?:\s*(?:,|:|-|ayah|verse|ayat)\s*(\d{1,3}))?/i);
    if (numbered) {
      const surah = Number(numbered[1]);
      if (surah >= 1 && surah <= 114) return { surah, ayah: numbered[2] ? Number(numbered[2]) : null };
    }
    return null;
  }

  function extractKeywords(text) {
    const cleaned = normalizeChatText(text)
      .replace(/\b\d{1,3}\s*[:.]\s*\d{1,3}\b/g, ' ')
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .replace(/\s+/g, ' ');
    const words = cleaned.split(' ').filter(w => w.length >= 3 && !CHAT_STOPWORDS.has(w));
    const stems = words.map(w => w.replace(/(ing|edly|ed|ly|ness|ful|less|es|s)$/i, '')).filter(w => w.length >= 3);
    return Array.from(new Set(stems)).slice(0, 6);
  }

  async function searchQuran(keywords, options = {}) {
    const words = (keywords || []).filter(Boolean).slice(0, 6);
    if (!words.length) return [];
    const cacheKey = words.join('|');
    let all = quranSearchCache.get(cacheKey);
    if (!all) {
      const quran = await loadQuranText();
      // Match whole words and their extensions ("hope" -> "hopeful") so a
      // short stem cannot match inside an unrelated word ("lone" in "alone").
      const matchers = words.map(w => {
        const escaped = String(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp('\\b' + escaped + '\\w*', 'i');
      });
      const found = [];
      quran.forEach(surah => {
        surah.ayahs.forEach(a => {
          const en = a.english.toLowerCase();
          let hits = 0;
          matchers.forEach(re => { if (re.test(en)) hits++; });
          if (!hits) return;
          const wordCount = en.split(/\s+/).length;
          found.push({ surah, ayah: a, hits, score: hits * 10 + (hits / Math.max(8, wordCount)) });
        });
      });
      found.sort((x, y) => y.score - x.score || x.ayah.english.length - y.ayah.english.length);
      all = found;
      quranSearchCache.set(cacheKey, all);
    }
    const exclude = new Set(options.exclude || []);
    return all.filter(r => !exclude.has(r.ayah.global)).slice(0, options.limit || 5);
  }

  async function safeQuranSearch(keywords, limit = 5, exclude = []) {
    try {
      return await searchQuran(keywords, { limit, exclude });
    } catch (e) {
      console.warn('Noor: Qur\u2019an search unavailable', e);
      return [];
    }
  }

  function verseFromSearch(result) {
    const s = result.surah;
    const a = result.ayah;
    return {
      id: `${s.number}:${a.n}`,
      surah: s.englishName,
      surahNumber: s.number,
      ayah: String(a.n),
      arabic: a.arabic,
      translation: a.english,
      themes: [],
      meaning: '',
      reflection: '',
      source: `Qur\u2019an ${s.number}:${a.n} \u00b7 Saheeh International`,
      global: a.global,
      searched: true
    };
  }

  async function findAyah(surahNumber, ayahNumber) {
    try {
      const quran = await loadQuranText();
      const surah = quran.find(s => s.number === surahNumber);
      const ayah = surah && surah.ayahs.find(a => a.n === ayahNumber);
      return surah && ayah ? verseFromSearch({ surah, ayah }) : null;
    } catch (e) {
      return null;
    }
  }

  async function verseById(id) {
    const curated = VERSES.find(v => v.id === id);
    if (curated) return curated;
    const m = String(id || '').match(/^(\d{1,3}):(\d{1,3})/);
    if (m) return await findAyah(Number(m[1]), Number(m[2]));
    return null;
  }

  function nextCuratedVerse(currentId) {
    const idx = VERSES.findIndex(v => v.id === currentId);
    return VERSES[(idx + 1) % VERSES.length];
  }

  function attrText(str = '') {
    return escapeHtml(String(str)).replace(/\n/g, '&#10;');
  }

  function formatChatTime(ts) {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  }

  function chatNavButton(view, label) {
    return `<button type="button" class="btn secondary chat-nav-btn" data-chat-nav="${view}">${escapeHtml(label)}</button>`;
  }

  function chatVerseHtml(v, options = {}) {
    const label = options.label || tr('verseLabel');
    const surahWord = state.language === 'dv' ? 'ސޫރަތް' : 'Surah';
    const ref = `${surahWord} ${escapeHtml(v.surah)} (${v.surahNumber}:${escapeHtml(String(v.ayah))})`;
    const copy = `${v.arabic}\n\n${v.translation}\n\n${v.source}`;
    return `
      <div class="chat-verse">
        <div class="chat-verse-head">
          <span class="chat-label">${escapeHtml(label)}</span>
          <span class="meta">${ref}</span>
        </div>
        <div class="arabic chat-arabic">${v.arabic}</div>
        <p class="chat-translation">${escapeHtml(v.translation)}</p>
        ${options.showMeaning && v.meaning ? `<p class="muted chat-meaning"><strong>${escapeHtml(tr('meaningLabel', 'Meaning'))}:</strong> ${escapeHtml(v.meaning)}</p>` : ''}
        ${options.showMeaning && v.reflection ? `<p class="muted chat-meaning"><strong>${escapeHtml(tr('reflectionLabel', 'Reflection'))}:</strong> ${escapeHtml(v.reflection)}</p>` : ''}
        <p class="chat-source">${escapeHtml(v.source)}</p>
        <div class="chat-item-actions">
          <button type="button" class="msg-action" data-open-surah="${v.surahNumber}" data-open-ayah="${escapeHtml(String(v.ayah))}">${escapeHtml(tr('openQuran'))}</button>
          <button type="button" class="msg-action" data-copy="${attrText(copy)}">${escapeHtml(tr('copy'))}</button>
          ${v.searched ? '' : saveButton('verses', v.id)}
        </div>
      </div>`;
  }

  function chatDuaHtml(d) {
    if (!d) return '';
    const meaning = (state.language === 'dv' && d.meaning_dv) ? d.meaning_dv : d.meaning_en;
    const copy = `${d.arabic}${d.transliteration ? '\n' + d.transliteration : ''}\n${meaning}\n${d.source}`;
    const label = d.origin === 'hisn' ? tr('duaHisnLabel') : tr('duaQuranLabel');
    return `
      <div class="chat-dua">
        <div class="chat-verse-head">
          <span class="chat-label">${escapeHtml(label)}</span>
          <span class="meta">${escapeHtml(d.title)}</span>
        </div>
        <div class="arabic chat-arabic">${d.arabic}</div>
        ${d.transliteration ? `<p class="chat-translit">${escapeHtml(d.transliteration)}</p>` : ''}
        <p class="chat-translation">${escapeHtml(meaning || '')}</p>
        <p class="chat-source">${d.source_url ? `<a class="source-link" href="${escapeHtml(d.source_url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(d.source)} \u2197</a>` : escapeHtml(d.source)}</p>
        <div class="chat-item-actions">
          <button type="button" class="msg-action" data-copy="${attrText(copy)}">${escapeHtml(tr('copy'))}</button>
          <button type="button" class="msg-action" data-chat-nav="duas">${escapeHtml(tr('moreDuas'))}</button>
          ${saveButton('duas', d.id)}
        </div>
      </div>`;
  }

  function chatStoryHtml(story, open = false) {
    if (!story) return '';
    const refs = (story.references || []).map(ref => {
      const m = String(ref).match(/(\d{1,3})\s*:\s*(\d{1,3})/);
      if (!m) return `<li>${escapeHtml(ref)}</li>`;
      return `<li><a class="source-link" href="https://quran.com/${Number(m[1])}/${Number(m[2])}" target="_blank" rel="noopener noreferrer">${escapeHtml(ref)} \u2197</a></li>`;
    }).join('');
    return `
      <details class="chat-story" ${open ? 'open' : ''}>
        <summary>
          <span class="chat-label">${escapeHtml(tr('relatedStory'))}</span>
          <span class="chat-story-title">${escapeHtml(story.title)}</span>
        </summary>
        <div class="chat-story-body">
          <p><strong>${escapeHtml(tr('storyBackground'))}:</strong> ${escapeHtml(story.background)}</p>
          <p><strong>${escapeHtml(tr('storyWhat'))}:</strong> ${escapeHtml(story.whatHappened)}</p>
          <p><strong>${escapeHtml(tr('storyGuidance'))}:</strong> ${escapeHtml(story.guidanceFromAllah)}</p>
          <p><strong>${escapeHtml(tr('storyRefs'))}:</strong></p>
          <ul class="chat-story-refs">${refs}</ul>
          <div class="chat-item-actions">${saveButton('stories', story.id)}</div>
        </div>
      </details>`;
  }

  function chatStepsHtml(steps, title = null) {
    if (!steps || !steps.length) return '';
    const t = title || tr('practicalSteps');
    return `
      <div class="msg-section">
        <h4>${escapeHtml(t)}</h4>
        <ol class="chat-steps">${steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      </div>`;
  }

  function chatFollowupsHtml(items) {
    if (!items || !items.length) return '';
    return `<div class="chat-followups" role="group" aria-label="Suggested replies">${items.map(p => `<button type="button" class="chat-followup" data-followup="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('')}</div>`;
  }

  function chatExtraHtml(resp) {
    if (!resp.extraHtml) return '';
    return `
      <div class="msg-section chat-extra">
        ${resp.extraTitle ? `<h4>${escapeHtml(resp.extraTitle)}</h4>` : ''}
        ${resp.extraHtml}
      </div>`;
  }

  function shortComfort(scores) {
    if (state.language === 'dv') {
      if ((scores.grief || 0) > 0) return 'ﷲ މި ގެއްލުމުގައި ތިބާއަށް ހިތްހަމަޖެހުން ދެއްވާ، ބުރަކަން ފަސޭހަ ކުރައްވާ، އަދި ކެތްތެރި އެހީތެރި މީހުން ކައިރީގައި ލައްވާށި.';
      if ((scores.anxiety || 0) > 0 || (scores.fear || 0) > 0) return 'ﷲ ފިކުރުބުރަކަމުގެ ބަދަލުގައި ހިތްހަމަޖެހުން ދެއްވާ، މިއަދަށް ސާފު ވިސްނުން ދެއްވާ، އަދި އެކަލާނގެއަށް ތަވައްކުލު ކުރުމުގެ ބާރު ދެއްވާށި.';
      if ((scores.forgiveness || 0) > 0 || (scores.guilt || 0) > 0) return 'ﷲ ތިބާގެ ތައުބާ ޤަބޫލު ކުރައްވާ، ބުރަކަން ފުއްސަވާ، އަދި އުންމީދާއެކު ކުރިއަށް ދިއުމަށް އެހީތެރި ކުރައްވާށި.';
      if ((scores.financial || 0) > 0) return 'ﷲ ތިބާ ނުވިސްނޭ ގޮތަކުން ރިޒްޤު ދެއްވާ، ބުރަކަން ފަސޭހަ ކުރައްވާ، އަދި ހަލާލު ހަމަޖެހޭ ފިޔަވަޅަކަށް މަގު ދައްކަވާށި.';
      if ((scores.loneliness || 0) > 0) return 'ﷲ ވަކިކަން ދުރު ކުރައްވާ، ތިބާ ދެނެގަންނަ މީހުންނާ ގުޅުވައިދެއްވާ، އަދި އެކަލާނގެ ކައިރީގައި ވާ ކަން ހަނދާން ކޮށްދެއްވާށި.';
      return 'ﷲ ތިބާގެ ހިތަށް ފަސޭހަކަން ދެއްވާ، މަގަށް ސާފުކަން ދެއްވާ، އަދި ފިޔަވަޅުތަކަށް ބާރު ދެއްވާށި.';
    }
    if ((scores.grief || 0) > 0) return 'May Allah comfort you in this loss, lighten the heaviness, and place patient, caring people around you.';
    if ((scores.anxiety || 0) > 0 || (scores.fear || 0) > 0) return 'May Allah replace worry with calm, give you clarity for today, and strengthen your trust in Him.';
    if ((scores.forgiveness || 0) > 0 || (scores.guilt || 0) > 0) return 'May Allah accept your repentance, wash away the heaviness, and help you move forward with hope.';
    if ((scores.financial || 0) > 0) return 'May Allah provide from where you do not expect, ease your burden, and guide you to steady, lawful steps.';
    if ((scores.loneliness || 0) > 0) return 'May Allah remove the loneliness, connect you with people who understand, and remind you that He is near.';
    return 'May Allah bring ease to your heart, clarity to your path, and strength to your steps.';
  }

  function comfortDua(scores) {
    if ((scores.forgiveness || 0) > 0 || (scores.guilt || 0) > 0 || (scores.mistakes || 0) > 0) {
      return DUAS.find(d => d.id === 'dua-yunus') || null;
    }
    if ((scores.fear || 0) > 0 || (scores.anxiety || 0) > 0 || (scores.future || 0) > 0 || (scores.loneliness || 0) > 0) {
      return DUAS.find(d => d.id === 'dua-trust') || null;
    }
    if ((scores.overwhelmed || 0) > 0 || (scores.hardship || 0) > 0 || (scores.grief || 0) > 0) {
      return DUAS.find(d => d.id === 'dua-burden') || null;
    }
    return DUAS.find(d => d.id === 'dua-guidance') || DUAS[0] || null;
  }

  function guidanceFollowups(scores, story) {
    if (state.language === 'dv') {
      const out = ['އިތުރު އާޔަތެއް ދައްކާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ'];
      if (story) out.push(`${story.prophets[0]} ގެ ވާހަކަ ކިޔާލައްވާ`);
      else out.push('މިއަދު އަހަރެން ކުރެވޭނެ ކަމަކީ ކޮބާ؟');
      if ((scores.prayer || 0) > 0) out.push('މިއަދުގެ ނަމާދު ގަޑިތައް ކޮބާ؟');
      return out.slice(0, 4);
    }
    const out = ['Show me another verse', "Give me a du\u2019a for this"];
    if (story) out.push(`Tell me the story of ${story.prophets[0]}`);
    else out.push('What can I do today?');
    if ((scores.prayer || 0) > 0) out.push('What are today\u2019s prayer times?');
    return out.slice(0, 4);
  }

  function buildAcknowledgement(scores) {
    if (state.language === 'dv') {
      if ((scores.grief || 0) > 0) return 'ތިބާ މި ވޭންދެނިވާ ހިތާމައާއި ބުރަކަމަށް އަހަރެން ވަރަށް ހިތާމަ ކުރަން. ގެއްލުމަކީ ވަރަށް އުނދަގޫ ކަމެއް، އަދި އެހީ ބޭނުންވުން އެއީ އާދައިގެ ކަމެކެވެ.';
      if ((scores.loneliness || 0) > 0) return 'ވަކިކަން އިހުސާސް ކުރެއްވޭތީ އަހަރެން ހިތާމަ ކުރަން. ނޭނގޭ ކަމަށް އިހުސާސް ކުރުން ހިތަށް ވަރަށް ބުރަކަމެއް ގެންދެއެވެ.';
      if ((scores.financial || 0) > 0) return 'މާލީ ދަތިތަކުގެ ތެރޭގައި ތިބެވޭތީ އަހަރެން ހިތާމަ ކުރަން. ރިޒްޤާއި ސަލާމަތާ ބެހޭ ފިކުރު ވަރަށް ބުރަ ކުރުވާނެ.';
      if ((scores.protection || 0) > 0 || (scores.waswas || 0) > 0) return 'ރައްކާތެރިކަމާއި ހިތްހަމަޖެހުން ހޯދަން އުޅުއްވާ ކަން އަހަރެން ދެނެން. ﷲ ގެ ރައްކާތަށް ދެނިލައްވާ، އަދި ޙިކުމަތްތެރި ފިޔަވަޅުތައް ނަގައިގަތުން އެއީ ތަވާޒުން ދެމެހެއްޓޭ ގޮތެކެވެ.';
      if ((scores.fear || 0) > 0 || (scores.future || 0) > 0) return 'ކުރިއަށް އޮތް ކަންތަކާ ބެހޭ ފިކުރު އަހަރެން ދެނެން. ނޭނގޭ ކަންތައް ހިތަށް ބުރަ ކުރުވައިދާނެ، ނަމަވެސް އެހީ ނެތި ކުރިމަތި ވާން ނުޖެހޭނެ.';
      if ((scores.forgiveness || 0) > 0 || (scores.mistakes || 0) > 0 || (scores.guilt || 0) > 0) return 'އިޚްލާޞްތެރިކަމާއެކު މިކަން ހިއްސާ ކުރެއްވިތީ ޝުކުރިއްޔާ. ﷲ ގެ ފާފަފުއްސެވުމަށް އެދުން އަދި އެކަލާނގެ އަރިހަށް އެނބުރި ދިއުމަކީ އުންމީދުދޭ ފިޔަވަޅެކެވެ.';
      if ((scores.parents || 0) > 0 || (scores.children || 0) > 0) return 'މިކަން ހިއްސާ ކުރެއްވިތީ ޝުކުރިއްޔާ. އާއިލާއަށް ދުޢާ ކުރުމަކީ ރިއްޔަތުން ކުރެވޭ އަމަލެކެވެ، އަދި ޤުރުއާނުގައި އެދުމުގެ ބަސްތައް ވެސް އެބައޮތެވެ.';
      if ((scores.family || 0) > 0 || (scores.betrayal || 0) > 0) return 'ގުޅުންތަކުގައި މި ވޭންދެނިވާ ކަމަށް އަހަރެން ހިތާމަ ކުރަން. އާއިލީ މައްސަލަތަކާއި ޚިޔާނަތް ވަރަށް ހިތަށް އަނިޔާ ކުރުވާނެ.';
      if ((scores.patience || 0) > 0 || (scores.hardship || 0) > 0) return 'މިކަން އުނދަގޫ ވެފައިވާ ކަން އަހަރެން ދެނެން. އުނދަގޫ ވަގުތުތަކުން ހިތް އިމްތިޙާނަށް ލެވިދާނެ، އަދި ﷲ ގެ ކައިރީން ބާރު ހޯދުމަކީ ރީތި ކަމެކެވެ.';
      if ((scores.knowledge || 0) > 0) return 'އިލްމާއި ފޯކަސް ހޯދަން އުޅުއްވުން ރަނގަޅު ކަމެކެވެ. ﷲ އަށް ފަހުމް އިތުރު ކުރައްވާށި އެދުމާއެކު، މަސައްކަތާއި އަރާމު ދިނުން ވެސް ބޭނުންތެރިއެވެ.';
      if ((scores.guidance || 0) > 0) return 'މިކަން ހިއްސާ ކުރެއްވިތީ ޝުކުރިއްޔާ. ސާފު ހިދާޔަތް ހޯދުމަކީ ބާރުހުރި ފިޔަވަޅެކެވެ، އަދި ﷲ ގެ އަރިހަށް މަގު އެދުން އެކަލާނގެ ދަޢުވަތެކެވެ.';
      if ((scores.confidence || 0) > 0) return 'މިކަމާ ގުޅިގެން ނުރައްކާތެރިކަން އިހުސާސް ކުރުން އާދައިގެ ކަމެކެވެ. ﷲ އަށް ޔަޤީންކަމާއި ފަސޭހަކަމާއި ސާފު ބަސް ދެއްވުމަށް އެދުން ރީތި ތައްޔާރީއެކެވެ.';
      if ((scores.gratitude || 0) > 0) return 'ޝުކުރު އަދާކުރަން މަޑުކޮށްލުން ރީތި ކަމެކެވެ. ﷲ ގެ ނިޢުމަތްތައް ހަނދާންކޮށް ޝުކުރު ކުރުން އެކަލާނގެ ކައިރިއަށް ގާތްވުމުގެ މަގެކެވެ.';
      return 'ހިތުގައި ހުރި ކަން ހިއްސާ ކުރެއްވިތީ ޝުކުރިއްޔާ. ތިބާ ކުރިމަތިވެފައިވާ ކަމަކީ މުހިންމު ކަމެއް، އަދި ޤުރުއާން މެދުވެރިކޮށް ހިދާޔަތް ހޯދުމަކީ ބާރުހުރި ފިޔަވަޅެކެވެ.';
    }
    if ((scores.grief || 0) > 0) return 'I\u2019m sorry for the pain and heaviness you\u2019re carrying. Grief can be deeply difficult, and it is okay to need support.';
    if ((scores.loneliness || 0) > 0) return 'I\u2019m sorry you\u2019re feeling lonely. Feeling unseen or misunderstood can weigh heavily on the heart.';
    if ((scores.financial || 0) > 0) return 'I\u2019m sorry you\u2019re facing financial strain. Worry about provision and stability can be very stressful.';
    if ((scores.protection || 0) > 0 || (scores.waswas || 0) > 0) return 'I hear that you\u2019re seeking safety and peace of mind. Turning to Allah for protection, alongside sensible precautions, is a balanced response.';
    if ((scores.fear || 0) > 0 || (scores.future || 0) > 0) return 'I hear your concern about what lies ahead. Uncertainty can feel overwhelming, but you do not have to face it without support.';
    if ((scores.forgiveness || 0) > 0 || (scores.mistakes || 0) > 0 || (scores.guilt || 0) > 0) return 'Thank you for sharing this with sincerity. Wanting forgiveness and a way back to Allah is a meaningful and hopeful step.';
    if ((scores.parents || 0) > 0 || (scores.children || 0) > 0) return 'Thank you for sharing this. Making du\u2019a for your family is a beautiful act of care, and the Qur\u2019an gives us words to ask for their wellbeing.';
    if ((scores.family || 0) > 0 || (scores.betrayal || 0) > 0) return 'I\u2019m sorry you\u2019re dealing with this pain in your relationships. Family difficulties and betrayal can be especially hurtful.';
    if ((scores.patience || 0) > 0 || (scores.hardship || 0) > 0) return 'I hear how challenging this is for you. Difficult seasons can test the heart, and seeking strength through Allah is a beautiful response.';
    if ((scores.knowledge || 0) > 0) return 'It is good that you\u2019re seeking knowledge and focus. Asking Allah to increase your understanding is a beautiful habit, alongside steady effort and rest.';
    if ((scores.guidance || 0) > 0) return 'Thank you for sharing this. Seeking clear guidance is a meaningful step, and turning to Allah for direction is exactly what He invites us to do.';
    if ((scores.confidence || 0) > 0) return 'It is understandable to feel nervous about this. Asking Allah for confidence, ease, and clear speech is a beautiful way to prepare.';
    if ((scores.gratitude || 0) > 0) return 'It is beautiful to pause in gratitude. Recognising Allah\u2019s blessings with thanks is a way of drawing closer to Him.';
    return 'Thank you for sharing what is on your heart. Whatever you are facing, it matters, and seeking guidance through the Qur\u2019an is a meaningful step.';
  }

  function buildPracticalGuidance(scores) {
    const tips = [];
    if (state.language === 'dv') {
      tips.push('ހިތުގައި ހުރި ކަން އިޚްލާޞްތެރިކަމާއެކު ﷲ އަށް ދުޢާކޮށް ބުނާ، ފަސޭހަކަމާއި ހިދާޔަތާއި ބާރު އެދޭ.');
      tips.push('ކުރެވޭ މިންވަރަށް ނަމާދު ދަމަހައްޓާ، އަދި ހިތް ހަމަޖެއްސުމަށް ކުޑަ މިނިޓުކޮޅެއް ޛިކުރު ކުރޭ.');
      if ((scores.financial || 0) > 0) tips.push('މިއަދު ކުޑަ ޢަމަލީ ފިޔަވަޅެއް ނަގާ: އިސްކަންތައް އަލުން ބަލާ، ހަލާލު މަގުތައް ހޯދާ، އަދި ޔަޤީންކުރެވޭ މީހަކުން ނުވަތަ މުޖުތަމަޢުގެ ވަސީލަތްތަކުން އެހީ ހޯދާ.');
      if ((scores.family || 0) > 0 || (scores.betrayal || 0) > 0) tips.push('ރައްކާތެރިވާ ހިނދު، ހަމަޖެހި ވާހަކަ، ޙިކުމަތްތެރި މަޝްވަރާ އަދި ޞިއްޙަތު ހުރި ހައްދުތައް ބަހައްޓާ.');
      if ((scores.grief || 0) > 0) tips.push('ހިތާމަ ކުރުމަށް އިޒުނަ ދޭ، އެހީތެރި މީހުންނާ ގާތްވާ، އަދި ފަސޭހަވުމަށް ވަގުތު ނަގާނެ ކަން ހަނދާން ބަހައްޓާ.');
      if ((scores.fear || 0) > 0 || (scores.anxiety || 0) > 0) tips.push('މިއަދު ކުރެވޭނެ ކަމަކަށް ފޯކަސްކޮށް، އެއް ފިޔަވަޅަކުން ކުރިއަށް ދޭ، އަދި ނިންމުންތަކަށް ޔަޤީންކުރެވޭ މަޝްވަރާ ހޯދާ.');
      if ((scores.forgiveness || 0) > 0 || (scores.mistakes || 0) > 0 || (scores.guilt || 0) > 0) tips.push('އިޚްލާޞްތެރި ތައުބާ ކުރޭ، ފާފަ ދޫކޮށްލުމަށް ޢަޒުމް ކުރޭ، އަދި ކުރެވޭނަމަ ގެއްލުން އިޞްލާޙު ކުރޭ.');
      if ((scores.knowledge || 0) > 0) tips.push('ދުޢާއާއެކު ދެމެހެއްޓެނިވި މަސައްކަތް ކުރޭ: ކުރު ދަރުސް ވަގުތުތައް، އަރާމު، އަދި ﷲ އަށް ވަގުތުގައި ބަރަކާތް ދެއްވުމަށް އެދުން.');
      if ((scores.protection || 0) > 0 || (scores.waswas || 0) > 0) tips.push('ހެނދުނު ހަވީރުގެ ޛިކުރުތައް ދަމަހައްޓާ، އަދި ރޫޙާނީ ރައްކާތާއެކު ޢަމަލީ ރައްކާތެރި ފިޔަވަޅުތައް ވެސް ނަގާ.');
      if ((scores.parents || 0) > 0 || (scores.children || 0) > 0) tips.push('އާއިލާއަށް ދުޢާ ކުރުން ދަމަހައްޓާ، އަދި މިއަދު ކުޑަ ރިއްޔަތެއް ދައްކާ.');
      if ((scores.gratitude || 0) > 0) tips.push('ތިން ނިޢުމަތެއް ކަނޑައަޅައި ﷲ އަށް ޝުކުރު ކުރޭ؛ ޝުކުރު ހިތް ލުއިކޮށްދޭނެ.');
      if ((scores.prayer || 0) > 0) tips.push('މަދުވެސް އެއް ނަމާދެއް ވަގުތަށް ރައްކާކުރުމަށް މަސައްކަތް ކުރޭ، އަދި އަމިއްލަ ނަފްސަށް ހަރުކަށި ނުވާށެވެ.');
      return Array.from(new Set(tips)).slice(0, 3);
    }
    tips.push('Turn to Allah in du\u2019a with honesty about what you feel, and ask for ease, guidance, and strength.');
    tips.push('Keep up salah as you are able, and use a few minutes of quiet dhikr to steady your heart.');
    if ((scores.financial || 0) > 0) tips.push('Take one practical step today: review priorities, seek lawful options, and ask a trusted person or community resource for support.');
    if ((scores.family || 0) > 0 || (scores.betrayal || 0) > 0) tips.push('Where it is safe, seek calm communication, wise counsel, and healthy boundaries.');
    if ((scores.grief || 0) > 0) tips.push('Allow yourself to grieve, lean on supportive people, and remember that healing can take time.');
    if ((scores.fear || 0) > 0 || (scores.anxiety || 0) > 0) tips.push('Focus on what you can do today, one step at a time, and seek trusted advice for the decisions ahead.');
    if ((scores.forgiveness || 0) > 0 || (scores.mistakes || 0) > 0 || (scores.guilt || 0) > 0) tips.push('Make sincere tawbah, resolve to avoid the sin, and repair any harm where you can.');
    if ((scores.knowledge || 0) > 0) tips.push('Pair du\u2019a with steady effort: short study sessions, real breaks, and asking Allah to bless your time.');
    if ((scores.protection || 0) > 0 || (scores.waswas || 0) > 0) tips.push('Keep your morning and evening remembrances, and pair spiritual protection with practical safety steps.');
    if ((scores.parents || 0) > 0 || (scores.children || 0) > 0) tips.push('Make du\u2019a for your family regularly and look for one small way to show them care today.');
    if ((scores.gratitude || 0) > 0) tips.push('Name three specific blessings and thank Allah for them; gratitude can soften the heart.');
    if ((scores.prayer || 0) > 0) tips.push('Protect even one prayer at its proper time, and build from there without being harsh on yourself.');
    return Array.from(new Set(tips)).slice(0, 3);
  }

  function crisisResponse() {
    const verse = VERSES.find(v => v.id === '39:53') || VERSES[0];
    const dua = DUAS.find(d => d.id === 'dua-trust') || DUAS.find(d => d.id === 'dua-yunus') || DUAS[0];
    lastGuidance = { verses: [verse], stories: [], duas: dua ? [dua] : [] };
    if (state.language === 'dv') {
      return {
        kind: 'crisis',
        crisis: true,
        intro: 'މިހާރު ތިބާ މިތަން ވޭންދެނީ ކަމަށް އަހަރެން ވަރަށް ހިތާމަ ކުރަން. ތިބާގެ ދިރިއުޅުމަކީ ވަރަށް އަގުހުރި ކަމެއް، އަދި މިހާރުން އެހީ ލިބިގަންނަން ހައްގުވެއެވެ.',
        extraHtml: `
          <div class="chat-crisis-card">
            <p><strong>މި ވިސްނުންތަކުގެ މައްޗަށް ޢަމަލުކުރުމުގެ ފިކުރު އޮތްނަމަ، ހަމައެކަނި މިހާރު ލޯކަލް އެމަޖެންސީ ނަމްބަރަށް ގުޅާ ނުވަތަ އެންމެ ކައިރީގައިވާ އެމަޖެންސީ ޑިޕާޓްމަންޓަށް ދާށެވެ.</strong></p>
            <a class="chat-crisis-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">ތިބާގެ ޤައުމުގައިވާ ހިލޭ ކްރައިސިސް ހެލްޕްލައިން ހޯދާ \u2197</a>
            <p class="muted">ރާއްޖޭގައި ހުރިނަމަ، ލޯކަލް އެމަޖެންސީ ޚިދުމަތާއި ޔަޤީންކުރެވޭ ޞިއްޙީ ފަރާތަކުން ވަގުތުން އެހީ ހޯދާށެވެ.</p>
          </div>`,
        steps: [
          'ކައިރީގައިވާ ޔަޤީންކުރެވޭ މީހަކަށް ތިބާގެ ހާލަތު ބުނެ، އެއާއެކު ހުންނަން އެދުމަށް މަސައްކަތް ކުރޭ.',
          'އަމިއްލަ ނަފްސަށް ގެއްލުން ލިބޭނެ އެއްވެސް އެއްޗެއްގެ ކައިރިން ދުރުވެލައްވާ.',
          'މިހާރު ކްރައިސިސް ހެލްޕްލައިނަކަށް ނުވަތަ އެމަޖެންސީ ޚިދުމަތަށް ގުޅުއްވާ. ހުރިހާ ކަމެއް ފުރިހަމައަށް ބަޔާން ކުރަން ނުޖެހޭނެ.'
        ],
        stepsTitle: 'މިހާރު',
        verse,
        dua,
        comfort: 'ﷲ ތިބާއަށް ރަޙްމަތާއި ރައްކާތެރިކަމާއި އެހީތެރި މީހުން ދެއްވާށި. މިހާރު އެހީތެރިންނާ ގުޅިފައި ހުންނަވާ.',
        followups: ['މިހާރު އަހަރެން ރައްކާތެރި', 'ހިތްހަމަޖެހޭ ދުޢާއެއް ދެއްވާ', 'ސޭފްޓީ ޕްލޭނެއް ހެދުމަށް އެހީދޭ'],
        safety: 'crisis',
        context: { kind: 'crisis', prompt: 'crisis' }
      };
    }
    return {
      kind: 'crisis',
      crisis: true,
      intro: 'I\u2019m really sorry you are in this much pain. Your life has value, and you deserve support right now \u2014 not later.',
      extraHtml: `
        <div class="chat-crisis-card">
          <p><strong>If you might act on these thoughts, contact your local emergency number now or go to the nearest emergency department.</strong></p>
          <a class="chat-crisis-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">Find a free crisis helpline in your country \u2197</a>
          <p class="muted">If you are in the Maldives, contact local emergency services and a trusted health professional for urgent support.</p>
        </div>`,
      steps: [
        'Tell one trusted person nearby how you are feeling and ask them to stay with you.',
        'Put distance between yourself and anything you could use to hurt yourself.',
        'Contact a crisis helpline or emergency service now. You do not have to explain everything perfectly.'
      ],
      stepsTitle: 'Right now',
      verse,
      dua,
      comfort: 'May Allah surround you with mercy, safety, and people who can help. Please stay connected to support right now.',
      followups: ['I am safe right now', 'Give me a du\u2019a for calm', 'Help me make a safety plan'],
      safety: 'crisis',
      context: { kind: 'crisis', prompt: 'crisis' }
    };
  }

  function abuseResponse() {
    const verse = VERSES.find(v => v.id === '2:286') || VERSES[0];
    if (state.language === 'dv') {
      return {
        kind: 'safety',
        crisis: true,
        intro: 'މި ހާލަތުގެ ތެރޭގައި ތިބެވޭތީ އަހަރެން ވަރަށް ހިތާމަ ކުރަން. ތިބާގެ ރައްކާތެރިކަމަކީ އެންމެ މުހިންމު ކަމެއް، އަދި މި ނުރައްކާތަކީ ތިބާގެ ކުށެއް ނޫން.',
        extraHtml: `
          <div class="chat-crisis-card">
            <p><strong>ވަގުތުން ނުރައްކާތެރި ހާލަތެއްގައި ވާނަމަ، ހަމައެކަނި މިހާރު ލޯކަލް އެމަޖެންސީ ނަމްބަރަށް ގުޅުއްވާ.</strong></p>
            <a class="chat-crisis-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">ލޯކަލް އެހީ އަދި ހެލްޕްލައިންތައް ހޯދާ \u2197</a>
          </div>`,
        steps: [
          'މިނިވަން ކުރެވޭނަމަ ރައްކާތެރި ތަނަކަށް ދާށެވެ، އަދި ދިމާވެފައިވާ ކަން ޔަޤީންކުރެވޭ މީހަކަށް ބުނާށެވެ.',
          'ލޯކަލް އެމަޖެންސީ ޚިދުމަތަށް ނުވަތަ ގޭގެ އަނިޔާ ހުއްޓުވުމުގެ ޚިދުމަތަކަށް ގުޅުއްވާ. މިކަން އެކަނި ކުރިމަތި ކުރަން ނުޖެހޭނެ.',
          'ނުރައްކާތެރިކަން އިތުރު ނުވާ ހިނދު، ދަލީލުތަކާއި މުހިންމު ލިޔެކިޔުންތައް ރައްކާތެރި ތަނެއްގައި ބަހައްޓާށެވެ.'
        ],
        stepsTitle: 'ތިބާގެ ރައްކާތެރިކަން އެންމެ ކުރި',
        verse,
        dua: null,
        comfort: 'ﷲ ތިބާ ރައްކާތެރި ކުރައްވާ، ސަލާމަތް ދެއްވާ، އަދި ތިބާ ޤަބޫލުކޮށް އެހީތެރިވާ މީހުންނާ ގުޅުވައިދެއްވާށި.',
        followups: ['މިހާރު އަހަރެން ރައްކާތެރި', 'ރައްކާތެރިކަމަށް ދުޢާއެއް ދެއްވާ', 'އެހީ ހޯދުމަށް އެހީދޭ'],
        safety: 'crisis',
        context: { kind: 'safety', prompt: 'safety' }
      };
    }
    return {
      kind: 'safety',
      crisis: true,
      intro: 'I\u2019m sorry you are dealing with this. Your safety matters more than anything I could say, and the harm is not your fault.',
      extraHtml: `
        <div class="chat-crisis-card">
          <p><strong>If you are in immediate danger, contact your local emergency number now.</strong></p>
          <a class="chat-crisis-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">Find local support and helplines \u2197</a>
        </div>`,
      steps: [
        'Get to a safer place if you can, and tell a trusted person what is happening.',
        'Contact local emergency services or a domestic abuse service. You do not have to handle this alone.',
        'Keep evidence and important documents somewhere safe if that is possible without increasing risk.'
      ],
      stepsTitle: 'Your safety first',
      verse,
      dua: null,
      comfort: 'May Allah protect you, give you safety, and connect you with people who will believe and help you.',
      followups: ['I am safe right now', 'Give me a du\u2019a for protection', 'Help me find support'],
      safety: 'crisis',
      context: { kind: 'safety', prompt: 'safety' }
    };
  }

  function greetingResponse() {
    if (state.language === 'dv') {
      return {
        kind: 'greeting',
        intro: 'ވަޢަލައިކުމުއް ސަލާމް ވަރަޙްމަތުއްލާހި ވަބަރަކާތުހޫ. އަޅުގަނޑު އިހުތިމާމާއެކު އަޑު އަހާނަން. ހިތުގައި ހުރި ކަމެއް ހިއްސާ ކުރައްވާ، މުނާސަބު އާޔަތެއް، ޢަމަލީ ފިޔަވަޅެއް އަދި ދުޢާއެއް ހުށަހެޅުމަށް މަސައްކަތް ކުރާނަން.',
        steps: null,
        followups: ['އަހަރެން ކަންބޮޑުވެފައި', 'ކެތްތެރިކަމާ ބެހޭ އާޔަތެއް ދައްކާ', 'މިއަދުގެ ނަމާދު ގަޑިތައް ކޮބާ؟', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
        safety: true,
        context: { kind: 'greeting', prompt: 'greeting' }
      };
    }
    return {
      kind: 'greeting',
      intro: 'Wa alaikum assalam wa rahmatullah. I\u2019m here to listen with care. Share what is on your heart, and I will offer one relevant verse, a practical step, and a du\u2019a.',
      steps: null,
      followups: ['I feel anxious', 'Show me a verse about patience', 'What are today\u2019s prayer times?', 'What can you do?'],
      safety: true,
      context: { kind: 'greeting', prompt: 'greeting' }
    };
  }

  function thanksResponse() {
    if (state.language === 'dv') {
      return {
        kind: 'thanks',
        intro: 'ވަ އިއްޔާކުމް — ތަފައްކުރުމުގެ މި ވަގުތުތަކުގައި އަޅުގަނޑު ހިމަނުއްވިތީ ޝުކުރިއްޔާ. ﷲ ތިބާ ކުރަން މަސައްކަތް ކުރާ ހެޔޮ ކަންތައް ޤަބޫލު ކުރައްވާށި.',
        comfort: 'އަދިވެސް ހިތުގައި ބޮޑު ކަމެއް ހުރިނަމަ، އެ ކަން ހިއްސާ ކުރައްވާ، އެއާއެކު އެކުގައި ވިސްނަމާ ހިނގާށެވެ.',
        followups: ['އަނެއް ސުވާލެއް އޮތް', 'މިއަދަށް އާޔަތެއް ދައްކާ', 'ޝުކުރުގެ ދުޢާއެއް ދެއްވާ'],
        safety: true,
        context: { kind: 'thanks', prompt: 'thanks' }
      };
    }
    return {
      kind: 'thanks',
      intro: 'Wa iyyak \u2014 and thank you for letting me be part of your reflection. May Allah accept whatever good you are trying to do.',
      comfort: 'If something is still weighing on you, you can tell me, and we can look at it together.',
      followups: ['I have another question', 'Show me a verse for today', 'Give me a du\u2019a for gratitude'],
      safety: true,
      context: { kind: 'thanks', prompt: 'thanks' }
    };
  }

  function metaResponse() {
    if (state.language === 'dv') {
      return {
        kind: 'meta',
        intro: 'އަޅުގަނޑަކީ ނޫރުގެ ތަފައްކުރުމުގެ އެހީތެރިއެއް. މި އެޕްގައިވާ ޖަމާކުރެވިފައިވާ މަސްދަރުތަކުން މުނާސަބު ޤުރުއާން އާޔަތެއް، ކުރު ޢަމަލީ ފިޔަވަޅެއް އަދި ދުޢާއެއް ހިއްސާ ކުރެވޭނެ — އަދި މައުޟޫޢަކަށް މުޅި ޤުރުއާން ތަރުޖަމާ ހޯދައި ބަލާނެ.',
        steps: [
          'ތިޔަ ކުރިމަތިވެފައިވާ ކަން ތިޔަބޭފުޅުގެ ބަހުން ހިއްސާ ކުރައްވާ.',
          'ޖަވާބު ކުރު އަދި ވަކިކޮށް ބަހައްޓާނަން: އާންމުކޮށް އެއް އާޔަތެއް، ބޭނުންނަމަ ކުރު ވާހަކައެއް، އަދި 2-3 ފިޔަވަޅެއް.',
          'ހުރިހާ ކަމެއް މި ޑިވައިސްގައި ހުރެދާނެ. އަޅުގަނޑަކީ ޢާލިމެއް، ތެރަޕިސްޓެއް ނުވަތަ ޑޮކްޓަރެއް ނޫން، އަދި ފަތުވާ ނުދޭނަން.'
        ],
        stepsTitle: 'އަޅުގަނޑު ކުރެވޭނެ އެހީ',
        followups: ['އަހަރެން ބުރަވެފައި', 'އުންމީދާ ބެހޭ އާޔަތެއް ދައްކާ', 'މިއަދުގެ ނަމާދު ގަޑިތައް ކޮބާ؟', 'ޤިބްލާ ހޯދާނީ ކިހިނެއް؟'],
        safety: true,
        context: { kind: 'meta', prompt: 'meta' }
      };
    }
    return {
      kind: 'meta',
      intro: 'I\u2019m Noor\u2019s reflection companion. I can share a relevant Qur\u2019anic verse, a short practical step, and a du\u2019a from the collections in this app \u2014 and I can search the full Qur\u2019an translation for a topic.',
      steps: [
        'Tell me what you are going through in your own words.',
        'I will keep the reply focused: usually one verse, one optional story, and two or three steps.',
        'Everything stays on this device. I am not a scholar, therapist, or doctor, and I do not issue rulings.'
      ],
      stepsTitle: 'How I can help',
      followups: ['I feel overwhelmed', 'Show me a verse about hope', 'What are today\u2019s prayer times?', 'How do I find the Qibla?'],
      safety: true,
      context: { kind: 'meta', prompt: 'meta' }
    };
  }

  function prayerResponse() {
    const cache = activePrayerCache();
    if (!cache) {
      if (state.language === 'dv') {
        return {
          kind: 'prayer',
          intro: 'ރައްކާކުރެވިފައިވާ ލޮކޭޝަނެއް ނެތުމުން، ދިމާވާ ނަމާދު ގަޑިތައް ދައްކަން ނުކުރެވޭނެ.',
          extraHtml: `<div class="chat-actions-row">${chatNavButton('prayer', tr('openPrayer'))}</div>`,
          steps: [
            'ނަމާދު ގަޑިތައް ހުޅުވާ ރަށެއް ހޮވާ ނުވަތަ ޑިވައިސް ލޮކޭޝަން ބޭނުންކުރޭ.',
            'ދެން އަލުން އަހާލައްވާ، މިއަދުގެ ގަޑިތަކާއި ދެން އަންނަ ނަމާދު ދައްކާނަން.'
          ],
          followups: ['ޤިބްލާ ހޯދާނީ ކިހިނެއް؟', 'ނަމާދާ ބެހޭ އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
          safety: true,
          context: { kind: 'prayer', prompt: 'prayer' }
        };
      }
      return {
        kind: 'prayer',
        intro: 'I do not have a saved location yet, so I cannot show accurate prayer times.',
        extraHtml: `<div class="chat-actions-row">${chatNavButton('prayer', 'Open Prayer Times')}</div>`,
        steps: [
          'Open Prayer Times and choose your city, or use device location.',
          'Then ask me again and I will show today\u2019s times and the next prayer countdown.'
        ],
        followups: ['How do I find the Qibla?', 'Show me a verse about prayer', 'What can you do?'],
        safety: true,
        context: { kind: 'prayer', prompt: 'prayer' }
      };
    }
    const timings = cache.timings || {};
    const next = getNextPrayer(timings);
    const current = getCurrentPrayerWindow(timings);
    const rows = PRAYER_ORDER.map(p => {
      const isNext = next && next.key === p.key;
      const nextLabel = state.language === 'dv' ? 'ދެން' : 'next';
      return `<div class="chat-prayer-row${isNext ? ' is-next' : ''}"><span>${escapeHtml(p.label)}</span><strong>${escapeHtml(cleanTiming(timings[p.key]))}</strong>${isNext ? `<em>${nextLabel}</em>` : ''}</div>`;
    }).join('');
    if (state.language === 'dv') {
      return {
        kind: 'prayer',
        intro: `${prayerLabel()} އަށް މިއަދުގެ ނަމާދު ގަޑިތައް މިއީ${current ? ` — މިހާރު ${current.label} ވަގުތު` : ''}.`,
        extraHtml: `<div class="chat-prayer-list">${rows}</div>`,
        extraTitle: 'މިއަދު',
        steps: next ? [`ދެން ${next.label}، ${next.countdown}.`] : [],
        stepsTitle: 'ދެން އަންނަ ނަމާދު',
        comfort: 'ﷲ ތިބާގެ ނަމާދުތައް ޤަބޫލު ކުރައްވާ، އަދި އެއީ ހިތްގެ ހަމަޖެހުމެއް ކަމުގައި ލައްވާށި.',
        followups: ['ނަމާދު ގަޑިތައް ހުޅުވާ', 'ޤިބްލާ ހޯދާނީ ކިހިނެއް؟', 'ދުޢާއެއް ދެއްވާ'],
        safety: true,
        context: { kind: 'prayer', prompt: 'prayer' }
      };
    }
    return {
      kind: 'prayer',
      intro: `Here are today\u2019s prayer times for ${prayerLabel()}${current ? ` \u2014 the current window is ${current.label}` : ''}.`,
      extraHtml: `<div class="chat-prayer-list">${rows}</div>`,
      extraTitle: 'Today',
      steps: next ? [`${next.label} is next, ${next.countdown}.`] : [],
      stepsTitle: 'Next prayer',
      comfort: 'May Allah accept your prayers and make them a source of steadiness for you.',
      followups: ['Open Prayer Times', 'How do I find the Qibla?', 'Make a du\u2019a for me'],
      safety: true,
      context: { kind: 'prayer', prompt: 'prayer' }
    };
  }

  function qiblaResponse() {
    const coords = prayerCoordinates();
    if (!coords) {
      if (state.language === 'dv') {
        return {
          kind: 'qibla',
          intro: 'ޤިބްލާ ދިމާ ދިމާވާ ގޮތް ދިމާކުރުމަށް ރައްކާކުރެވިފައިވާ ލޮކޭޝަނެއް ބޭނުންވެއެވެ.',
          extraHtml: `<div class="chat-actions-row">${chatNavButton('prayer', tr('openPrayer'))}${chatNavButton('prayer', tr('openQibla'))}</div>`,
          steps: [
            'ނަމާދު ގަޑިތައް ހުޅުވާ ރަށެއް ސޭވްކުރޭ ނުވަތަ ޑިވައިސް ލޮކޭޝަން ބޭނުންކުރޭ.',
            'ޤިބްލާ ކޮމްޕަސް ހުޅުވާ ފޯނު ފެންވަރަށް ދައްކާ؛ ރަން ކަޢުބާ މާކަރ ޤިބްލާ ދައްކާނެ.'
          ],
          followups: ['މިއަދުގެ ނަމާދު ގަޑިތައް ކޮބާ؟', 'ހިދާޔަތާ ބެހޭ އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
          safety: true,
          context: { kind: 'qibla', prompt: 'qibla' }
        };
      }
      return {
        kind: 'qibla',
        intro: 'I need a saved location before I can calculate the Qibla direction accurately.',
        extraHtml: `<div class="chat-actions-row">${chatNavButton('prayer', 'Open Prayer Times')}${chatNavButton('prayer', 'Qibla compass')}</div>`,
        steps: [
          'Open Prayer Times and save your city or use device location.',
          'Open the Qibla compass and hold your phone flat; the gold Kaaba marker points to the Qibla.'
        ],
        followups: ['What are today\u2019s prayer times?', 'Show me a verse about guidance', 'What can you do?'],
        safety: true,
        context: { kind: 'qibla', prompt: 'qibla' }
      };
    }
    const bearing = Math.round(qiblaBearing(coords.lat, coords.lon));
    if (state.language === 'dv') {
      return {
        kind: 'qibla',
        intro: `${prayerLabel()} އިން ޤިބްލާ ވަނީ ހަގީޤީ އުތުރުން ގާތްގަނޑަކަށް ${bearing}\u00b0 ދިމާއަށެވެ.`,
        extraHtml: `<div class="chat-qibla"><span class="chat-qibla-deg">${bearing}\u00b0</span><span class="chat-qibla-note">ހަގީޤީ އުތުރުން</span></div><div class="chat-actions-row">${chatNavButton('prayer', tr('openQibla'))}</div>`,
        steps: [
          'ޤިބްލާ ކޮމްޕަސް ހުޅުވާ ފޯނު ފެންވަރަށް ދައްކާ، ލޮހައި މެގްނެޓުން ދުރުކޮށް.',
          'ރަން ކަޢުބާ މާކަރ މަތީ ޕޮއިންޓަރަށް އައުމަށް ދަތް އަނބުރާލާ. ކިތަންމެ އަނބުރަންޖެހޭނެ އެޕް ދައްކާނެ.'
        ],
        comfort: 'ﷲ ތިބާގެ ނަމާދު ޤަބޫލު ކުރައްވާ، ދިމާ ފަސޭހަ ކުރައްވާށި.',
        followups: ['މިއަދުގެ ނަމާދު ގަޑިތައް ކޮބާ؟', 'ހިދާޔަތާ ބެހޭ އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
        safety: true,
        context: { kind: 'qibla', prompt: 'qibla' }
      };
    }
    return {
      kind: 'qibla',
      intro: `From ${prayerLabel()}, the Qibla is about ${bearing}\u00b0 from true north.`,
      extraHtml: `<div class="chat-qibla"><span class="chat-qibla-deg">${bearing}\u00b0</span><span class="chat-qibla-note">from true north</span></div><div class="chat-actions-row">${chatNavButton('prayer', 'Open Qibla compass')}</div>`,
      steps: [
        'Open the Qibla compass and hold your phone flat, away from metal and magnets.',
        'Turn until the gold Kaaba marker reaches the top pointer. The app shows how far to turn.'
      ],
      comfort: 'May Allah accept your prayer and make the direction easy for you.',
      followups: ['What are today\u2019s prayer times?', 'Show me a verse about guidance', 'What can you do?'],
      safety: true,
      context: { kind: 'qibla', prompt: 'qibla' }
    };
  }

  function rulingResponse() {
    if (state.language === 'dv') {
      return {
        kind: 'ruling',
        intro: 'ފަތުވާ ނުވަތަ ނިމުން ހުކުމެއް ދިނުމުގެ ޤާބިލުކަން އަޅުގަނޑަކަށް ނެތް. އެއަށް ބޭނުންވަނީ މުޅި ހާލަތާއި ދަލީލު އަދި ނަތީޖާ ބަލާނެ ޤާބިލު ޢާލިމަކެވެ.',
        steps: [
          'ސުވާލު ޔަޤީންކުރެވޭ ލޯކަލް އިމާމަކަށް ނުވަތަ ޤަބޫލުކުރެވޭ ޢިލްމީ ޖަމިއްޔާއަކަށް ހުށަހެޅުއްވާ.',
          'ގުޅުންހުރި ޤުރުއާން އާޔަތްތަކާއި ޞައްޙަ ޙަދީޘްތައް ކޮންޓެކްސްޓާ އެކު ކިޔަވާ؛ ވަކިކޮށް ނެގި ކްލިޕްތަކަށް ބަރޯސާ ނުކުރާށެވެ.',
          'މައްސަލަ ޞިއްޙަތާ، ޤާނޫނާ ނުވަތަ ރައްކާތެރިކަމާ ގުޅޭނަމަ، އެ ދާއިރާގެ ޕްރޮފެޝަނަލްއަކަށް ވެސް މަޝްވަރާ ކުރާށެވެ.'
        ],
        stepsTitle: 'ޔަޤީންކުރެވޭ ޖަވާބެއް ހޯދާ ގޮތް',
        dua: DUAS.find(d => d.id === 'dua-guidance') || null,
        comfort: 'އިޚްލާޞްތެރިކަމާއި ކެތްތެރިކަމާއެކު ސުވާލު ކުރުމަކީ ރަނގަޅު ފިޔަވަޅެކެވެ. ﷲ ތިބާއަށް ޞައްޙަ މަގު ދައްކަވާ، އުނދަގޫކަން ފަސޭހަ ކުރައްވާށި.',
        followups: ['ޤާބިލު ޢާލިމަކު ހޯދާނީ ކިހިނެއް؟', 'ހިދާޔަތާ ބެހޭ އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
        safety: true,
        context: { kind: 'ruling', prompt: 'ruling' }
      };
    }
    return {
      kind: 'ruling',
      intro: 'I cannot issue a fatwa or give a definitive ruling. That needs a qualified scholar who can consider the full situation, the evidence, and the consequences.',
      steps: [
        'Take the question to a trusted local imam or a recognised scholarly body.',
        'Read the relevant Qur\u2019anic verses and authentic hadith in context; avoid isolated clips or social media summaries.',
        'If the matter involves health, law, or safety, consult the appropriate professional as well.'
      ],
      stepsTitle: 'How to get a reliable answer',
      dua: DUAS.find(d => d.id === 'dua-guidance') || null,
      comfort: 'Asking with sincerity and patience is itself a good step. May Allah guide you to what is correct and ease the confusion.',
      followups: ['How do I find a qualified scholar?', 'Show me a verse about guidance', 'What can you do?'],
      safety: true,
      context: { kind: 'ruling', prompt: 'ruling' }
    };
  }

  function hadithResponse() {
    const dua = DUAS.find(d => d.id === 'dua-guidance') || DUAS.find(d => d.origin === 'quran') || null;
    if (state.language === 'dv') {
      return {
        kind: 'hadith',
        intro: 'ހަނދާނުން ޙަދީޘެއް ނަގުލުކޮށް ނުވަތަ ތަސްދީޤު ނުކުރެވޭނެ، އަދި ގޯހެއް ހިއްސާކުރުމުގެ ރިސްކު ނުނަން. ޞައްޙަ ރިވާޔަތްތަކަށް ޔަޤީންކުރެވޭ މަސްދަރުތަކުން ސީދާ ބަލާލައްވާ.',
        steps: [
          'Sunnah.com އިން ރިވާޔަތް ހޯދައި ޢަރަބި، ތަރުޖަމާ އަދި ދަރަޖަ އެއްކޮށް ކިޔަވާ.',
          'މި ތަނުގެ ދުޢާތައް ބައިން ޙިޞްނުލް މުސްލިމްގެ ތަސްދީޤުކުރެވިފައިވާ ދުޢާތައާއި މަސްދަރުތައް ބަލާލައްވާ.',
          'ޙަދީޘެއް ދީނީ ނިންމުމަކަށް އަސަރު ކުރާނަމަ، ޤާބިލު ޢާލިމަކުން ކޮންޓެކްސްޓާ އެކު ބަޔާން ހޯދާށެވެ.'
        ],
        stepsTitle: 'ޔަޤީންކުރެވޭ ގޮތްތައް',
        extraHtml: `<div class="chat-actions-row"><a class="btn secondary chat-nav-btn" href="https://sunnah.com" target="_blank" rel="noopener noreferrer">Sunnah.com ހުޅުވާ \u2197</a>${chatNavButton('duas', tr('openDuas'))}</div>`,
        dua,
        comfort: 'ﷲ ތިބާއަށް ފަހުމާއި ޞައްޙަ އަދި މަންފާކުރާ ކަންތަކަށް މަގު ދައްކަވާށި.',
        followups: ['ޙިޞްނުލް މުސްލިމްގެ ދުޢާއެއް ދައްކާ', 'ހިދާޔަތާ ބެހޭ އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
        safety: true,
        context: { kind: 'hadith', prompt: 'hadith' }
      };
    }
    return {
      kind: 'hadith',
      intro: 'I can\u2019t quote or verify hadith from memory, and I don\u2019t want to risk sharing something inaccurately. For authentic narrations, please check a trusted source directly.',
      steps: [
        'Search the narration on Sunnah.com and read the Arabic, translation, and grading together.',
        'Explore the Du\u2019as section here for verified supplications from Hisn al-Muslim with their sources.',
        'If a hadith affects a religious decision, ask a qualified scholar to explain it in context.'
      ],
      stepsTitle: 'Trusted ways to check',
      extraHtml: `<div class="chat-actions-row"><a class="btn secondary chat-nav-btn" href="https://sunnah.com" target="_blank" rel="noopener noreferrer">Open Sunnah.com \u2197</a>${chatNavButton('duas', 'Open Du\u2019as')}</div>`,
      dua,
      comfort: 'May Allah grant you understanding and guide you to what is authentic and beneficial.',
      followups: ['Show me a du\u2019a from Hisn al-Muslim', 'Show me a verse about guidance', 'What can you do?'],
      safety: true,
      context: { kind: 'hadith', prompt: 'hadith' }
    };
  }

  async function verseReferenceResponse(ref, text) {
    const verse = ref.ayah ? await findAyah(ref.surah, ref.ayah) : null;
    if (!verse) {
      if (state.language === 'dv') {
        return {
          kind: 'verse',
          intro: ref.ayah
            ? `ބަންޑުކުރެވިފައިވާ ޤުރުއާން ޓެކްސްޓުން ${ref.surah}:${ref.ayah} ނުފެނުނު. ސޫރަތާއި އާޔަތް ނަންބަރު ބަލާލައްވާ.`
            : `ސޫރަތް ${ref.surah} ހުޅުވައިދެވޭނެ، ނަމަވެސް އެއް އާޔަތެއް ދައްކާލުމަށް އާޔަތް ނަންބަރެއް ބޭނުންވެއެވެ.`,
          extraHtml: `<div class="chat-actions-row">${chatNavButton('quran', `${tr('openSurah')} ${ref.surah}`)}</div>`,
          steps: ['ޤުރުއާން ޓެބުން މުޅި ޤުރުއާން ބްރައުޒް ކުރެވޭނެ.', 'ތަފްސީރަށް ޔަޤީންކުރެވޭ ތަފްސީރެއް ނުވަތަ ޤާބިލު މުދައްރިސަކު ބަލާށެވެ.'],
          followups: ['ކެތްތެރިކަމާ ބެހޭ އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟', 'މިއަދުގެ ނަމާދު ގަޑިތައް ކޮބާ؟'],
          safety: true,
          context: { kind: 'verse', surah: ref.surah, ayah: ref.ayah, keywords: extractKeywords(text) }
        };
      }
      return {
        kind: 'verse',
        intro: ref.ayah
          ? `I could not find ${ref.surah}:${ref.ayah} in the bundled Qur\u2019an text. Please check the surah and ayah number.`
          : `I can open Surah ${ref.surah} for you, but I need an ayah number to show one verse.`,
        extraHtml: `<div class="chat-actions-row">${chatNavButton('quran', `Open Surah ${ref.surah}`)}</div>`,
        steps: ['You can browse the full Qur\u2019an in the Quran tab.', 'For explanation, use a trusted tafsir or ask a qualified teacher.'],
        followups: ['Show me a verse about patience', 'What can you do?', 'What are today\u2019s prayer times?'],
        safety: true,
        context: { kind: 'verse', surah: ref.surah, ayah: ref.ayah, keywords: extractKeywords(text) }
      };
    }
    lastGuidance = { verses: [verse], stories: [], duas: [] };
    if (state.language === 'dv') {
      return {
        kind: 'verse',
        intro: `${verse.source} މިއީ.`,
        verse,
        steps: [
          'ކޮންޓެކްސްޓަށް މި އާޔަތުގެ ކުރިންނާއި ފަހުން އަންނަ އާޔަތްތައް ކިޔަވާ.',
          'ތަފްސީރަށް ހަމައެކަނި ތަރުޖަމާއަކަށް ބަރޯސާ ނުކުރެ ޤާބިލު ޢާލިމަކު ނުވަތަ ޤަބޫލުކުރެވޭ ތަފްސީރެއް ބަލާށެވެ.'
        ],
        comfort: 'ﷲ ތިބާއަށް މާނަ ވަރުގަދަ ކޮށްދެއްވާ، އަދި އެއީ ހިދާޔަތެއް ކަމުގައި ލައްވާށި.',
        followups: ['ސާދައިން ބަޔާން ކުރައްވާ', 'އިތުރު އާޔަތެއް ދައްކާ', 'މުޅި ސޫރަތް ހުޅުވާ'],
        safety: true,
        context: {
          kind: 'verseRef', prompt: text, keywords: extractKeywords(text), verseId: verse.id,
          verseGlobal: verse.global, surah: verse.surahNumber, ayah: Number(String(verse.ayah).split('-')[0])
        }
      };
    }
    return {
      kind: 'verse',
      intro: `Here is ${verse.source}.`,
      verse,
      steps: [
        'Read the ayahs immediately before and after it for context.',
        'For tafsir, consult a trusted scholar or a recognised commentary rather than relying on a single translation.'
      ],
      comfort: 'May Allah open the meaning for you and make it a source of guidance.',
      followups: ['Explain it simply', 'Show me another verse', 'Open the full surah'],
      safety: true,
      context: {
        kind: 'verseRef', prompt: text, keywords: extractKeywords(text), verseId: verse.id,
        verseGlobal: verse.global, surah: verse.surahNumber, ayah: Number(String(verse.ayah).split('-')[0])
      }
    };
  }

  async function storyResponse(text) {
    const t = normalizeChatText(text);
    const named = STORIES.find(s =>
      s.prophets.some(p => phraseHit(t, p.toLowerCase())) ||
      phraseHit(t, s.title.toLowerCase()) ||
      phraseHit(t, (s.title.split('\u2013')[0] || '').toLowerCase())
    );
    let story = named;
    if (!story && lastChatContext && lastChatContext.storyId) {
      const idx = STORIES.findIndex(s => s.id === lastChatContext.storyId);
      story = STORIES[(idx + 1) % STORIES.length];
    }
    story = story || STORIES[0];
    if (state.language === 'dv') {
      return {
        kind: 'story',
        intro: `${story.prophets[0]} (އަލައިހިއްސަލާމް) ގެ ވާހަކަ، ޤުރުއާނީ މަސްދަރުތަކާއެކު މިއީ.`,
        story: story,
        storyOpen: true,
        steps: story.lessons.slice(0, 3),
        stepsTitle: 'ވާހަކައިން ލިބޭ އިބުރަތްތައް',
        comfort: 'ﷲ މި އިބުރަތްތައް ތިބާއަށް ކެތްތެރިކަމާއި އުންމީދުގެ ވަސީލަތެއް ކަމުގައި ލައްވާށި.',
        followups: ['އިތުރު ވާހަކައެއް ކިޔާލައްވާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ', 'ކެތްތެރިކަމާ ބެހޭ އާޔަތެއް ދައްކާ'],
        safety: true,
        context: { kind: 'story', prompt: text, storyId: story.id, keywords: extractKeywords(text) }
      };
    }
    return {
      kind: 'story',
      intro: `Here is the account of ${story.prophets[0]} (AS), with its Qur\u2019anic references.`,
      story: story,
      storyOpen: true,
      steps: story.lessons.slice(0, 3),
      stepsTitle: 'Lessons from the story',
      comfort: 'May Allah make these lessons a source of patience and hope for you.',
      followups: ['Tell me another story', 'Give me a du\u2019a for this', 'Show me a verse about patience'],
      safety: true,
      context: { kind: 'story', prompt: text, storyId: story.id, keywords: extractKeywords(text) }
    };
  }

  async function duaResponse(keywords, text) {
    const scores = analyzeMessage(text);
    const ranked = rankByThemes(DUAS, scores, 'tags').filter(x => x.score > 0);
    let dua = ranked[0] && ranked[0].item;
    if (!dua) dua = comfortDua(scores);
    if (!dua && keywords.length) {
      dua = DUAS.find(d => {
        const hay = `${d.title} ${d.meaning_en || ''} ${(d.tags || []).join(' ')}`.toLowerCase();
        return keywords.some(k => hay.includes(k));
      });
    }
    dua = dua || DUAS[0];
    const idx = DUAS.findIndex(d => d.id === dua.id);
    if (state.language === 'dv') {
      return {
        kind: 'dua',
        intro: 'ތިޔަ ބަޔާން ކުރެއްވި ކަމާ ގުޅޭ ދުޢާއެއް މިއީ. ހިތް ހުރިހާ ގޮތަކުން ހަމަޖައިގެން މަޑުމައިތިރިކަމާއެކު ކިޔަވާ، ބޭނުންވާ މިންވަރަށް ތަކުރާރު ކުރައްވާ.',
        dua,
        steps: [
          'ތިޔަބޭފުޅުގެ އަމިއްލަ ބަހުން ވެސް ދުޢާ ކުރައްވާ؛ ﷲ އަށް ތިބާއަށް ބޭނުންވާ ކަން އެދުމުގެ ކުރިން ވެސް އެނގެވެ.',
          'ނަމާދަށް ފަހު ނުވަތަ ނިދުމުގެ ކުރިން ހަމަޖެހި ވަގުތެއް ހޮވައި، ނުރުހުމާއެކު އުންމީދާއެކު އެދޭ.'
        ],
        comfort: 'ﷲ ތިބާއަށް އެންމެ ހެޔޮ ކަމެއް، އެންމެ ރަނގަޅު ވަގުތެއްގައި، އެންމެ ރަނގަޅު ގޮތަކުން އިޖާބަ ކުރައްވާށި.',
        followups: ['އިތުރު ދުޢާއެއް ދެއްވާ', 'މިކަމަށް އާޔަތެއް ދައްކާ', 'ދުޢާތަކުގެ ޖަމާއަތް ހުޅުވާ'],
        safety: true,
        context: { kind: 'dua', prompt: text, duaId: dua.id, duaIndex: idx, keywords: keywords.length ? keywords : extractKeywords(dua.title) }
      };
    }
    return {
      kind: 'dua',
      intro: `Here is a du\u2019a that fits what you described. Say it slowly, with presence of heart, and repeat it as much as you need.`,
      dua,
      steps: [
        'Make the du\u2019a in your own words too; Allah knows what you need before you ask.',
        'Choose a quiet moment after salah or before sleep, and ask with hope rather than despair.'
      ],
      comfort: 'May Allah answer what is best for you, at the best time, in the best way.',
      followups: ['Give me another du\u2019a', 'Show me a verse for this', 'Open the du\u2019a collection'],
      safety: true,
      context: { kind: 'dua', prompt: text, duaId: dua.id, duaIndex: idx, keywords: keywords.length ? keywords : extractKeywords(dua.title) }
    };
  }

  async function guidanceResponse(text, keywords) {
    const scores = analyzeMessage(text);
    const rankedVerses = rankByThemes(VERSES, scores).filter(x => x.score > 0);
    const rankedStories = rankByThemes(STORIES, scores).filter(x => x.score >= 2);
    const rankedDuas = rankByThemes(DUAS, scores, 'tags').filter(x => x.score > 0);

    const excludeId = regenExcludeVerseId;
    const excludeGlobal = regenExcludeGlobal;
    regenExcludeVerseId = null;
    regenExcludeGlobal = null;

    let verse = null;
    let searched = false;
    const curated = rankedVerses.map(x => x.item).filter(v => !excludeId || v.id !== excludeId);
    if (curated.length) verse = curated[0];

    if (!verse && keywords.length) {
      const exclude = [];
      if (excludeGlobal) exclude.push(excludeGlobal);
      const results = await safeQuranSearch(keywords, 8, exclude);
      const strong = results.find(r => r.hits >= Math.min(2, keywords.length)) || results[0];
      if (strong && (!excludeId || `${strong.surah.number}:${strong.ayah.n}` !== excludeId) && strong.hits >= Math.min(2, keywords.length)) {
        verse = verseFromSearch(strong);
        searched = true;
      }
    }
    if (!verse) {
      verse = curated[0] || VERSES.find(v => v.id !== excludeId) || VERSES[0];
    }

    const story = rankedStories[0] ? rankedStories[0].item : null;
    const dua = rankedDuas[0] ? rankedDuas[0].item : comfortDua(scores);

    lastGuidance = { verses: [verse], stories: story ? [story] : [], duas: dua ? [dua] : [] };
    return {
      kind: 'guidance',
      intro: buildAcknowledgement(scores),
      verse,
      showMeaning: !searched,
      story,
      steps: buildPracticalGuidance(scores),
      dua,
      comfort: shortComfort(scores),
      followups: guidanceFollowups(scores, story),
      safety: true,
      context: {
        kind: 'guidance', prompt: text, keywords,
        verseId: verse.id, verseGlobal: verse.global,
        surah: verse.surahNumber, ayah: Number(String(verse.ayah).split('-')[0]),
        duaId: dua && dua.id, storyId: story && story.id
      }
    };
  }

  async function anotherVerseResponse(ctx) {
    let verse = null;
    if (ctx.keywords && ctx.keywords.length) {
      const results = await safeQuranSearch(ctx.keywords, 8, ctx.verseGlobal ? [ctx.verseGlobal] : []);
      const strong = results.find(r => r.hits >= Math.min(2, ctx.keywords.length));
      if (strong) verse = verseFromSearch(strong);
    }
    if (!verse) verse = nextCuratedVerse(ctx.verseId);
    lastGuidance = { verses: [verse], stories: [], duas: [] };
    if (state.language === 'dv') {
      return {
        kind: 'guidance',
        intro: 'ތަފައްކުރުމަށް އިތުރު އާޔަތެއް މިއީ.',
        verse,
        showMeaning: !verse.searched,
        steps: [
          'މަޑުމައިތިރިކަމާއެކު ކިޔަވާ، ދެން ކައިރީގައާއި ފަހަތުގައި އަންނަ އާޔަތްތައް ކިޔަވާ.',
          'ތިޔަ ކުރިމަތިވެފައިވާ ކަމާ އެންމެ ގާތްކޮށް ގުޅޭ ބަސްފޮތް ކޮބައިކަން ވިސްނާލައްވާ.'
        ],
        comfort: 'ﷲ މި އާޔަތުގެ މާނަ ތިބާގެ ހިތަށް ލުއިކޮށް ހަމަޖެހުން ދެއްވާށި.',
        followups: ['އިތުރު އާޔަތެއް ދައްކާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ', 'މިއަދު އަހަރެން ކުރެވޭނެ ކަމަކީ ކޮބާ؟'],
        safety: true,
        context: {
          ...ctx,
          verseId: verse.id,
          verseGlobal: verse.global,
          surah: verse.surahNumber,
          ayah: Number(String(verse.ayah).split('-')[0])
        }
      };
    }
    return {
      kind: 'guidance',
      intro: 'Here is another verse to sit with.',
      verse,
      showMeaning: !verse.searched,
      steps: [
        'Read it slowly, then read the two ayahs around it.',
        'Ask yourself which phrase speaks most directly to what you are facing.'
      ],
      comfort: 'May Allah make the meaning land gently and give you steadiness.',
      followups: ['Show me another verse', "Give me a du\u2019a for this", 'What can I do today?'],
      safety: true,
      context: {
        ...ctx,
        verseId: verse.id,
        verseGlobal: verse.global,
        surah: verse.surahNumber,
        ayah: Number(String(verse.ayah).split('-')[0])
      }
    };
  }

  async function explainResponse(ctx) {
    const verse = await verseById(ctx.verseId);
    if (!verse) {
      if (state.language === 'dv') {
        return {
          kind: 'verse',
          intro: 'މާނައެއް އުފެއްދަން ބޭނުން ނުވާނެ. އާޔަތް ޤުރުއާނުގައި ހުޅުވައި ޔަޤީންކުރެވޭ ތަފްސީރެއްގެ އެހީތެރިކަމާއެކު ކިޔަވާ.',
          steps: ['ކައިރީގައާއި ފަހަތުގައި އަންނަ އާޔަތްތައް ކިޔަވާ.', 'ކޮންޓެކްސްޓަށް ޤާބިލު މުދައްރިސަކު ނުވަތަ ޤަބޫލުކުރެވޭ ތަފްސީރެއް ބަލާށެވެ.'],
          followups: ['އިތުރު އާޔަތެއް ދައްކާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
          safety: true,
          context: ctx
        };
      }
      return {
        kind: 'verse',
        intro: 'I do not want to invent a meaning. Open the verse in the Qur\u2019an and read it with a trusted tafsir.',
        steps: ['Read the surrounding ayahs.', 'Ask a qualified teacher or use a recognised tafsir for context.'],
        followups: ['Show me another verse', 'What can you do?'],
        safety: true,
        context: ctx
      };
    }
    const hasCurated = !!verse.meaning;
    if (state.language === 'dv') {
      return {
        kind: 'verse',
        intro: hasCurated
          ? 'މި އެޕްގެ ތަސްދީޤުކުރެވިފައިވާ ނޯޓުގެ ބިންގާމައްޗަށް ސާދަ، އިހުތިޔާތުކަރަމާއެކު ތަފައްކުރެއް މިއީ.'
          : 'ތަފްސީރެއް އުފެއްދަން ބޭނުން ނުވާނެ. ތަރުޖަމާ އަލުން ދެންނަވަމުން، ޒިންމާދާރުކަމާއެކު ކިޔަވާ ގޮތެއް ދައްކާލަން.',
        verse,
        showMeaning: hasCurated,
        steps: hasCurated
          ? [verse.reflection, 'ކޮންޓެކްސްޓަށް ކައިރީގައާއި ފަހަތުގައި އަންނަ ބައިތައް ކިޔަވާ.', 'ސާފު ނުވާ ކަމެއް އޮތްނަމަ ޤާބިލު މުދައްރިސަކު ބަލާށެވެ.']
          : ['މި އާޔަތުގެ ކުރިންނާއި ފަހުން އަންނަ އާޔަތްތައް ކިޔަވާ.', 'ވަކި ތަރުޖަމާއަކަށް ބަރޯސާ ނުކުރެ ޤަބޫލުކުރެވޭ ތަފްސީރެއް ބަލާށެވެ.', 'މާނަ ތިބާގެ ނިންމުމަކަށް އަސަރު ކުރާނަމަ ޤާބިލު މުދައްރިސަކު ބަލާށެވެ.'],
        stepsTitle: hasCurated ? 'ތަފައްކުރު' : 'ކިޔަވާ ގޮތް',
        comfort: 'ﷲ ތިބާއަށް ފަހުމް އިތުރު ކުރައްވާ، އަދި އިލްމެއް ނެތި އެކަލާނގެ މެދު ވާހަކަ ދެއްކުމުން ރައްކާތެރި ކުރައްވާށި.',
        followups: ['އިތުރު އާޔަތެއް ދައްކާ', 'ޤުރުއާނުގައި ހުޅުވާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ'],
        safety: true,
        context: ctx
      };
    }
    return {
      kind: 'verse',
      intro: hasCurated
        ? 'Here is a careful, simple reflection based on this app\u2019s verified note.'
        : 'I do not want to invent a tafsir. Here is the translation again, with a note on how to read it responsibly.',
      verse,
      showMeaning: hasCurated,
      steps: hasCurated
        ? [verse.reflection, 'Read the surrounding passage so the verse stays in context.', 'Ask a qualified teacher about anything that is still unclear.']
        : ['Read the ayahs before and after this one.', 'Use a recognised tafsir for explanation rather than a single isolated translation.', 'Ask a qualified teacher if the meaning affects a decision in your life.'],
      stepsTitle: hasCurated ? 'Reflection' : 'How to read it',
      comfort: 'May Allah increase you in understanding and protect you from saying anything about Him without knowledge.',
      followups: ['Show me another verse', 'Open in Quran', "Give me a du\u2019a for this"],
      safety: true,
      context: ctx
    };
  }

  function actionStepsResponse(ctx) {
    const scores = analyzeMessage(ctx.prompt || '');
    if (state.language === 'dv') {
      return {
        kind: 'guidance',
        intro: 'މިއަދަށް ކުރެވޭނެ ކުޑަ، ޢަމަލީ ފިޔަވަޅުތަކެއް މިއީ. ފުރިހަމަކަމަށް ވުރެ ފަސޭހަކަމާއި ދެމެހެއްޓުން ބަހައްޓާ.',
        steps: buildPracticalGuidance(scores),
        comfort: 'ﷲ މި ކުޑަ ފިޔަވަޅުތަކަށް ބަރަކާތް ލައްވާ، ދާއިމީ ކުރައްވާށި.',
        followups: ['އިތުރު އާޔަތެއް ދައްކާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ', 'ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
        safety: true,
        context: ctx
      };
    }
    return {
      kind: 'guidance',
      intro: 'Here are a few small, practical steps for today. Keep them light and consistent rather than perfect.',
      steps: buildPracticalGuidance(scores),
      comfort: 'May Allah bless the small steps and make them lasting.',
      followups: ['Show me another verse', "Give me a du\u2019a for this", 'What can you do?'],
      safety: true,
      context: ctx
    };
  }

  async function moreResponse(ctx) {
    if (ctx.kind === 'story' && ctx.storyId) return await storyResponse('Tell me another story');
    if (ctx.kind === 'dua') {
      const idx = Number.isInteger(ctx.duaIndex) ? ctx.duaIndex : 0;
      const dua = DUAS[(idx + 1) % DUAS.length];
      if (state.language === 'dv') {
        return {
          kind: 'dua',
          intro: 'ޖަމާއަތުން އިތުރު ދުޢާއެއް މިއީ.',
          dua,
          comfort: 'ﷲ ތިބާއަށް އެންމެ ހެޔޮ ކަމެއް އިޖާބަ ކުރައްވާށި.',
          followups: ['އިތުރު ދުޢާއެއް ދެއްވާ', 'މިކަމަށް އާޔަތެއް ދައްކާ', 'ދުޢާތަކުގެ ޖަމާއަތް ހުޅުވާ'],
          safety: true,
          context: { ...ctx, duaId: dua.id, duaIndex: (idx + 1) % DUAS.length }
        };
      }
      return {
        kind: 'dua',
        intro: 'Here is another du\u2019a from the collection.',
        dua,
        comfort: 'May Allah answer what is best for you.',
        followups: ['Give me another du\u2019a', 'Show me a verse for this', 'Open the du\u2019a collection'],
        safety: true,
        context: { ...ctx, duaId: dua.id, duaIndex: (idx + 1) % DUAS.length }
      };
    }
    if (ctx.kind === 'verse' || ctx.kind === 'verseRef' || ctx.kind === 'guidance') {
      if (state.language === 'dv') {
        return {
          kind: 'verse',
          intro: 'އެ އާޔަތާ ބެހޭ އިތުރު ކޮންޓެކްސްޓެއް މިއީ.',
          verse: await verseById(ctx.verseId),
          showMeaning: true,
          steps: [
            'އެ އާޔަތުގެ ކުރިންނާއި ފަހުން އަންނަ އާޔަތްތައް ކިޔަވާ.',
            'ކާކަށް ޚާއްޞަ ކޮށް ވާހަކަ ދައްކަވާފައިވާކަމާއި، ކޮން ހާލަތެއް ބަޔާންކުރަނީ ކަން ފާހަގަ ކުރޭ.',
            'ފުރިހަމަ ތަފްސީރަށް ޔަޤީންކުރެވޭ ތަފްސީރެއް ނުވަތަ ޤާބިލު މުދައްރިސަކު ބަލާށެވެ.'
          ],
          stepsTitle: 'އިތުރަށް ވިސްނުމަށް',
          comfort: 'ﷲ ތިބާއަށް މާނަ ވަރުގަދަ ކޮށްދެއްވާށި.',
          followups: ['އިތުރު އާޔަތެއް ދައްކާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ', 'މިއަދު އަހަރެން ކުރެވޭނެ ކަމަކީ ކޮބާ؟'],
          safety: true,
          context: ctx
        };
      }
      return {
        kind: 'verse',
        intro: 'Here is a little more context for that verse.',
        verse: await verseById(ctx.verseId),
        showMeaning: true,
        steps: [
          'Read the ayahs immediately before and after it.',
          'Notice who is being addressed and what situation the passage describes.',
          'For a full explanation, use a trusted tafsir or ask a qualified teacher.'
        ],
        stepsTitle: 'Going deeper',
        comfort: 'May Allah open the meaning for you.',
        followups: ['Show me another verse', "Give me a du\u2019a for this", 'What can I do today?'],
        safety: true,
        context: ctx
      };
    }
    return actionStepsResponse(ctx);
  }

  async function followupResponse(text) {
    const ctx = lastChatContext;
    if (!ctx) return null;
    if (hasAnyPhrase(text, ['another verse', 'more verse', 'different verse', 'another ayah', 'next verse', 'show me another', 'one more verse', 'އިތުރު އާޔަތެއް'])) {
      return await anotherVerseResponse(ctx);
    }
    if (hasAnyPhrase(text, ['another story', 'tell me another story', 'different story', 'އިތުރު ވާހަކައެއް', 'ވާހަކަ ކިޔާލައްވާ'])) {
      return await storyResponse('Tell me another story');
    }
    if (hasAnyPhrase(text, ['another dua', 'more dua', 'different dua', 'give me another dua', "give me another du'a", 'އިތުރު ދުޢާއެއް'])) {
      return await moreResponse({ ...ctx, kind: 'dua' });
    }
    if (hasAnyPhrase(text, ['dua', "du'a", 'supplication', 'ދުޢާއެއް', 'ދުޢާ'])) {
      return await duaResponse(ctx.keywords || [], `du'a for ${ctx.prompt || 'this'}`);
    }
    if (hasAnyPhrase(text, ['explain', 'what does it mean', 'meaning', 'simply', 'what does that mean', 'ބަޔާން', 'މާނަ'])) {
      return await explainResponse(ctx);
    }
    if (hasAnyPhrase(text, ['open it', 'open that', 'show in quran', 'open in quran', 'ޤުރުއާނުގައި ހުޅުވާ', 'މުޅި ސޫރަތް ހުޅުވާ'])) {
      return await openContextVerse(ctx);
    }
    if (hasAnyPhrase(text, ['what can i do', 'what should i do', 'practical', 'today', 'steps', 'މިއަދު އަހަރެން ކުރެވޭނެ'])) {
      return actionStepsResponse(ctx);
    }
    if (hasAnyPhrase(text, ['more', 'continue', 'go on', 'tell me more', 'another', 'next'])) {
      return await moreResponse(ctx);
    }
    return null;
  }

  async function openContextVerse(ctx) {
    let verse = ctx.verseId ? await verseById(ctx.verseId) : null;
    if (!verse && ctx.surah && ctx.ayah) {
      verse = await findAyah(Number(ctx.surah), Number(ctx.ayah));
    }
    // After a du'a, "Open in Quran" should open the du'a's Qur'anic source.
    if (!verse && ctx.duaId) {
      const dua = DUAS.find(d => d.id === ctx.duaId);
      const m = dua && String(dua.source_url || '').match(/quran\.com\/(\d+)\/(\d+)/);
      if (m) verse = await findAyah(Number(m[1]), Number(m[2]));
    }
    if (verse) {
      openQuranAyah(verse.surahNumber, verse.ayah);
      if (state.language === 'dv') {
        return {
          kind: 'verse',
          intro: `${verse.source} ޤުރުއާން ރީޑަރުގައި ހުޅުވަނީ. ހައިލައިޓް ކުރެވިފައިވާ އާޔަތް ބަލާށެވެ.`,
          verse,
          showMeaning: true,
          steps: ['ހައިލައިޓް ކުރެވިފައިވާ އާޔަތަށް ޓެޕްކޮށް މާނަ ބަލާ، ނުވަތަ މުޅި ޞަފްޙާއަށް މާނަ ދައްކާ ސްވިޗް ބޭނުންކުރޭ.'],
          followups: ['އިތުރު އާޔަތެއް ދައްކާ', 'މިކަމަށް ދުޢާއެއް ދެއްވާ', 'މިއަދު އަހަރެން ކުރެވޭނެ ކަމަކީ ކޮބާ؟'],
          safety: true,
          context: ctx
        };
      }
      return {
        kind: 'verse',
        intro: `Opening ${verse.source} in the Qur\u2019an reader. Use the highlighted ayah there.`,
        verse,
        showMeaning: true,
        steps: ['Tap the highlighted ayah to open its meaning, or use the meaning switch for the whole page.'],
        followups: ['Show me another verse', "Give me a du\u2019a for this", 'What can I do today?'],
        safety: true,
        context: ctx
      };
    }
    if (state.language === 'dv') {
      return {
        kind: 'verse',
        intro: 'ބައި ކިޔަވާލުމަށް ޤުރުއާން ޓެބު ހުޅުވާލައްވާ. މިވަގުތު އެ އާޔަތް ލޯޑް ނުކުރެވުނު.',
        extraHtml: `<div class="chat-actions-row">${chatNavButton('quran', tr('quran', 'ޤުރުއާން ހުޅުވާ'))}</div>`,
        followups: ['ތިބާއަށް ކޮން އެހީއެއް ދެވޭނެ؟'],
        safety: true,
        context: ctx
      };
    }
    return {
      kind: 'verse',
      intro: 'Open the Quran tab to read the passage. I could not load the exact verse just now.',
      extraHtml: `<div class="chat-actions-row">${chatNavButton('quran', 'Open Quran')}</div>`,
      followups: ['What can you do?'],
      safety: true,
      context: ctx
    };
  }

  function calmResponse() {
    const dua = DUAS.find(d => d.id === 'dua-trust') || DUAS[0];
    if (state.language === 'dv') {
      return {
        kind: 'crisis',
        crisis: true,
        intro: 'ހާލު ބުނެދެއްވިތީ އަހަރެން ހިތްހަމަޖެހިއްޖެ. ރައްކާތެރިވެ ހުންނެވުމަކީ އެންމެ މުހިންމު ކަމެއް، އަދި އެހީ ހޯދުމަކީ ބާރުވެރި ފިޔަވަޅެކެވެ.',
        steps: [
          'މިނިވަން ކުރެވޭނަމަ ޔަޤީންކުރެވޭ މީހަކާ އެކު ހުންނާ، ފޯނުން ވެސް ވަނީ ނަމަ.',
          'ކްރައިސިސް ހެލްޕްލައިން ނަމްބަރެއް ފޯނުގައި ސޭވްކޮށްފައި ބަހައްޓާ، ހާލަތު ބުރަވެގެން ދިއުމުގެ ކުރިން ބޭނުންކުރޭ.',
          'އަމިއްލަ ނަފްސަށް ގެއްލުން ދޭން ހަދައިގެން އުޅޭ ހިތްވަރު އަނބުރާ އައިނަމަ، ރައްކާތެރި ތަނަކަށް ގޮސް ހަމައެކަނި މީހަކަށް ބުނާށެވެ.'
        ],
        stepsTitle: 'ރައްކާތެރިވެ ހުންނަވާ',
        dua,
        comfort: 'ﷲ ތިބާ ރައްކާތެރި ކުރައްވާ، ހިތް ހަމަޖައްސަވާ، އަދި ރަނގަޅު މީހުން ތިބާއާ ގުޅުވައިދެއްވާށި.',
        followups: ['ސޭފްޓީ ޕްލޭނެއް ހެދުމަށް އެހީދޭ', 'ހިތްހަމަޖެހޭ ދުޢާއެއް ދެއްވާ', 'އެހީ ހޯދުމަށް އެހީދޭ'],
        safety: 'crisis',
        context: { kind: 'crisis', prompt: 'crisis' }
      };
    }
    return {
      kind: 'crisis',
      crisis: true,
      intro: 'I am glad you checked in. Staying safe is the priority, and reaching out is a strong step.',
      steps: [
        'Stay with someone you trust if you can, even just on the phone.',
        'Keep a crisis line saved in your phone and use it before things feel unmanageable.',
        'If the urge to hurt yourself returns, go to a safer place and tell someone immediately.'
      ],
      stepsTitle: 'Keep yourself safe',
      dua,
      comfort: 'May Allah keep you safe, calm your heart, and place the right people in your path.',
      followups: ['Help me make a safety plan', 'Give me a du\u2019a for calm', 'Help me find support'],
      safety: 'crisis',
      context: { kind: 'crisis', prompt: 'crisis' }
    };
  }

  function safetyPlanResponse() {
    const dua = DUAS.find(d => d.id === 'dua-trust') || DUAS[0];
    if (state.language === 'dv') {
      return {
        kind: 'crisis',
        crisis: true,
        intro: 'ސޭފްޓީ ޕްލޭނަކީ ސާފު ކޮށް ވިސްނޭ ހިނދު ހަދާ ކުރު ލިސްޓެކެވެ، ހާލަތު އުނދަގޫވާ ހިނދު ބޭނުން ކުރެވޭނެ ގޮތަށް.',
        steps: [
          'ކްރައިސިސް އެއް ހިނގަން ފެށުނީ ކަމަށް އަންގާ އިޝާރާތްތައް ލިޔެލާ.',
          'ގުޅެވޭނެ 2 މީހުން އަދި ރައްކާތެރިކަން އިހުސާސްވާ 1 ތަނެއް ލިސްޓުކުރޭ.',
          'އަމިއްލަ ނަފްސަށް ގެއްލުން ދޭނެ އެއްޗެއް ހުރިނަމަ ދުރުކޮށްލާ ނުވަތަ އެހެން މީހަކަށް ދީލާ.',
          'ކްރައިސިސް ލައިނެއް މިހާރު ފޯނުގައި ސޭވްކޮށް، މިރޭ ރައްކާތެރިވެ ހުންނަން ކުޑަ ސަބަބެއް ވެސް ހަނދާން ކުރޭ.'
        ],
        stepsTitle: 'ތިބާގެ ސޭފްޓީ ޕްލޭން',
        dua,
        comfort: 'ޕްލޭން ފުރިހަމަ ކުރަން ނުޖެހޭނެ. މިހާރަށް ތެދު އެއް ފިޔަވަޅެއް ފުދޭނެ.',
        followups: ['މިހާރު އަހަރެން ރައްކާތެރި', 'ހިތްހަމަޖެހޭ ދުޢާއެއް ދެއްވާ', 'އެހީ ހޯދުމަށް އެހީދޭ'],
        safety: 'crisis',
        context: { kind: 'crisis', prompt: 'crisis' }
      };
    }
    return {
      kind: 'crisis',
      crisis: true,
      intro: 'A safety plan is a short list you make while you can think clearly, so it is ready when things get intense.',
      steps: [
        'Write down the warning signs that tell you a crisis may be building.',
        'List two people you can contact and one place you can go that feels safer.',
        'Put away or give someone else anything you could use to hurt yourself.',
        'Save a crisis line in your phone now, and decide one small reason to stay safe tonight.'
      ],
      stepsTitle: 'Your safety plan',
      dua,
      comfort: 'You do not have to make the plan perfectly. One honest step is enough for now.',
      followups: ['I am safe right now', 'Give me a du\u2019a for calm', 'Help me find support'],
      safety: 'crisis',
      context: { kind: 'crisis', prompt: 'crisis' }
    };
  }

  function supportResponse() {
    if (state.language === 'dv') {
      return {
        kind: 'crisis',
        crisis: true,
        intro: 'އެހީ ހޯދުމަކީ ރަނގަޅު ފިޔަވަޅެކެވެ. ތަމްރީން ލިބިފައިވާ މީހަކު ރައްކާތެރިވެ ހުންނަން އަދި ދެން ކުރަންޖެހޭ ކަން ވިސްނުމަށް އެހީތެރިވެދޭނެ.',
        extraHtml: `
          <div class="chat-crisis-card">
            <a class="chat-crisis-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">ތިބާގެ ޤައުމުގައިވާ ހިލޭ ކްރައިސިސް ހެލްޕްލައިން ހޯދާ \u2197</a>
            <p class="muted">ވަގުތުން ނުރައްކާތެރި ހާލަތެއްގައި ވާނަމަ، ލޯކަލް އެމަޖެންސީ ނަމްބަރަށް ގުޅާ ނުވަތަ އެންމެ ކައިރީގައިވާ އެމަޖެންސީ ޑިޕާޓްމަންޓަށް ދާށެވެ.</p>
          </div>`,
        steps: [
          'ޔަޤީންކުރެވޭ މީހަކަށް ކޯލްކޮށް ނުވަތަ މެސެޖްކޮށް މިހާރު އެކުގައި ހުންނަން ބޭނުންވާ ކަން ބުނާށެވެ.',
          'މިއަދު ކްރައިސިސް ލައިނަކަށް، ޑޮކްޓަރަކަށް ނުވަތަ ލޯކަލް މެންޓަލް ހެލްތު ޚިދުމަތަކަށް ގުޅުއްވާ.',
          'ރާއްޖޭގައި ހުރިނަމަ، ލޯކަލް އެމަޖެންސީ ޚިދުމަތާއި ޔަޤީންކުރެވޭ ޞިއްޙީ ފަރާތަކުން ވަގުތުން އެހީ ހޯދާށެވެ.'
        ],
        stepsTitle: 'އެހީ ހޯދާ',
        comfort: 'ތިބާއަށް އެހީ ލިބިގަންނަން ހައްގުވެއެވެ، އަދި ހުރިހާ ކަމެއް ފުރިހަމައަށް ބަޔާން ކުރަން ނުޖެހޭނެ.',
        followups: ['މިހާރު އަހަރެން ރައްކާތެރި', 'ސޭފްޓީ ޕްލޭނެއް ހެދުމަށް އެހީދޭ', 'ހިތްހަމަޖެހޭ ދުޢާއެއް ދެއްވާ'],
        safety: 'crisis',
        context: { kind: 'crisis', prompt: 'crisis' }
      };
    }
    return {
      kind: 'crisis',
      crisis: true,
      intro: 'Reaching out is the right move. A trained person can help you stay safe and think through what to do next.',
      extraHtml: `
        <div class="chat-crisis-card">
          <a class="chat-crisis-link" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">Find a free crisis helpline in your country \u2197</a>
          <p class="muted">If you are in immediate danger, contact your local emergency number or go to the nearest emergency department.</p>
        </div>`,
      steps: [
        'Call or message one trusted person and tell them you need company right now.',
        'Contact a crisis line, a doctor, or a local mental health service today.',
        'If you are in the Maldives, contact local emergency services and a trusted health professional for urgent support.'
      ],
      stepsTitle: 'Reach support',
      comfort: 'You deserve care, and you do not have to explain everything perfectly to ask for it.',
      followups: ['I am safe right now', 'Help me make a safety plan', 'Give me a du\u2019a for calm'],
      safety: 'crisis',
      context: { kind: 'crisis', prompt: 'crisis' }
    };
  }

  async function composeResponse(userText) {
    const text = String(userText || '').trim();
    const t = normalizeChatText(text);

    if (detectCrisis(text)) return crisisResponse();
    if (detectAbuse(text)) return abuseResponse();

    if (lastChatContext && (lastChatContext.kind === 'crisis' || lastChatContext.kind === 'safety')) {
      if (hasAnyPhrase(t, ['safety plan', 'make a plan', 'plan to stay safe', 'make a safety plan', 'ސޭފްޓީ ޕްލޭން'])) return safetyPlanResponse();
      if (hasAnyPhrase(t, ['find support', 'talk to someone', 'need help', 'helpline', 'crisis line', 'help me find support', 'އެހީ ހޯދުމަށް'])) return supportResponse();
      if (hasAnyPhrase(t, ['safe right now', 'i am safe', "i'm safe", 'i am okay', "i'm okay", 'feeling better', 'calmer', 'calm me', "du'a for calm", 'dua for calm', 'for calm', 'feel calm', 'ރައްކާތެރި', 'ހިތްހަމަޖެހޭ ދުޢާ'])) return calmResponse();
    }

    if (isRulingQuestion(t)) return rulingResponse();
    if (isHadithQuestion(t)) return hadithResponse();
    if (isPrayerQuestion(t)) return prayerResponse();
    if (isQiblaQuestion(t)) return qiblaResponse();

    const ref = parseVerseReference(text);
    if (ref) return await verseReferenceResponse(ref, text);

    const keywords = extractKeywords(text);

    if (isGreeting(t)) return greetingResponse();
    if (isThanks(t)) return thanksResponse();
    if (isMetaQuestion(t)) return metaResponse();

    if (isStoryRequest(t)) return await storyResponse(text);
    if (isDuaRequest(t)) {
      // "Give me a du'a for this" should build on the situation already being
      // discussed, not on the words of the follow-up itself.
      if (lastChatContext && /\b(this|that)\b/.test(t)) {
        return await duaResponse(lastChatContext.keywords || [], lastChatContext.prompt || text);
      }
      return await duaResponse(keywords, text);
    }

    if (isFollowup(t)) {
      const follow = await followupResponse(t);
      if (follow) return follow;
    }

    return await guidanceResponse(text, keywords);
  }
  function lastGuidanceVerses() { return lastGuidance.verses; }

  function isDv() { return state.language === 'dv'; }

  function renderAiMessage(resp) {
    const parts = [];
    const plain = [];

    if (resp.aiText) {
      const safe = escapeHtml(resp.aiText).replace(/\n/g, '<br>');
      parts.push(`<div class="msg-lead ai-free-text">${safe}</div>`);
      plain.push(resp.aiText);
      if (resp.verse || resp.dua || resp.story) {
        parts.push(`<p class="chat-verified-note">${escapeHtml(tr('verifiedRefs'))}</p>`);
      }
    }

    if (resp.intro) {
      parts.push(`<p class="msg-lead">${escapeHtml(resp.intro)}</p>`);
      plain.push(resp.intro);
    }

    if (resp.crisis) {
      if (resp.extraHtml) parts.push(chatExtraHtml(resp));
      if (resp.steps && resp.steps.length) {
        const st = resp.stepsTitle || tr('rightNow');
        parts.push(chatStepsHtml(resp.steps, st));
        plain.push(st + ':\\n' + resp.steps.join('\\n'));
      }
      if (resp.verse) {
        parts.push(chatVerseHtml(resp.verse, { label: tr('comfortVerseLabel'), showMeaning: false }));
        plain.push(`${resp.verse.arabic}\n${resp.verse.translation}\n${resp.verse.source}`);
      }
    } else {
      if (resp.verse) {
        parts.push(chatVerseHtml(resp.verse, { label: tr('verseLabel'), showMeaning: !!resp.showMeaning }));
        plain.push(`${resp.verse.arabic}\n${resp.verse.translation}\n${resp.verse.source}`);
      }
      if (resp.story) {
        parts.push(chatStoryHtml(resp.story, !!resp.storyOpen));
        plain.push((state.language === 'dv' ? 'ވާހަކަ: ' : 'Story: ') + resp.story.title);
      }
      if (resp.extraHtml) parts.push(chatExtraHtml(resp));
      if (resp.steps && resp.steps.length) {
        const st = resp.stepsTitle || tr('practicalSteps');
        parts.push(chatStepsHtml(resp.steps, st));
        plain.push(st + ':\\n' + resp.steps.join('\\n'));
      }
    }

    if (resp.dua) {
      parts.push(`<div class="msg-section">${chatDuaHtml(resp.dua)}</div>`);
      const dMeaning = (state.language === 'dv' && resp.dua.meaning_dv) ? resp.dua.meaning_dv : (resp.dua.meaning_en || '');
      plain.push(`${resp.dua.arabic}\n${dMeaning}\n${resp.dua.source}`);
    }

    if (resp.comfort) {
      parts.push(`<div class="msg-section"><h4>${escapeHtml(tr('closingReflection'))}</h4><p class="chat-comfort">${escapeHtml(resp.comfort)}</p></div>`);
      plain.push(resp.comfort);
    }

    if (resp.followups && resp.followups.length) parts.push(chatFollowupsHtml(resp.followups));

    if (resp.safety === 'crisis') {
      parts.push(`<p class="chat-disclaimer crisis-note">${escapeHtml(tr('disclaimerCrisis'))}</p>`);
    } else if (resp.aiGenerated) {
      parts.push(`<p class="chat-disclaimer">${escapeHtml(tr('disclaimerAi'))}</p>`);
    } else {
      parts.push(`<p class="chat-disclaimer">${escapeHtml(tr('disclaimer'))}</p>`);
    }

    return { html: parts.join(''), text: plain.join('\n\n').trim() };
  }

  function addMessage(role, html, rawText = '', meta = {}) {
    const msg = {
      id: `m${Date.now()}${Math.floor(Math.random() * 10000)}`,
      role,
      html,
      text: rawText,
      ts: Date.now(),
      ...meta
    };
    state.history.push(msg);
    if (state.history.length > CHAT_HISTORY_LIMIT) {
      state.history.splice(0, state.history.length - CHAT_HISTORY_LIMIT);
    }
    saveState();
    return appendMessageEl(msg);
  }

  function appendMessageEl(msg) {
    const div = document.createElement('div');
    div.className = `msg ${msg.role}${msg.kind === 'crisis' || msg.kind === 'safety' ? ' crisis' : ''}`;
    if (msg.id) div.dataset.msgId = msg.id;
    if (msg.role === 'user') {
      div.innerHTML = `<p>${escapeHtml(msg.text || '')}</p><span class="msg-time user-time">${formatChatTime(msg.ts)}</span>`;
    } else {
      div.innerHTML = msg.html || '';
      const footer = document.createElement('div');
      footer.className = 'msg-actions';
      const copy = msg.text ? `<button type="button" class="msg-action" data-copy="${attrText(msg.text)}">${escapeHtml(tr('copy'))}</button>` : '';
      footer.innerHTML = `${copy}<button type="button" class="msg-action" data-chat-action="regenerate">${escapeHtml(tr('regenerate'))}</button><span class="msg-time">${formatChatTime(msg.ts)}</span>`;
      div.appendChild(footer);
    }
    $('#chat-messages').appendChild(div);
    return div;
  }

  function renderHistory() {
    $('#chat-messages').innerHTML = '';
    state.history.forEach(appendMessageEl);
    if (!state.history.length) {
      const intro = document.createElement('div');
      intro.className = 'msg ai';
      intro.innerHTML = `
        <p class="msg-lead">${escapeHtml(tr('chatEmpty'))}</p>
        <p class="chat-disclaimer">${escapeHtml(tr('chatPrivateNote'))}</p>`;
      $('#chat-messages').appendChild(intro);
    }
    updateChatScrollButton();
  }

  function updateChatScrollButton() {
    const btn = $('#chat-scroll');
    const wrap = $('.chat-wrap');
    if (!btn || !wrap) return;
    const distance = wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight;
    btn.classList.toggle('hidden', state.view !== 'chat' || distance < 140);
  }

  function scrollToLatestMessage(el) {
    const wrap = $('.chat-wrap');
    if (!wrap || !el) return;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    // Bring the sent message into view near the bottom, leaving a small gap.
    wrap.scrollTop += (elRect.bottom - wrapRect.bottom) + 12;
    updateChatScrollButton();
  }

  function scrollToReplyTop(el) {
    const wrap = $('.chat-wrap');
    if (!wrap || !el) return;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    // Position at the top of Noor's latest reply so reading can start there.
    wrap.scrollTop += (elRect.top - wrapRect.top) - 8;
    updateChatScrollButton();
  }

  function showTyping(text = null) {
    const label = text || tr('reflecting');
    const el = document.createElement('div');
    el.className = 'msg ai typing';
    el.setAttribute('aria-label', label);
    el.innerHTML = `<div class="typing-row"><span class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="typing-text">${escapeHtml(label)}</span></div>`;
    $('#chat-messages').appendChild(el);
    updateChatScrollButton();
    return el;
  }

  async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      return await fetch(url, { ...options, signal: controller ? controller.signal : undefined });
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  let puterLoadPromise = null;
  function loadPuter() {
    if (typeof window !== 'undefined' && window.puter && window.puter.ai && window.puter.ai.chat) return Promise.resolve(window.puter);
    if (typeof location !== 'undefined' && location.protocol === 'file:') return Promise.resolve(null);
    if (typeof location !== 'undefined' && location.protocol !== 'http:' && location.protocol !== 'https:') return Promise.resolve(null);
    if (puterLoadPromise) return puterLoadPromise;
    puterLoadPromise = new Promise(resolve => {
      try {
        const existing = document.querySelector('script[data-noor-puter="1"]');
        if (existing) {
          existing.addEventListener('load', () => resolve(window.puter || null), { once: true });
          existing.addEventListener('error', () => resolve(null), { once: true });
          return;
        }
        const s = document.createElement('script');
        s.src = 'https://js.puter.com/v2/';
        s.async = true;
        s.defer = true;
        s.dataset.noorPuter = '1';
        s.onload = () => resolve(window.puter || null);
        s.onerror = () => resolve(null);
        document.head.appendChild(s);
        setTimeout(() => resolve(window.puter || null), 8000);
      } catch (e) {
        resolve(null);
      }
    });
    return puterLoadPromise;
  }

  function extractPuterText(result) {
    if (!result) return '';
    if (typeof result === 'string') return result;
    if (typeof result.toString === 'function' && result.toString !== Object.prototype.toString) {
      const s = String(result.toString());
      if (s && s !== '[object Object]') return s;
    }
    if (result.message && typeof result.message.content === 'string') return result.message.content;
    if (result.message && Array.isArray(result.message.content)) {
      return result.message.content.map(p => (p && (p.text || p.content)) || '').join('');
    }
    if (typeof result.text === 'string') return result.text;
    return '';
  }

  async function requestPuterAI(messages) {
    try {
      const puter = await loadPuter();
      if (!puter || !puter.ai || !puter.ai.chat) return null;
      const result = await Promise.race([
        puter.ai.chat(messages, { model: 'gpt-4o-mini' }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 18000))
      ]);
      const text = String(extractPuterText(result) || '').trim();
      return text.length > 20 ? text : null;
    } catch (e) {
      try {
        const puter = window.puter;
        if (!puter || !puter.ai || !puter.ai.chat) return null;
        const result = await Promise.race([
          puter.ai.chat(messages),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 18000))
        ]);
        const text = String(extractPuterText(result) || '').trim();
        return text.length > 20 ? text : null;
      } catch (e2) {
        return null;
      }
    }
  }

  function aiVerifiedContext(resp) {
    if (!resp) return 'None.';
    const lines = [];
    if (resp.verse) {
      lines.push(`Verse: ${resp.verse.source}`);
      lines.push(`Arabic: ${resp.verse.arabic}`);
      lines.push(`Translation: ${resp.verse.translation}`);
      if (resp.verse.meaning) lines.push(`Meaning note: ${resp.verse.meaning}`);
    }
    if (resp.dua) {
      lines.push(`Du'a: ${resp.dua.title} (${resp.dua.source})`);
      lines.push(`Arabic: ${resp.dua.arabic}`);
      if (resp.dua.transliteration) lines.push(`Transliteration: ${resp.dua.transliteration}`);
      if (resp.dua.meaning_en) lines.push(`Meaning: ${resp.dua.meaning_en}`);
    }
    if (resp.story) {
      lines.push(`Story: ${resp.story.title}`);
      if (resp.story.lessons && resp.story.lessons.length) lines.push(`Lessons: ${resp.story.lessons.slice(0, 3).join(' | ')}`);
    }
    if (resp.extraTitle) lines.push(`Extra: ${resp.extraTitle}`);
    return lines.length ? lines.join('\n') : 'None.';
  }

  async function requestFreeAI(userText, localResp) {
    if (state.aiMode !== 'free') return null;
    if (localResp && (localResp.crisis || localResp.kind === 'ruling' || localResp.kind === 'prayer' || localResp.kind === 'qibla' || localResp.kind === 'safety')) return null;

    const history = state.history.slice(-6).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: String(m.text || '').slice(0, 800)
    })).filter(m => m.content);
    // Avoid duplicating the current user message if it was already added.
    if (history.length && history[history.length - 1].role === 'user') history.pop();

    const system = [
      'You are Noor, a gentle Islamic reflection companion in a mobile app.',
      'Be warm, concise, and respectful. Reply in plain text (short paragraphs or simple bullet points).',
      'Do not issue fatwas or definitive religious rulings. Do not claim to be a scholar, therapist, doctor, or crisis professional.',
      'Do not fabricate, guess, or paraphrase as exact: Quran verses, hadith, scholarly opinions, or sources.',
      'If verified references are provided below, you may refer to them by their exact reference/source only. Do not add or quote any other Quran/hadith text.',
      'If the user asks for a ruling, explain that you cannot give a ruling and suggest consulting a qualified local scholar.',
      'If there are signs of self-harm, abuse, or immediate danger, encourage contacting emergency services and trusted local support.',
      'Keep the response focused and helpful (usually 80-180 words).',
      '',
      'Verified references selected by the app (use these if relevant; do not invent others):',
      aiVerifiedContext(localResp)
    ].join('\n');

    const messages = [{ role: 'system', content: system }, ...history, { role: 'user', content: String(userText || '').slice(0, 1200) }];

    // 1) Try Puter.js (browser free AI) if available/loadable.
    const puterText = await requestPuterAI(messages);
    if (puterText) return puterText;

    if (typeof fetch !== 'function') return null;
    const body = JSON.stringify({ model: 'openai', messages, temperature: 0.7 });

    const endpoints = [
      'https://text.pollinations.ai/openai/chat/completions',
      'https://text.pollinations.ai/openai',
      'https://text.pollinations.ai/'
    ];

    for (const url of endpoints) {
      try {
        const res = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        }, 15000);
        if (!res.ok) continue;
        const contentType = res.headers.get('content-type') || '';
        let text = '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          text = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content)
            || (data && data.message && data.message.content)
            || (typeof data === 'string' ? data : '');
        } else {
          text = await res.text();
        }
        text = String(text || '').trim();
        if (text && text.length > 20) return text;
      } catch (e) {
        // try next endpoint
      }
    }

    try {
      const prompt = `${system}\n\nUser: ${String(userText || '').slice(0, 1200)}\n\nNoor:`;
      const res = await fetchWithTimeout(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`, {}, 15000);
      if (res.ok) {
        const text = String(await res.text() || '').trim();
        if (text && text.length > 20) return text;
      }
    } catch (e) {}

    return null;
  }

  function applyFreeAiText(localResp, aiText) {
    const resp = { ...localResp };
    resp.aiText = String(aiText || '').trim();
    resp.aiGenerated = true;
    // Keep verified cards/followups/context, but let AI carry the main message.
    resp.intro = '';
    resp.steps = null;
    resp.comfort = '';
    resp.extraHtml = resp.extraHtml || '';
    return resp;
  }

  function setChatBusy(busy) {
    const form = $('#chat-form');
    if (form) form.classList.toggle('is-busy', busy);
    const btn = form && form.querySelector('.send-btn');
    if (btn) btn.disabled = busy;
    const input = $('#chat-input');
    if (input) input.setAttribute('aria-disabled', busy ? 'true' : 'false');
  }

  async function generateReply(value) {
    if (chatBusy) return;
    chatBusy = true;
    setChatBusy(true);
    const typing = showTyping();
    try {
      const localResp = await composeResponse(value);
      let resp = localResp;
      const canEnhance = state.aiMode === 'free' && localResp && !localResp.crisis && !['ruling', 'prayer', 'qibla', 'safety', 'hadith'].includes(localResp.kind);
      if (canEnhance) {
        const t = typing.querySelector('.typing-text');
        if (t) t.textContent = tr('thinking');
        const aiText = await requestFreeAI(value, localResp);
        if (aiText) resp = applyFreeAiText(localResp, aiText);
      }
      typing.remove();
      const rendered = renderAiMessage(resp);
      const aiEl = addMessage('ai', rendered.html, rendered.text, { kind: resp.kind, aiGenerated: !!resp.aiGenerated });
      if (resp.context) lastChatContext = resp.context;
      renderGuidance();
      scrollToReplyTop(aiEl);
    } catch (err) {
      console.error('Noor: could not build guidance response', err);
      typing.remove();
      const fallback = renderAiMessage({
        kind: 'fallback',
        intro: 'I\u2019m sorry \u2014 I could not prepare the full response just now. Please try again, or rephrase your message. If this keeps happening, reload the app.',
        steps: ['Try a shorter message, or ask for a verse about a specific topic.', 'You can also explore the Quranic Guidance, Stories, and Duas sections.'],
        followups: ['Show me a verse about patience', 'What can you do?'],
        safety: true
      });
      const aiEl = addMessage('ai', fallback.html, fallback.text, { kind: 'fallback' });
      scrollToReplyTop(aiEl);
    } finally {
      chatBusy = false;
      setChatBusy(false);
      updateChatScrollButton();
    }
  }

  async function submitChat(text) {
    const value = (text ?? $('#chat-input').value).trim();
    if (!value || chatBusy) return;
    let userEl = null;
    try {
      userEl = addMessage('user', '', value);
    } catch (e) {
      console.warn('Noor: could not add user message', e);
    }
    if (userEl) scrollToLatestMessage(userEl);
    $('#chat-input').value = '';
    autoGrow($('#chat-input'));
    await generateReply(value);
  }

  async function regenerateResponse() {
    if (chatBusy) return;
    let aiIdx = -1;
    for (let i = state.history.length - 1; i >= 0; i--) {
      if (state.history[i].role === 'ai') { aiIdx = i; break; }
    }
    if (aiIdx < 0) return;
    let user = null;
    for (let i = aiIdx - 1; i >= 0; i--) {
      if (state.history[i].role === 'user') { user = state.history[i]; break; }
    }
    if (!user || !user.text) return;
    const prevCtx = lastChatContext;
    state.history.splice(aiIdx, 1);
    saveState();
    renderHistory();
    lastChatContext = null;
    regenExcludeVerseId = prevCtx && prevCtx.verseId ? prevCtx.verseId : null;
    regenExcludeGlobal = prevCtx && prevCtx.verseGlobal ? prevCtx.verseGlobal : null;
    await generateReply(user.text);
  }

  async function copyChatText(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast(tr('copied'));
    } catch (e) {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
        showToast(tr('copied'));
      } catch (e2) {
        showToast(tr('copyFail'));
      }
    }
  }

  async function openQuranAyah(surah, ayah) {
    try {
      if (!Array.isArray(window.QURAN_TEXT)) await loadQuranText();
    } catch (e) {
      showToast('Could not load the Quran text.');
      return;
    }
    showView('quran');
    openSurah(Number(surah));
    const target = parseInt(String(ayah || ''), 10);
    if (Number.isFinite(target)) {
      setTimeout(() => {
        const el = document.querySelector(`#quran-ayahs [data-ayah="${target}"]`);
        if (!el) return;
        el.classList.add('ayah-target');
        if (el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => el.classList.remove('ayah-target'), 3200);
      }, 140);
    }
  }
  window.__openQuranAyah = openQuranAyah;

  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  function bindEvents() {
    $('#btn-start').addEventListener('click', () => {
      localStorage.setItem('noor_onboarded', '1');
      $('#main-shell').classList.remove('hidden');
      showScreen('splash'); // hide others by switching
      $$('.screen').forEach(s => s.classList.remove('active'));
      $('#screen-splash').classList.remove('active');
      $('#screen-onboarding').classList.remove('active');
      // show shell only
      $('.shell').classList.remove('hidden');
      showView('home');
    });

    $$('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.save-btn, button.save-btn, a, select, input, textarea')) return;
        showView(el.dataset.nav);
      });
      el.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && el.dataset.nav) { e.preventDefault(); showView(el.dataset.nav); }
      });
    });
    $('#btn-theme').addEventListener('click', () => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); saveState(); });
    $('#setting-theme').addEventListener('change', e => { state.theme = e.target.value; applyTheme(); saveState(); });
    const aiModeSetting = $('#setting-ai-mode');
    if (aiModeSetting) {
      aiModeSetting.addEventListener('change', e => {
        state.aiMode = e.target.value === 'local' ? 'local' : 'free';
        saveState();
        updateAiModeUi();
        showToast(state.aiMode === 'free' ? 'Free AI replies enabled' : 'Local companion enabled');
      });
    }
    $('#setting-language').addEventListener('change', e => {
      state.language = e.target.value;
      saveState();
      applyLanguage();
      renderPrompts();
      renderHistory();
    });

    $('#chat-form').addEventListener('submit', e => { e.preventDefault(); submitChat(); });
    $('#chat-input').addEventListener('input', e => autoGrow(e.target));
    $('#chat-input').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitChat(); }
    });

    const chatMessages = $('#chat-messages');
    if (chatMessages) {
      chatMessages.addEventListener('click', e => {
        const follow = e.target.closest('[data-followup]');
        if (follow) { submitChat(follow.dataset.followup); return; }
        const nav = e.target.closest('[data-chat-nav]');
        if (nav) { showView(nav.dataset.chatNav); return; }
        const open = e.target.closest('[data-open-surah]');
        if (open) { openQuranAyah(open.dataset.openSurah, open.dataset.openAyah); return; }
        const copy = e.target.closest('[data-copy]');
        if (copy) { copyChatText(copy.dataset.copy); return; }
        const action = e.target.closest('[data-chat-action]');
        if (action && action.dataset.chatAction === 'regenerate') regenerateResponse();
      });
    }
    const chatWrap = $('.chat-wrap');
    if (chatWrap) chatWrap.addEventListener('scroll', updateChatScrollButton, { passive: true });
    const scrollBtn = $('#chat-scroll');
    if (scrollBtn) scrollBtn.addEventListener('click', () => {
      scrollChatToBottom();
      const input = $('#chat-input');
      if (input) input.focus({ preventScroll: true });
    });

    $('#dua-search').addEventListener('input', () => {
      duaLimit = 24;
      renderDuas();
    });

    const quranSearch = $('#quran-search');
    if (quranSearch) quranSearch.addEventListener('input', e => {
      quranQuery = e.target.value;
      renderQuranList();
    });
    const quranBack = $('#quran-back');
    if (quranBack) quranBack.addEventListener('click', showQuranList);
    const quranNavList = $('#quran-nav-list');
    if (quranNavList) quranNavList.addEventListener('click', showQuranList);
    const quranMeaningToggle = $('#quran-meaning');
    if (quranMeaningToggle) {
      quranMeaningToggle.addEventListener('change', e => setQuranMeaning(e.target.checked));
    }
    const fontDown = $('#quran-font-down');
    if (fontDown) fontDown.addEventListener('click', () => setQuranFont(-2));
    const fontUp = $('#quran-font-up');
    if (fontUp) fontUp.addEventListener('click', () => setQuranFont(2));
    $$('#ayah-sheet [data-sheet-close]').forEach(el => el.addEventListener('click', closeAyahSheet));

    // ----- Quran recitation -----
    const reciterSelects = [
      { el: $('#quran-reciter'), label: r => r.short },
      { el: $('#quran-reciter-sheet'), label: r => r.name }
    ];
    reciterSelects.forEach(({ el, label }) => {
      if (!el) return;
      el.innerHTML = QURAN_RECITERS.map(r => `<option value="${r.id}">${escapeHtml(label(r))}</option>`).join('');
      el.value = quranReciter;
      el.addEventListener('change', e => setQuranReciter(e.target.value));
    });
    const playBtn = $('#quran-play');
    if (playBtn) playBtn.addEventListener('click', toggleQuranAudio);
    const playBig = $('#quran-play-big');
    if (playBig) playBig.addEventListener('click', toggleQuranAudio);
    const audioOpen = $('#quran-audio-open');
    if (audioOpen) audioOpen.addEventListener('click', openAudioSheet);
    const audioPrevBtn = $('#quran-audio-prev');
    if (audioPrevBtn) audioPrevBtn.addEventListener('click', audioPrev);
    const audioNextBtn = $('#quran-audio-next');
    if (audioNextBtn) audioNextBtn.addEventListener('click', audioNext);
    $$('[data-audio-close]').forEach(el => el.addEventListener('click', closeAudioSheet));
    $$('[data-qibla-close]').forEach(el => el.addEventListener('click', closeQiblaSheet));
    const qiblaEnableBtn = $('#qibla-enable');
    if (qiblaEnableBtn) qiblaEnableBtn.addEventListener('click', enableQiblaCompass);
    const quickQibla = $('#quick-qibla');
    if (quickQibla) quickQibla.addEventListener('click', () => {
      const hadLocation = !!prayerCoordinates();
      showView('prayer');
      if (hadLocation) setTimeout(openQiblaSheet, 180);
      else showToast('Choose your city to unlock the Qibla compass.');
    });
    const repeatToggle = $('#quran-audio-repeat');
    if (repeatToggle) {
      repeatToggle.checked = audioState.repeat;
      repeatToggle.addEventListener('change', e => {
        audioState.repeat = e.target.checked;
        try { localStorage.setItem('noor_quran_repeat', audioState.repeat ? '1' : '0'); } catch (err) {}
        syncAudioUI();
      });
    }
    const seek = $('#quran-audio-seek');
    if (seek) {
      seek.addEventListener('pointerdown', () => { audioSeeking = true; });
      seek.addEventListener('input', () => {
        audioSeeking = true;
        const current = $('#quran-audio-current');
        if (current) current.textContent = formatTime(seek.value);
      });
      seek.addEventListener('change', () => {
        if (audioEl) {
          const t = Number(seek.value);
          if (isFinite(t)) audioEl.currentTime = t;
        }
        audioSeeking = false;
        updateAudioProgress();
      });
      seek.addEventListener('pointerup', () => { audioSeeking = false; });
    }
    const ayahPlay = $('#ayah-sheet-play');
    if (ayahPlay) ayahPlay.addEventListener('click', () => {
      const surah = (window.QURAN_TEXT || []).find(s => s.number === quranCurrent);
      if (!surah || sheetAyah == null) return;
      const index = surah.ayahs.findIndex(a => a.n === sheetAyah);
      if (index < 0) return;
      closeAyahSheet();
      loadQuranAyah(index, true, false);
      openAudioSheet();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeAyahSheet(); closeAudioSheet(); closeQiblaSheet(); }
    });

    document.addEventListener('visibilitychange', () => {
      if (!qiblaSheetOpen) return;
      if (document.hidden) stopQiblaSensors();
      else startQiblaSensors();
    });

    $('#btn-clear-history').addEventListener('click', () => {
      if (confirm('Delete all chat history on this device?')) {
        state.history = [];
        lastGuidance = { verses: [], stories: [], duas: [] };
        saveState();
        renderHistory();
        renderGuidance();
      }
    });
    $('#btn-clear-saved').addEventListener('click', () => {
      if (confirm('Clear all saved verses, stories, and duas?')) {
        state.saved = { verses: [], stories: [], duas: [] };
        saveState();
        renderSaved();
        renderGuidance();
        renderStories();
        renderDuas();
      }
    });
  }

  function init() {
    applyTheme();
    applyQuranMeaning();
    applyQuranFont();
    $('#setting-language').value = state.language;
    if ($('#setting-ai-mode')) $('#setting-ai-mode').value = state.aiMode || 'free';
    applyLanguage();
    renderPrompts();
    renderStories();
    renderDuas();
    renderDuaFilters();
    renderGuidance();
    renderDaily();
    renderHistory();
    bindEvents();
    syncAudioUI();
    startPrayerClock();
    if (hasPrayerLocation() && !activePrayerCache()) fetchPrayerTimes();

    // Splash -> onboarding/main
    setTimeout(() => {
      const onboarded = localStorage.getItem('noor_onboarded') === '1';
      $('#screen-splash').classList.remove('active');
      if (onboarded) {
        $('#main-shell').classList.remove('hidden');
        $$('.screen').forEach(s => s.classList.remove('active'));
        showView('home');
      } else {
        showScreen('onboarding');
      }
    }, 1400);
  }

  init();
})();
