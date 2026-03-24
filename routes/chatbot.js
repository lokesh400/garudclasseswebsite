const express = require('express')
const router = express.Router()

// ─── Knowledge Base for Garud Classes ─────────────────────────────────────────
// Each entry has an array of trigger patterns and a response.
// The engine does a lowercase substring match against the user message.
const knowledgeBase = [

  // ══════════════════════════════════════════════════════════════════════
  // GREETINGS & GENERAL
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'hello', 'hi ', 'hi!', 'hey', 'hii', 'helo', 'helo there', 'hey there',
      'good morning', 'good afternoon', 'good evening', 'good night',
      'good day', 'greetings', 'howdy', 'sup ', 'wassup', 'what\'s up',
      'namaste', 'namaskar', 'sat sri akaal', 'jai hind', 'pranam',
      'how are you', 'how r u', 'how do you do', 'hope you are well',
      'hola', 'bonjour', 'salut', 'hi there', 'hello there',
      'anyone there', 'is anyone there', 'anybody there'
    ],
    response: `👋 Hello! Welcome to **Garud Classes**!\n\nI'm your virtual assistant. I can help you with:\n• 📚 Courses & Admissions\n• 👨‍🏫 Faculty Information\n• 📞 Contact Details\n• 🏆 Results & Achievements\n• 🕐 Batch Timings\n• 💰 Fee Enquiry\n• 📝 Test Portal & Study Material\n\nHow can I assist you today?`
  },
  {
    patterns: [
      'i am fine', 'i\'m fine', 'i am good', 'i\'m good', 'doing well',
      'all good', 'great thanks', 'not bad', 'i\'m okay', 'i am okay',
      'pretty good', 'i\'m great', 'i am great'
    ],
    response: `😊 That's wonderful to hear!\n\nHow can I help you today? Whether it's about **JEE**, **NEET**, **admissions**, **fees**, or anything else — I'm here for you! 🎓`
  },
  {
    patterns: [
      'who are you', 'what are you', 'are you a bot', 'are you human',
      'are you real', 'are you a robot', 'are you ai', 'are you chatgpt',
      'which bot are you', 'what is your name', 'whats your name',
      'introduce yourself', 'tell me about yourself'
    ],
    response: `🤖 I'm the **Garud Classes Virtual Assistant** — a smart chatbot here to answer all your questions about our coaching institute!\n\nI can help you with:\n• Courses, admissions & fees\n• Faculty, results & gallery\n• Batch timings & study material\n• Test portal & store\n\nAsk me anything! 😊`
  },
  {
    patterns: [
      'thank', 'thanks', 'thank you', 'thankyou', 'thank u', 'thnx',
      'thx', 'ty', 'many thanks', 'much appreciated', 'great job',
      'well done', 'good job', 'nice work', 'perfect', 'excellent',
      'wonderful', 'amazing', 'brilliant', 'superb', 'fantastic',
      'you are helpful', 'very helpful', 'that helped', 'that was helpful',
      'got it', 'understood', 'i see', 'okay got it', 'ok got it'
    ],
    response: `😊 You're most welcome! It's my pleasure to help you.\n\nIf you have any more questions, feel free to ask anytime!\n\nFor personal guidance, call us at 📞 **+91 98969 13009** or email **info@garudclasses.com**. **All the best!** 🌟`
  },
  {
    patterns: [
      'bye', 'goodbye', 'good bye', 'see you', 'see ya', 'take care',
      'ok bye', 'okay bye', 'cya', 'later', 'ttyl', 'talk to you later',
      'have a good day', 'have a nice day', 'have a great day',
      'i\'m leaving', 'i am leaving', 'got to go', 'gotta go',
      'exit', 'quit', 'close', 'end chat', 'stop'
    ],
    response: `👋 **Goodbye!**\n\nThank you for visiting Garud Classes. We wish you great success in your exams! 🏆\n\nFeel free to chat anytime. **Best of luck!** 🌟`
  },
  {
    patterns: [
      'help', 'i need help', 'can you help', 'help me', 'what can you do',
      'what do you know', 'what can i ask', 'guide me', 'assist me',
      'i have a question', 'i have questions', 'i want to know',
      'tell me something', 'give me information', 'i need information'
    ],
    response: `🙋 Sure, I'm here to help!\n\nYou can ask me about:\n\n📚 **Courses** – JEE, NEET, Foundation, Board, NTSE\n✅ **Admissions** – Process, eligibility, documents\n💰 **Fees** – Fee structure, scholarships, EMI\n🕐 **Batches** – Timing, days, new batches\n👨‍🏫 **Faculty** – Teachers, qualifications\n🏆 **Results** – Toppers, selections\n📞 **Contact** – Phone, email, address\n📝 **Test Portal** – Online tests, mock exams\n🛍️ **Store** – Books, notes, study material\n\nJust type your question!`
  },
  {
    patterns: [
      'ok', 'okay', 'alright', 'sure', 'yes', 'yeah', 'yep', 'yup',
      'fine', 'no problem', 'i understand', 'noted', 'roger', 'hmm', 'oh', 'ah'
    ],
    response: `👍 Great! Feel free to ask me anything about **Garud Classes**.\n\nWhat would you like to know? I can help with courses, admissions, fees, batches, faculty, results, and more! 😊`
  },

  // ══════════════════════════════════════════════════════════════════════
  // ABOUT GARUD CLASSES
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'about garud', 'about garud classes', 'what is garud classes',
      'tell me about garud', 'garud classes kya hai', 'what is this institute',
      'who founded', 'when was it founded', 'history of garud',
      'garud classes history', 'background of garud', 'origin',
      'about the institute', 'about this coaching', 'what is this place',
      'why garud classes', 'what makes garud special', 'is garud good',
      'garud classes review', 'garud classes feedback', 'is it a good institute',
      'mission', 'vision', 'values', 'our mission', 'our vision'
    ],
    response: `🦅 **About Garud Classes**\n\nGarud Classes is a **premier coaching institute** dedicated to helping students excel in JEE, NEET, and Board exams.\n\n🎯 **Mission:** Empowering students to soar to new heights with quality education, expert guidance, and proven results.\n\n🌟 **Why Choose Garud Classes?**\n• Expert faculty (IIT/NIT & top-university alumni)\n• Personalised attention to every student\n• Proven track record of outstanding results\n• State-of-the-art study environment\n• Comprehensive study material\n• Regular tests & performance tracking\n• Student-first approach\n\nLearn more at [/about](/about). 🎓`
  },
  {
    patterns: [
      'is garud classes good', 'is it worth joining', 'should i join',
      'recommend garud', 'garud classes reliable', 'trustworthy',
      'reputation', 'popular', 'best coaching', 'top coaching',
      'famous coaching', 'well known', 'is it famous'
    ],
    response: `🌟 **Yes, absolutely!**\n\nGarud Classes is known for:\n• **Consistent Results** – Students clearing JEE & NEET every year\n• **Expert Faculty** – Highly qualified and experienced teachers\n• **Personalised Mentoring** – Individual attention for every student\n• **Affordable Fees** – Quality education at reasonable rates\n• **Holistic Growth** – Academic + personality development\n\nJoin thousands of successful students! 🏆\n\nCall 📞 **+91 98969 13009** to book a free counselling session.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // COURSES – GENERAL
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'course', 'courses', 'all courses', 'list of courses',
      'what courses', 'which courses', 'courses available',
      'courses offered', 'what do you offer', 'what do you teach',
      'what subjects', 'program', 'programs', 'class', 'classes offered',
      'what can i study', 'what to study here', 'tell me about courses',
      'courses list', 'coaching available', 'subjects available'
    ],
    response: `📚 **Courses Offered at Garud Classes:**\n\n🔬 **JEE Main & Advanced** – Class 11, 12 & Droppers\n💊 **NEET UG** – Class 11, 12 & Droppers\n🎓 **Foundation (Class 8–10)** – Build strong concepts early\n📗 **Board Exam Prep** – CBSE & State Board excellence\n⭐ **NTSE / Olympiad** – Competitive scholarship coaching\n\nEach course comes with:\n✅ Expert faculty\n✅ Comprehensive study material\n✅ Regular tests & doubt sessions\n✅ Performance tracking\n\nVisit [/courses](/courses) or call 📞 **+91 98969 13009** for details!`
  },
  {
    patterns: [
      'which is the best course', 'which course should i take',
      'which course is right for me', 'recommend a course',
      'which stream', 'should i take science', 'which field',
      'what to choose', 'help me choose course', 'course guidance',
      'course counselling', 'which class to join', 'confused about course'
    ],
    response: `🧭 **Course Guidance**\n\nChoosing the right course depends on your goal:\n\n🔬 **Want to be an Engineer?** → Join **JEE Main & Advanced**\n💊 **Want to be a Doctor?** → Join **NEET UG**\n🎓 **In Class 8–10?** → Join **Foundation Course**\n📗 **Need Board help?** → Join **Board Exam Prep**\n⭐ **Want scholarship?** → Join **NTSE / Olympiad**\n\nFor personalised counselling, call 📞 **+91 98969 13009** — our experts will guide you to the best path! 🎯`
  },

  // ══════════════════════════════════════════════════════════════════════
  // JEE
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'jee', 'iit', 'jee main', 'jee advanced', 'iit jee', 'iit coaching',
      'jee coaching', 'iit preparation', 'jee preparation', 'jee prep',
      'engineering entrance', 'b.tech entrance', 'btech entrance',
      'engineering coaching', 'nit coaching', 'jee mains', 'jee adv',
      'jee syllabus', 'jee eligibility', 'jee pattern', 'jee exam',
      'jee 2025', 'jee 2026', 'jee 2027', 'crack jee', 'how to crack jee',
      'jee tips', 'jee strategy', 'jee rank', 'jee score', 'jee marks',
      'jee paper', 'jee attempt', 'jee attempts', 'jee age limit',
      'qualify jee', 'clear jee', 'pass jee', 'jee cutoff',
      'jee preparation tips', 'best way to prepare jee', 'jee books',
      'jee study material', 'jee physics', 'jee chemistry', 'jee maths',
      'jee mathematics', 'jee pcm', 'engineering student', 'iit dream'
    ],
    response: `🔬 **JEE Main & Advanced Coaching at Garud Classes**\n\n**Programs Available:**\n• 2-Year Program (Class 11 start)\n• 1-Year Program (Class 12 start)\n• Dropper / Repeater Intensive Batch\n\n**What's Included:**\n✅ Expert faculty with IIT/NIT background\n✅ Physics, Chemistry & Mathematics depth coverage\n✅ Chapter-wise & full mock tests\n✅ Doubt-clearing sessions (daily)\n✅ Comprehensive study material\n✅ Performance analytics & parent updates\n✅ Motivational sessions & exam strategy\n\n**JEE Main** – 2 attempts/year (Jan & Apr), 75% in Class 12 required\n**JEE Advanced** – Top 2.5 lakh JEE Main qualifiers eligible\n\nFor admission/details: 📞 **+91 98969 13009** | [/courses](/courses)`
  },
  {
    patterns: [
      'is jee tough', 'how hard is jee', 'jee difficulty', 'jee level',
      'can i crack jee', 'can an average student crack jee',
      'how many hours to study for jee', 'jee study hours',
      'how to prepare for jee in 1 year', 'jee in one year',
      'jee in 2 years', 'jee short trick', 'jee quick tips',
      'jee rank predictor', 'jee percentile', 'jee nta score'
    ],
    response: `💡 **About JEE Difficulty & Preparation**\n\nJEE is competitive but **absolutely conquerable** with the right guidance!\n\n✅ **Average students** can crack JEE with consistent effort\n✅ Recommended study: **8–10 hours/day** in dedicated preparation\n✅ Focus on **NCERT + advanced problem-solving**\n✅ Revise regularly and take **mock tests weekly**\n\n**At Garud Classes**, our structured program has helped many students go from average to IIT! 🏆\n\nJoin us and let our experts guide your JEE journey.\n📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // NEET
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'neet', 'medical', 'mbbs', 'neet ug', 'medical entrance',
      'doctor', 'become a doctor', 'neet coaching', 'neet preparation',
      'neet prep', 'neet syllabus', 'neet eligibility', 'neet pattern',
      'neet exam', 'neet 2025', 'neet 2026', 'crack neet',
      'how to crack neet', 'neet tips', 'neet strategy', 'neet rank',
      'neet score', 'neet marks', 'neet paper', 'neet cutoff',
      'neet books', 'neet study material', 'neet biology',
      'neet physics', 'neet chemistry', 'pcb', 'neet pcb',
      'medical student', 'aiims', 'bds', 'nursing entrance',
      'neet attempt', 'neet age limit', 'neet qualify', 'clear neet',
      'pass neet', 'neet rank predictor', 'neet percentile',
      'best neet coaching', 'top neet coaching', 'neet preparation tips'
    ],
    response: `💊 **NEET UG Coaching at Garud Classes**\n\n**Programs Available:**\n• 2-Year Program (Class 11 start)\n• 1-Year Program (Class 12 start)\n• Dropper / Repeater Intensive Batch\n\n**What's Included:**\n✅ Biology, Physics & Chemistry specialists\n✅ NCERT-focused comprehensive approach\n✅ Chapter-wise tests + full mock tests\n✅ Daily doubt-clearing sessions\n✅ 800+ hours of classroom teaching\n✅ Previous year papers analysis\n✅ Performance reports & parent meetings\n\n**NEET UG** – Single exam per year, 50% in Class 12 (PCB) required, age: 17–25 years\n\nFor admission: 📞 **+91 98969 13009** | [/courses](/courses)`
  },
  {
    patterns: [
      'is neet tough', 'how hard is neet', 'neet difficulty', 'neet level',
      'can i crack neet', 'average student neet', 'neet study hours',
      'how to prepare neet in 1 year', 'neet in one year',
      'neet short trick', 'ncert enough for neet', 'neet ncert',
      'neet biology important', 'neet biology weightage',
      'how many attempts neet', 'neet unlimited attempts',
      'neet 6 attempts', 'neet total attempts'
    ],
    response: `💡 **About NEET Difficulty & Preparation**\n\nNEET requires **dedication and smart preparation** — not just hard work!\n\n✅ **NCERT is the backbone** — master it first\n✅ **Biology** carries the most marks (360 of 720)\n✅ **Recommended study:** 9–10 hours/day near exam\n✅ **Mock tests** every week are essential\n✅ No attempt limit under current NTA rules\n\n**At Garud Classes**, our students have achieved top NEET ranks!\n\nCall us for a **free counselling session**: 📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // FOUNDATION (CLASS 8–10)
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'foundation', 'class 8', 'class 9', 'class 10', '8th', '9th', '10th',
      'middle school', 'class viii', 'class ix', 'class x', '8th class',
      '9th class', '10th class', 'for class 8', 'for class 9', 'for class 10',
      'junior classes', 'junior batch', 'foundation course', 'foundation class',
      'my child is in class 8', 'my child is in 9', 'my child is in 10',
      'young student', 'early preparation', 'early start',
      'foundation for jee', 'foundation for neet', 'class 8 to 10',
      'school student coaching'
    ],
    response: `🎓 **Foundation Course (Class 8–10)**\n\n**Build rock-solid fundamentals early!**\n\n**Who is it for?**\n• Students in Class 8, 9 & 10\n• Those aiming for JEE/NEET later\n• Students who want strong Board results\n\n**What you'll learn:**\n✅ Mathematics (Algebra, Geometry, Trigonometry basics)\n✅ Science (Physics, Chemistry, Biology)\n✅ Logical Reasoning & Mental Ability\n✅ CBSE / State Board curriculum covered\n✅ Preparation for school competitive exams\n\n**Benefits:**\n🏆 Strong foundation = Better JEE/NEET results later\n📈 Improved school performance\n⭐ NTSE & Olympiad readiness\n\nCall 📞 **+91 98969 13009** for batch details!`
  },

  // ══════════════════════════════════════════════════════════════════════
  // BOARD EXAMS
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'board exam', 'board result', 'board preparation', 'class 12 board',
      'class 11 board', '12th board', '11th board', 'cbse board',
      'state board', 'board coaching', 'board course', 'board batch',
      '10th board', '12th result', 'board marks', 'board score',
      'improve board marks', 'score well in boards', 'board study material',
      'cbse preparation', 'cbse coaching', 'hse', 'class 12 preparation',
      'class 12 coaching', '12th coaching', '11th coaching',
      'class 11 preparation', 'pcm coaching', 'pcb coaching',
      'science stream', 'commerce stream', 'arts stream',
      'all subjects', 'english coaching', 'hindi coaching'
    ],
    response: `📗 **Board Exam Preparation at Garud Classes**\n\nWe help students score **top marks** in CBSE & State Board exams!\n\n**Available For:**\n• Class 11 & 12 – Science (PCM / PCB)\n• Class 10 – All Subjects\n\n**Features:**\n✅ NCERT & board syllabus fully covered\n✅ Chapter-wise tests after each topic\n✅ Previous year paper solving sessions\n✅ Sample paper practice\n✅ Last-minute revision tips\n✅ Time management strategies\n\n**Our students consistently score 90%+ in boards!** 🎯\n\nCall 📞 **+91 98969 13009** to join the next batch.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // NTSE / OLYMPIAD / SCHOLARSHIP EXAM
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'ntse', 'olympiad', 'kvpy', 'scholarship exam', 'scholarship test',
      'competition', 'competitive exam', 'scholarship coaching',
      'olympiad coaching', 'math olympiad', 'science olympiad',
      'imo', 'nso', 'nco', 'ifa', 'hbcse', 'regional olympiad',
      'national olympiad', 'international olympiad', 'medal',
      'gold medal', 'silver medal', 'talent exam', 'talent search',
      'national talent', 'ntse preparation', 'ntse coaching',
      'olympiad preparation', 'scholastic aptitude', 'sof'
    ],
    response: `⭐ **NTSE & Olympiad Coaching**\n\n**Exams We Prepare For:**\n• NTSE (National Talent Search Exam)\n• IMO (International Mathematics Olympiad)\n• NSO (National Science Olympiad)\n• NCO & IEO (Cyber & English Olympiad)\n• KVPY (Kishore Vaigyanik Protsahan Yojana)\n• HBCSE Regional & National Olympiads\n\n**Program Highlights:**\n✅ Logical reasoning & aptitude training\n✅ Advanced problem-solving workshops\n✅ Previous year paper analysis\n✅ Mock tests with instant feedback\n✅ Problem-solving speed drills\n\n🏅 Our students have won national-level recognitions!\n\nCall 📞 **+91 98969 13009** for the next batch schedule.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // ADMISSION
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'admission', 'admissions', 'enroll', 'enrolment', 'enrollment',
      'join', 'register', 'registration', 'how to join', 'how to enroll',
      'apply', 'application', 'application form', 'admission form',
      'how to get admission', 'admission process', 'take admission',
      'new admission', 'admission open', 'is admission open',
      'when does admission start', 'when admission opens',
      'last date of admission', 'admission deadline', 'admission date',
      'admission 2025', 'admission 2026', 'can i join',
      'i want to join', 'i want to enroll', 'i want to study here',
      'how do i start', 'where to start', 'first step',
      'documents required', 'what documents', 'eligibility for admission',
      'who can join', 'age limit for admission', 'admission criteria',
      'offline admission', 'online admission', 'direct admission'
    ],
    response: `✅ **Admission Process at Garud Classes**\n\n**Simple 4-Step Process:**\n\n**Step 1:** 📞 Call or WhatsApp us at **+91 98969 13009**\n**Step 2:** 📋 Attend a **Free Counselling Session**\n**Step 3:** 📝 Fill the **Admission Form**\n**Step 4:** 💳 Complete **Fee Payment** & get admission confirmed!\n\n**Documents Required:**\n• Recent passport-size photographs\n• Class 10/12 marksheet (as applicable)\n• ID proof (Aadhar Card)\n• Previous school Transfer Certificate\n\n**Modes:**\n• 🏫 Visit us directly\n• 🌐 Online via [/contact](/contact)\n• 📱 WhatsApp: +91 98969 13009\n\n**Admissions are open!** Don't wait — seats fill fast! 🎓`
  },
  {
    patterns: [
      'is admission free', 'free admission', 'free counselling',
      'free demo class', 'demo class', 'trial class', 'free trial',
      'free class', 'attend free class', 'demo lecture', 'free lecture',
      'first class free', 'can i try', 'can i attend a demo',
      'free session', 'orientation', 'orientation class', 'open house',
      'free workshop', 'free seminar'
    ],
    response: `🎉 **Yes! We offer Free Demo Classes!**\n\n**What you get for FREE:**\n✅ Free counselling session with our academic experts\n✅ Free demo class to experience our teaching style\n✅ Free course recommendation based on your goals\n✅ Free study plan guidance\n\n**Book your free session today!**\n📞 Call/WhatsApp: **+91 98969 13009**\n📧 Email: **info@garudclasses.com**\n🌐 [Contact Form](/contact)\n\nWe'd love to meet you! 😊`
  },

  // ══════════════════════════════════════════════════════════════════════
  // FEES / SCHOLARSHIP
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'fee', 'fees', 'cost', 'price', 'charges', 'how much', 'payment',
      'fee structure', 'fees details', 'fees for jee', 'fees for neet',
      'how much fees', 'course fee', 'total fees', 'annual fees',
      'monthly fees', 'quarterly fees', 'tuition fees', 'coaching fees',
      'fee payment', 'pay fees', 'online payment', 'fee receipt',
      'fee installment', 'fee emi', 'emi option', 'installment option',
      'fee concession', 'fee waiver', 'fee discount', 'discount',
      'affordable', 'cheap coaching', 'low fees', 'budget coaching',
      'expensive', 'is it expensive', 'is fees affordable',
      'what is the cost', 'how much does it cost'
    ],
    response: `💰 **Fee Information at Garud Classes**\n\nFees vary based on **course**, **batch type**, and **duration**.\n\n**What's Included in Fees:**\n✅ All classroom sessions\n✅ Comprehensive study material\n✅ Test series & mock exams\n✅ Doubt-clearing sessions\n✅ Progress reports & parent meetings\n\n**Flexible Payment Options:**\n• 💳 One-time full payment (discount available)\n• 📅 Easy instalment / EMI options\n• 🎓 Merit-based scholarship (up to 70% off)\n• 💰 Special sibling discount\n\nFor the **latest fee structure**, please:\n📞 Call **+91 98969 13009**\n📧 Email **info@garudclasses.com**\n\nDon't let fees stop you — **scholarships available!** 🌟`
  },
  {
    patterns: [
      'scholarship', 'merit scholarship', 'need scholarship',
      'scholarship test', 'scholarship exam', 'garud scholarship',
      'how to get scholarship', 'scholarship eligibility',
      'scholarship percentage', 'scholarship amount', 'free seat',
      'free coaching', 'scholarship offer', 'scholarship available',
      'poor student scholarship', 'economically weak', 'financial aid',
      'nsp scholarship', 'government scholarship',
      'can i get scholarship', 'i need financial help',
      'i cannot afford fees', 'fees too high'
    ],
    response: `🎓 **Scholarship at Garud Classes**\n\nWe believe **financial constraints should never limit your dreams!**\n\n**Types of Scholarships:**\n• 🥇 Merit Scholarship – Based on entrance test score\n• 🏆 Topper Scholarship – For top performers from board exams\n• 👫 Sibling Discount – Special discount for brothers/sisters\n• 💛 Financial Aid – For economically weaker section students\n• 🏅 Sports/NCC Award – Special recognition discounts\n\n**How to Apply:**\n1. Appear for our **Free Scholarship Test**\n2. Submit required documents\n3. Scholarship awarded on merit!\n\nUp to **70% fee waiver** possible!\n\nCall 📞 **+91 98969 13009** to register for the next scholarship test.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // BATCH TIMINGS
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'timing', 'timings', 'batch', 'batches', 'schedule', 'timetable',
      'time table', 'class time', 'class timing', 'batch timing',
      'morning batch', 'evening batch', 'afternoon batch',
      'weekend batch', 'weekend class', 'saturday class', 'sunday class',
      'daily batch', 'regular batch', 'new batch', 'upcoming batch',
      'when does batch start', 'next batch', 'batch details',
      'batch schedule', 'when is the next batch', 'when does it start',
      'how many hours per day', 'class duration', 'how long is class',
      'class hours', 'study hours', 'teaching hours',
      'morning or evening', 'which batch to join', 'flexible timing'
    ],
    response: `🕐 **Batch Timings at Garud Classes**\n\n**We offer flexible batches to suit your schedule:**\n\n🌅 **Morning Batch** – 7:00 AM – 10:00 AM\n🌞 **Afternoon Batch** – 12:00 PM – 3:00 PM\n🌇 **Evening Batch** – 4:00 PM – 7:00 PM\n📅 **Weekend Batch** – Saturday & Sunday (special slots)\n\n**Each session:** 2–3 hours of focused teaching\n**Doubt sessions:** Extra slots after class\n\n⚡ **New batches starting soon!** Seats are limited.\n\nTo confirm current availability:\n📞 **+91 98969 13009**\n📧 **info@garudclasses.com**`
  },
  {
    patterns: [
      'online class', 'online classes', 'online coaching', 'online batch',
      'online learning', 'digital class', 'virtual class', 'zoom class',
      'google meet', 'online study', 'study online', 'e-learning',
      'learn from home', 'home learning', 'distance learning',
      'hybrid class', 'offline class', 'offline coaching', 'offline batch',
      'which mode', 'online or offline', 'can i study online'
    ],
    response: `💻 **Online & Offline Classes at Garud Classes**\n\nWe offer **both modes** to suit your needs!\n\n🏫 **Offline (Centre-based):**\n• Face-to-face teaching\n• Lab & library access\n• Better peer interaction\n• Immediate doubt clearing\n\n💻 **Online (Live classes):**\n• Study from anywhere\n• Recorded lectures available\n• Same quality content\n• Interactive live sessions\n\n**Hybrid Option** also available — attend offline when possible, online when needed!\n\nFor current batch modes:\n📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // CONTACT
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'contact', 'contact details', 'contact information', 'contact us',
      'phone', 'phone number', 'number', 'mobile', 'mobile number',
      'email', 'email address', 'mail', 'helpline', 'support',
      'how to contact', 'how to reach', 'how can i reach',
      'how to get in touch', 'get in touch', 'reach out',
      'call you', 'call the institute', 'can i call',
      'customer care', 'helpdesk', 'enquiry', 'inquiry',
      'give me your number', 'what is your number', 'contact number'
    ],
    response: `📞 **Contact Garud Classes**\n\n📱 **Phone/WhatsApp:** +91 98969 13009\n📧 **Email:** info@garudclasses.com\n🌐 **Website:** [garudclasses.com](https://www.garudclasses.com)\n\n💬 **Contact Form:** [garudclasses.com/contact](/contact)\n\n🏫 **Visit Us:** Come to our centre directly for a free counselling session!\n\n⏰ **Office Hours:** Mon–Sat, 9:00 AM – 6:00 PM`
  },
  {
    patterns: [
      'address', 'location', 'where are you', 'where is garud classes',
      'garud classes location', 'centre location', 'center location',
      'office address', 'institute address', 'branch', 'branches',
      'how to reach', 'directions', 'how far', 'nearest branch',
      'which city', 'which state', 'nearest center', 'visit',
      'come to visit', 'physically visit', 'campus', 'centre address',
      'headquarter', 'head office', 'map', 'google map'
    ],
    response: `📍 **Garud Classes Location**\n\n🏫 Visit our coaching centre for a **free counselling session**!\n\nFor the exact address and directions:\n📞 **+91 98969 13009**\n📧 **info@garudclasses.com**\n🌐 [Contact Page](/contact)\n\nOur team will guide you to reach us easily! 🗺️`
  },
  {
    patterns: [
      'whatsapp', 'whatsapp number', 'whatsapp contact', 'chat on whatsapp',
      'whatsapp me', 'message on whatsapp', 'wa.me', 'whatsapp link',
      'reach on whatsapp', 'contact on whatsapp', 'can i whatsapp'
    ],
    response: `📱 **WhatsApp Garud Classes!**\n\nYou can reach us directly on WhatsApp:\n\n👉 [**+91 98969 13009**](https://wa.me/919896913009)\n\nOr click the **green WhatsApp button** on this page! 💬\n\nWe're available **Mon–Sat, 9 AM – 6 PM** on WhatsApp.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // FACULTY
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'faculty', 'teacher', 'teachers', 'professor', 'professors',
      'staff', 'educators', 'mentor', 'mentors', 'sir', 'madam',
      'who teaches', 'who are the teachers', 'faculty details',
      'faculty members', 'faculty list', 'teaching staff',
      'how experienced', 'teacher qualification', 'teacher background',
      'iit teacher', 'iitian teacher', 'nit teacher',
      'qualified teacher', 'expert teacher', 'best teacher',
      'physics teacher', 'chemistry teacher', 'biology teacher',
      'maths teacher', 'math teacher', 'science teacher',
      'english teacher', 'faculty page', 'know the faculty'
    ],
    response: `👨‍🏫 **Our Faculty at Garud Classes**\n\nWe take pride in our **highly experienced and passionate educators!**\n\n🎓 **Qualifications:**\n• IIT / NIT alumni\n• Top-university post-graduates\n• 5–20+ years of teaching experience\n• Specialists in JEE, NEET & Board subjects\n\n**Subject Experts:**\n⚗️ Chemistry – Deep concept masters\n🔭 Physics – Numerical & theory specialists\n🧬 Biology – NCERT + advanced experts\n📐 Mathematics – Problem-solving champions\n\n**Teaching Style:**\n✅ Concept-first approach\n✅ Interactive classroom sessions\n✅ Dedicated doubt-clearing hours\n✅ Regular student performance reviews\n\nMeet our full faculty team at [/faculty](/faculty). 🌟`
  },

  // ══════════════════════════════════════════════════════════════════════
  // RESULTS
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'result', 'results', 'selection', 'topper', 'toppers',
      'achievement', 'achievements', 'success', 'success story',
      'success stories', 'rank', 'ranks', 'cleared', 'cracked',
      'past results', 'previous results', 'how many selections',
      'how many students cleared', 'how many in iit', 'how many in mbbs',
      'garud classes results', 'student results', 'our results',
      'students who cleared jee', 'students who cleared neet',
      'merit list', 'star students', 'best students', 'alumni',
      'garud alumni', 'past students', 'student success',
      'how many students got iit', 'how many doctors from garud'
    ],
    response: `🏆 **Our Results & Achievements**\n\nGarud Classes students have achieved **outstanding results** year after year!\n\n**JEE Achievements:**\n🥇 Multiple IIT selections every year\n📈 Top AIR (All India Ranks) by our students\n✅ 100+ JEE Main qualifiers annually\n\n**NEET Achievements:**\n🏥 Consistent MBBS & BDS selections\n📊 Top NEET scores by Garud students\n\n**Board Exam Results:**\n📗 Average score 85%+ in CBSE boards\n🌟 Multiple 90%+ and 95%+ scorers\n\n**Other Achievements:**\n⭐ NTSE scholars every year\n🥈 Olympiad medal winners\n\nSee all our results & toppers: [/results](/results) 🎉`
  },

  // ══════════════════════════════════════════════════════════════════════
  // STUDY MATERIAL
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'study material', 'study materials', 'material', 'notes',
      'written notes', 'printed notes', 'handwritten notes',
      'books provided', 'books given', 'books included',
      'are books provided', 'do you provide books', 'what books',
      'reference books', 'best books for jee', 'best books for neet',
      'study resources', 'reading material', 'pdf notes',
      'notes available', 'notes pdf', 'download notes',
      'textbook', 'workbook', 'practice book', 'question bank',
      'dpp', 'daily practice problem', 'practice sheet', 'worksheet',
      'study kit', 'course kit', 'material included'
    ],
    response: `📚 **Study Material at Garud Classes**\n\nAll students receive **comprehensive study material** as part of their course!\n\n**What's Included:**\n✅ Theory notes (chapter-wise)\n✅ Solved examples & illustrations\n✅ DPP (Daily Practice Problems)\n✅ Chapter-wise question bank\n✅ Mock test papers (JEE/NEET standard)\n✅ Previous year question papers (10+ years)\n✅ Formula sheets & revision notes\n✅ Mind maps & quick revision guides\n\n**Also available at our Store:**\n🛍️ [store.garudclasses.com](https://store.garudclasses.com)\n\nStudy material is **included in course fees!** 📖`
  },

  // ══════════════════════════════════════════════════════════════════════
  // TEST PORTAL
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'test portal', 'test portl', 'online test', 'mock test', 'test',
      'practice test', 'quiz', 'online exam', 'test series',
      'full mock', 'full test', 'chapter test', 'chapter wise test',
      'subject test', 'module test', 'unit test', 'weekly test',
      'practice paper', 'sample paper', 'previous year paper',
      'past paper', 'testportal', 'test.garudclasses', 'test link',
      'test login', 'test access', 'test account', 'test password',
      'neet mock', 'jee mock', 'online practice', 'give a test',
      'i want to practice', 'practice online', 'online quiz',
      'attempt test', 'test portal link'
    ],
    response: `📝 **Online Test Portal**\n\nPractice anytime, anywhere with our **Online Test Portal!**\n\n🔗 [**testportal.garudclasses.com**](https://testportal.garudclasses.com/)\n\n**Features:**\n✅ Chapter-wise tests\n✅ Subject tests (Physics, Chemistry, Biology, Maths)\n✅ Full-length mock tests (JEE Main / NEET pattern)\n✅ Previous year papers\n✅ Instant result & detailed analysis\n✅ Rank among all students\n✅ Weakness identification & recommendations\n\n**Login** with the credentials provided at the time of admission.\n\nNot enrolled yet? Call 📞 **+91 98969 13009** to join!`
  },

  // ══════════════════════════════════════════════════════════════════════
  // STORE
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'store', 'online store', 'books', 'buy books', 'purchase books',
      'buy notes', 'purchase notes', 'buy material', 'purchase material',
      'study material buy', 'stationery', 'shop', 'shopping',
      'e-store', 'garud store', 'store link', 'product', 'products',
      'what can i buy', 'buy online', 'order books', 'order notes',
      'store.garudclasses', 'coaching material shop', 'book shop'
    ],
    response: `🛍️ **Garud Classes Online Store**\n\nGet quality study materials delivered to your doorstep!\n\n🔗 [**store.garudclasses.com**](https://store.garudclasses.com)\n\n**Available Products:**\n📗 Course-wise notes & theory books\n📄 Practice papers & DPP workbooks\n📁 Previous year paper compilations\n🗂️ Formula booklets & revision guides\n📐 Stationery & study kits\n\n**Benefits:**\n✅ Trusted by Garud Classes students\n✅ Prepared by expert faculty\n✅ Fast delivery available\n✅ Affordable pricing\n\nVisit the store and order now! 📦`
  },

  // ══════════════════════════════════════════════════════════════════════
  // GALLERY
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'gallery', 'photos', 'images', 'pictures', 'photo gallery',
      'image gallery', 'picture gallery', 'event photos', 'events',
      'event pictures', 'activities', 'classroom photos', 'centre photos',
      'infrastructure photos', 'see the institute', 'how does it look',
      'what does the centre look like', 'inside the centre',
      'felicitation', 'prize distribution', 'award ceremony',
      'annual function', 'farewell', 'celebration', 'sports event',
      'cultural event', 'science fair', 'exhibition', 'workshop photos'
    ],
    response: `🖼️ **Gallery – Garud Classes**\n\nExplore life at Garud Classes through our gallery!\n\n📸 **What you'll find:**\n• Modern classroom sessions\n• Student achievement ceremonies\n• Parent-teacher meetings\n• Science & math workshops\n• Cultural & sports events\n• Annual felicitation functions\n• Student celebrations\n\nView our full gallery: [/gallery](/gallery) 🎉`
  },

  // ══════════════════════════════════════════════════════════════════════
  // BLOG
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'blog', 'articles', 'article', 'news', 'study tips', 'exam tips',
      'preparation tips', 'tips and tricks', 'tricks', 'strategy',
      'study advice', 'exam advice', 'time management tips',
      'how to study', 'how to prepare', 'read articles',
      'latest news', 'notifications', 'announcements',
      'what\'s new', 'what is new', 'latest update', 'updates',
      'educational blog', 'coaching blog', 'garud blog', 'blog page',
      'where to read', 'success stories blog', 'student stories'
    ],
    response: `📝 **Garud Classes Blog**\n\nStay updated with valuable content on our Blog!\n\n**You'll Find:**\n📌 JEE & NEET preparation strategies\n📌 Study time management tips\n📌 Subject-wise tips (Physics, Chemistry, Biology, Maths)\n📌 Exam pattern updates & notifications\n📌 Student success stories\n📌 Career guidance articles\n📌 Important exam dates & schedules\n📌 Motivational content for students\n\nVisit our Blog: [/blog](/blog) ✍️`
  },

  // ══════════════════════════════════════════════════════════════════════
  // DOUBT CLEARING
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'doubt', 'doubts', 'doubt clearing', 'doubt session', 'doubt class',
      'clear doubt', 'solve doubt', 'solve my doubt', 'ask doubt',
      'doubt solving', 'doubt solving session', 'extra class',
      'remedial class', 'slow learner support', 'weak student support',
      'i have doubt', 'can i ask doubt', 'who solves doubts',
      'personal doubt', 'individual doubt', 'one on one doubt',
      'one to one', '1 to 1', '1:1', 'personal attention',
      'individual attention', 'personal mentoring', 'mentorship',
      'personal tuition', 'extra help', 'need extra help'
    ],
    response: `❓ **Doubt Clearing at Garud Classes**\n\nWe make sure **no student is left behind!**\n\n**Doubt Clearing Options:**\n✅ **Daily Doubt Sessions** – After every class\n✅ **Dedicated Doubt Classes** – Weekly scheduled slots\n✅ **WhatsApp Doubt Support** – Text doubts anytime\n✅ **One-on-One Mentoring** – Personal sessions on request\n✅ **Recorded Solutions** – Video explanations for complex topics\n\n**No doubt goes unanswered at Garud Classes!** 🎯\n\nCall 📞 **+91 98969 13009** for details.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // PERFORMANCE TRACKING
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'performance', 'performance tracking', 'progress', 'progress report',
      'report card', 'report', 'analysis', 'performance analysis',
      'how will i know my progress', 'how to track progress',
      'parent report', 'parent update', 'parent meeting', 'ptm',
      'parent teacher meeting', 'student performance', 'feedback',
      'how am i doing', 'am i improving', 'rank in class',
      'class rank', 'test rank', 'test score', 'test result',
      'weekly test result', 'assessment', 'evaluation',
      'performance card', 'exam feedback'
    ],
    response: `📊 **Performance Tracking at Garud Classes**\n\nWe believe in **data-driven learning** to maximize student potential!\n\n**How We Track Your Progress:**\n✅ Chapter-wise test scores maintained\n✅ Monthly performance reports generated\n✅ Rank among classmates shown after every test\n✅ Strength & weakness analysis provided\n✅ Subject-wise progress graphs\n✅ Attendance tracking\n\n**Parent Updates:**\n📩 Monthly performance reports sent to parents\n🤝 Regular Parent-Teacher Meetings (PTMs)\n📱 WhatsApp updates on test scores\n\n**Our goal:** Help every student improve continuously! 📈`
  },

  // ══════════════════════════════════════════════════════════════════════
  // INFRASTRUCTURE
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'infrastructure', 'facilities', 'classroom', 'classrooms',
      'lab', 'laboratory', 'library', 'reading room', 'study room',
      'smart board', 'smart class', 'projector', 'ac classroom',
      'air conditioned', 'ac room', 'wifi', 'internet', 'campus facility',
      'canteen', 'cafeteria', 'drinking water', 'parking',
      'washroom', 'girls facility', 'boys facility', 'safety',
      'cctv', 'security', 'how is the building', 'how is the centre',
      'what facilities', 'does it have library', 'is there a lab'
    ],
    response: `🏫 **Infrastructure & Facilities at Garud Classes**\n\nWe provide a **world-class learning environment!**\n\n**Facilities Available:**\n✅ Spacious, well-lit AC classrooms\n✅ Smart boards & digital teaching aids\n✅ Well-stocked student library\n✅ High-speed Wi-Fi on campus\n✅ Separate doubt-clearing rooms\n✅ Science & laboratory reference materials\n✅ Clean washrooms for boys & girls\n✅ Safe & CCTV-monitored campus\n✅ Comfortable study areas\n✅ Drinking water facility\n\nVisit us to see it yourself. 📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // DROPPER / REPEATER
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'dropper', 'droppers', 'dropper batch', 'dropper course',
      'repeater', 'repeater batch', 'gap year', 'i am a dropper',
      'i dropped a year', 'repeat jee', 'repeat neet', 'second attempt',
      'third attempt', '2nd attempt', '3rd attempt', 'one more year',
      'failed last time', 'did not qualify last time', 'want to retry',
      'want to reattempt', 'improve my rank', 'better rank',
      'class 12 pass', '12th pass', 'after 12th', 'after 12',
      'just passed 12th', 'recently passed', 'fresher batch',
      'i passed class 12', 'class 12 completed', 'ready for jee again'
    ],
    response: `💪 **Dropper / Repeater Batch at Garud Classes**\n\nNot getting the rank you wanted? **One more focused year can change everything!**\n\n**Our Dropper Program:**\n✅ Intensive revision of all concepts\n✅ 6-hour daily class + doubt sessions\n✅ 60+ full mock tests during the year\n✅ Target-based study plan\n✅ Separate batch for focused preparation\n✅ Motivational counselling sessions\n✅ Previous year paper deep analysis\n✅ Rank improvement guarantee strategy\n\n**Many Garud toppers were droppers!** 🏆\n\nDon't give up — call us today:\n📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // EXAM DATES / NOTIFICATIONS
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'exam date', 'exam dates', 'exam schedule', 'jee date', 'neet date',
      'jee 2025 date', 'jee 2026 date', 'neet 2025 date', 'neet 2026 date',
      'when is jee', 'when is neet', 'jee notification', 'neet notification',
      'jee application date', 'neet application date', 'jee form',
      'neet form', 'jee registration date', 'neet registration date',
      'jee exam month', 'neet exam month', 'nta notification',
      'nta schedule', 'exam calendar', 'important dates',
      'upcoming exams', 'next exam', 'exam timetable', 'exam schedule 2026'
    ],
    response: `📅 **Exam Dates & Notifications**\n\n**JEE Main 2026 (Tentative):**\n• Session 1: January 2026\n• Session 2: April 2026\n\n**NEET UG 2026 (Tentative):**\n• May 2026\n\n**For Official / Latest Dates:**\n🔗 [NTA Official Website](https://nta.ac.in)\n🔗 [JEE Main Portal](https://jeemain.nta.ac.in)\n🔗 [NEET Portal](https://neet.nta.nic.in)\n\n📌 **Always verify from official NTA notifications!**\n\nAt Garud Classes, we keep our students **updated with all important exam notifications.** 📢\n\nCall 📞 **+91 98969 13009** to know more.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // MOTIVATION / STUDY TIPS
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'motivate me', 'motivation', 'motivational quote', 'i am feeling low',
      'i feel like giving up', 'i want to quit', 'discouraged',
      'depressed', 'stressed', 'exam stress', 'exam anxiety',
      'how to stay motivated', 'how to focus', 'how to concentrate',
      'can\'t focus', 'can\'t study', 'not able to study',
      'difficult to study', 'distracted', 'distraction',
      'phone distraction', 'social media distraction',
      'how to avoid distraction', 'i feel less confident',
      'not confident', 'i am scared of exam', 'i am afraid of exam',
      'pep talk', 'encourage me', 'inspire me'
    ],
    response: `💪 **You've Got This!**\n\n*"Success is not final, failure is not fatal — it is the courage to continue that counts."*\n— Winston Churchill\n\n**Tips to Stay Motivated:**\n✅ Set **small daily goals** — celebrate each win!\n✅ Take **short breaks** (25 min study + 5 min break = Pomodoro)\n✅ **Sleep 7–8 hours** — a rested mind learns better\n✅ **Exercise daily** — even 20 min improves concentration\n✅ **Avoid social media** during study hours\n✅ Visualize your **success** — your IIT/MBBS seat is waiting!\n✅ Talk to your teacher or mentor when feeling stuck\n\n**Remember:** Every Garud topper felt this way — and they pushed through! 🌟\n\n📞 **+91 98969 13009**`
  },
  {
    patterns: [
      'study tips', 'how to study better', 'how to study effectively',
      'how to score more', 'score higher', 'improve marks', 'improve score',
      'better marks', 'study smart', 'smart study', 'study technique',
      'study method', 'best study method', 'pomodoro', 'revision',
      'how to revise', 'how often to revise', 'revision tips',
      'memory tips', 'how to remember', 'memorize fast', 'remember formulas',
      'formulae', 'learn formulas', 'memorize formulas', 'study schedule',
      'how many hours to study', 'daily routine', 'study routine',
      'study plan', 'best time to study', 'night study', 'morning study'
    ],
    response: `📖 **Top Study Tips from Garud Classes Faculty!**\n\n**1. Plan Your Day** 📅\nMake a realistic timetable — allocate time per subject.\n\n**2. Study Smarter** 🧠\nUse Pomodoro: 25 min focused study + 5 min break.\n\n**3. Concept First** 💡\nUnderstand concepts before solving problems.\n\n**4. Practice Daily** ✍️\nSolve at least 20–30 problems per subject every day.\n\n**5. Revise Weekly** 🔄\nRevise previous week's topics every Sunday.\n\n**6. Mock Tests** 📝\nAttempt 1 full mock test every week.\n\n**7. Sleep Well** 😴\n7–8 hours of sleep is essential for memory retention.\n\n**8. Stay Healthy** 🥗\nEat well, exercise, and avoid excessive screen time.\n\nNeed personalised guidance? 📞 **+91 98969 13009**`
  },
  {
    patterns: [
      'time management', 'manage time', 'manage study time', 'how to manage time',
      'time table for jee', 'time table for neet', 'daily schedule jee',
      'daily schedule neet', 'how many hours per day for jee',
      'how many hours for neet', 'is 6 hours enough', 'is 8 hours enough',
      'study hours per day', 'hours to study daily', 'how many subjects per day'
    ],
    response: `⏰ **Time Management for JEE/NEET Preparation**\n\n**Recommended Daily Study Plan:**\n\n🌅 **Morning (2–3 hrs):** Most difficult subject\n🌞 **Afternoon (2 hrs):** Revision + DPP practice\n🌇 **Evening (2–3 hrs):** Coaching class or second subject\n🌙 **Night (1 hr):** Light reading + formula revision\n\n**Subject Distribution:**\n• Physics – 2.5 hrs/day\n• Chemistry – 2 hrs/day\n• Maths / Biology – 2.5 hrs/day\n\n**Total:** 7–9 hours focused study per day\n\n**Golden Rule:** Quality > Quantity. 6 focused hours beat 12 distracted ones! 🎯`
  },

  // ══════════════════════════════════════════════════════════════════════
  // PARENT QUERIES
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'parent', 'parents', 'i am a parent', 'my son', 'my daughter',
      'my child', 'my kid', 'parent query', 'parent question',
      'parent concern', 'is it safe', 'safety of child', 'transport',
      'pick and drop', 'hostel', 'accommodation', 'pg', 'paying guest',
      'nearby hostel', 'can my child stay', 'residential coaching',
      'nearby pg', 'student accommodation', 'safe for girls',
      'girls safety', 'are girls safe there', 'girl student',
      'parent meeting', 'parent feedback', 'parent portal',
      'parent app', 'parent update', 'how will parent know progress'
    ],
    response: `👨‍👩‍👧 **For Parents – Garud Classes**\n\nWe understand parents' concerns and are fully committed to your child's success!\n\n**For Parents, We Offer:**\n✅ Monthly progress reports sent home\n✅ Regular Parent-Teacher Meetings (PTMs)\n✅ WhatsApp updates on attendance & performance\n✅ Safe, CCTV-monitored campus\n✅ Separate facilities for boys & girls\n✅ Strict attendance tracking\n✅ Open-door policy – parents can meet faculty anytime\n\n**For accommodation:** We can recommend trusted PG/hostel options nearby.\n\nFor all parent queries:\n📞 **+91 98969 13009**\n📧 **info@garudclasses.com**\n\nYour child is in safe hands at Garud Classes! 🛡️`
  },

  // ══════════════════════════════════════════════════════════════════════
  // SOCIAL MEDIA
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'facebook', 'instagram', 'youtube', 'telegram', 'social media',
      'follow on instagram', 'like on facebook', 'youtube channel',
      'subscribe', 'telegram channel', 'telegram group',
      'twitter', 'x.com', 'linkedin', 'social handles',
      'garud classes youtube', 'garud classes instagram',
      'garud classes facebook', 'garud classes telegram',
      'online presence', 'follow garud'
    ],
    response: `📱 **Follow Garud Classes on Social Media!**\n\nStay updated with us on:\n\n📘 **Facebook:** [Garud Classes](#)\n📸 **Instagram:** [Garud Classes](#)\n▶️ **YouTube:** [Garud Classes](#)\n📲 **Telegram:** [Garud Classes](#)\n💬 **WhatsApp:** [+91 98969 13009](https://wa.me/919896913009)\n\n**On our channels you'll find:**\n• Free study videos & tips\n• Exam notifications\n• Student success stories\n• Live doubt sessions\n• Motivational content\n\nHit follow & never miss an update! 🔔`
  },

  // ══════════════════════════════════════════════════════════════════════
  // CLASS 11 & 12 SPECIFIC
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'class 11', 'class 12', '11th class', '12th class', 'class xi',
      'class xii', 'i am in class 11', 'i am in class 12',
      'i am in 11th', 'i am in 12th', 'currently in class 11',
      'currently in class 12', 'for class 11', 'for class 12',
      'class 11 student', 'class 12 student', '11th student', '12th student',
      'xii student', 'xi student', 'standard 11', 'standard 12'
    ],
    response: `📚 **Coaching for Class 11 & 12 Students**\n\n**Class 11 Students:**\n🔬 JEE Main + Advanced 2-year program starts here!\n💊 NEET UG 2-year program — start strong!\n🎓 Foundation for NTSE, Olympiads\n\n**Class 12 Students:**\n🔬 JEE Main + Advanced 1-year intensive batch\n💊 NEET UG 1-year focused batch\n📗 Board + Competitive exam combo batch\n\n**What Garud Offers You:**\n✅ Board exam + competitive exam preparation together\n✅ Expert faculty for all PCM/PCB subjects\n✅ Smart study plans to manage both\n\nCall 📞 **+91 98969 13009** to get enrolled!\nVisit [/courses](/courses) for more details.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // SUBJECT-SPECIFIC HELP
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'physics weak', 'weak in physics', 'physics problem', 'i hate physics',
      'physics difficult', 'physics is hard', 'help with physics',
      'how to improve physics', 'physics tips', 'physics tricks',
      'numerical physics', 'physics formula', 'physics derivation',
      'mechanics', 'electrostatics', 'optics', 'thermodynamics',
      'modern physics', 'waves', 'electricity', 'magnetism'
    ],
    response: `⚡ **Struggling with Physics? We've Got You!**\n\n**Expert Physics Tips:**\n✅ Build concept clarity first — don't jump to numericals\n✅ Use **NCERT** as base, then move to advanced problems\n✅ Practice **10 numericals** per topic daily\n✅ Maintain a **formula notebook** — revise daily\n✅ Important topics: Mechanics, E&M, Optics, Modern Physics\n\n**At Garud Classes:**\n• Dedicated Physics specialist faculty\n• Concept + numerical sessions\n• Daily doubt clearing\n• Topic-wise test series\n\nPhysics is **conquerable** with the right guidance!\n📞 **+91 98969 13009**`
  },
  {
    patterns: [
      'chemistry weak', 'weak in chemistry', 'chemistry problem',
      'chemistry difficult', 'chemistry is hard', 'help with chemistry',
      'how to improve chemistry', 'chemistry tips', 'organic chemistry',
      'inorganic chemistry', 'physical chemistry', 'reactions',
      'mechanisms', 'periodic table', 'mole concept', 'stoichiometry',
      'chemical bonding', 'coordination compounds', 'electrochemistry'
    ],
    response: `⚗️ **Conquering Chemistry at Garud Classes!**\n\n**Expert Chemistry Tips:**\n✅ **Organic:** Focus on reaction mechanisms, not rote memorization\n✅ **Inorganic:** NCERT is king — read it 3 times!\n✅ **Physical:** Master concepts + numericals both\n✅ Maintain a **reaction summary notebook**\n✅ Solve 5–10 questions per chapter daily\n\n**At Garud Classes:**\n• Chemistry divided into 3 modules: Organic, Inorganic, Physical\n• Regular topic-wise tests\n• Mnemonics & memory tricks taught\n\nChemistry can be your **highest scoring subject!** 🏆\n📞 **+91 98969 13009**`
  },
  {
    patterns: [
      'biology weak', 'weak in biology', 'biology problem', 'i hate biology',
      'biology difficult', 'biology is hard', 'help with biology',
      'how to improve biology', 'biology tips', 'ncert biology',
      'plant biology', 'animal biology', 'human physiology',
      'genetics', 'evolution', 'ecology', 'cell biology',
      'botany', 'zoology', 'diagrams biology', 'biology diagrams',
      'biology memorize', 'biology facts'
    ],
    response: `🌿 **Mastering Biology for NEET!**\n\n**Expert Biology Tips:**\n✅ **NCERT is everything** — read every line\n✅ Draw diagrams daily — they carry 20–30 marks\n✅ Make short notes chapter by chapter\n✅ High-weightage: Genetics, Human Physiology, Plant Bio\n✅ Revise every 3 days — Biology is 80% memory-based\n\n**At Garud Classes:**\n• Dedicated Biology specialist faculty\n• NCERT line-by-line coverage\n• Diagram practice sessions\n• Rapid revision programs\n\nBiology is the **highest scoring section** in NEET — ace it!\n📞 **+91 98969 13009**`
  },
  {
    patterns: [
      'maths weak', 'math weak', 'weak in maths', 'weak in math',
      'maths problem', 'math problem', 'maths difficult', 'math is hard',
      'help with maths', 'how to improve maths', 'mathematics tips',
      'calculus', 'algebra', 'trigonometry', 'coordinate geometry',
      'probability', 'statistics', 'vectors', 'matrices',
      'integration', 'differentiation', 'differential equations',
      'complex numbers', 'permutation', 'combination', 'binomial'
    ],
    response: `📐 **Acing Mathematics at Garud Classes!**\n\n**Expert Maths Tips:**\n✅ **Practice is the only key** — solve 20–30 problems daily\n✅ Don't skip steps — write solutions completely\n✅ **Revise formulae daily** — 15 min every morning\n✅ High-weightage: Calculus, Coordinate Geometry, Algebra\n✅ Attempt **time-based mock tests** regularly\n\n**At Garud Classes:**\n• Maths faculty with IIT/NIT background\n• Topic-wise problem sets (easy → medium → hard)\n• Speed and accuracy drills\n• Shortcut & tricks sessions\n\n**Maths can be your ultimate score booster!** 💯\n📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // CAREER GUIDANCE
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'career', 'career guidance', 'career counselling', 'career after 12th',
      'after 12th what to do', 'after 12th science', 'options after 12th',
      'which career', 'which profession', 'engineering or medical',
      'doctor or engineer', 'should i take science', 'should i take medical',
      'top careers', 'best careers', 'career in science',
      'future career', 'job prospects', 'placement',
      'iit career', 'mbbs career', 'b.tech career',
      'engineering salary', 'doctor salary', 'what after iit',
      'what after mbbs', 'mba after engineering', 'ms abroad'
    ],
    response: `🎯 **Career Guidance at Garud Classes**\n\n**Engineering Path (JEE):**\n🔬 IIT/NIT → B.Tech → Core Jobs / MBA / MS Abroad\n💼 Avg salary after IIT: ₹12–50 LPA+\n\n**Medical Path (NEET):**\n💊 MBBS → PG / MD/MS → Specialist Doctor\n🏥 Avg salary after MBBS + PG: ₹10–30 LPA+\n\n**Foundation Path:**\n📚 Strong Class 8–10 → Better JEE/NEET Rank\n\n**At Garud Classes:**\n✅ Free career counselling sessions\n✅ Industry expert talks\n✅ College admission guidance\n✅ Scholarship & university information\n\nBook a FREE career counselling session:\n📞 **+91 98969 13009**`
  },

  // ══════════════════════════════════════════════════════════════════════
  // LANGUAGE / MEDIUM
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'hindi medium', 'english medium', 'in hindi', 'in english',
      'medium of instruction', 'teaching language', 'language of teaching',
      'can i study in hindi', 'classes in hindi', 'hindi coaching',
      'bilingual', 'both languages', 'teach in hindi',
      'can you teach in hindi', 'hinglish'
    ],
    response: `🗣️ **Medium of Instruction at Garud Classes**\n\nWe teach in **both Hindi and English** (Bilingual) to ensure every student understands!\n\n✅ **Explanations in Hindi** for better concept clarity\n✅ **Technical terms in English** (exam-standard)\n✅ **Study material** available in English\n✅ **No language barrier** — we adapt to student needs\n\nYou're welcome whether you've studied in Hindi or English medium! 🌟\n\nCall 📞 **+91 98969 13009** for more details.`
  },

  // ══════════════════════════════════════════════════════════════════════
  // COMPLAINTS / FEEDBACK
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'complaint', 'complain', 'issue', 'problem with garud', 'not happy',
      'not satisfied', 'unhappy', 'bad experience', 'negative feedback',
      'give feedback', 'share feedback', 'suggestion', 'suggestions',
      'improvement suggestion', 'report a problem', 'raise concern',
      'grievance', 'escalate', 'i have a complaint', 'quality issue',
      'teacher issue', 'faculty complaint', 'admin issue',
      'refund', 'money back', 'fee refund'
    ],
    response: `🙏 **We're Sorry to Hear That!**\n\nYour feedback is extremely valuable to us. We take every concern seriously.\n\n**To raise a complaint or share feedback:**\n📞 **Call us:** +91 98969 13009\n📧 **Email us:** info@garudclasses.com\n💬 **Contact Form:** [/contact](/contact)\n\nOur management will **personally address your concern within 24 hours.**\n\nWe're committed to giving every student the best experience! 💛`
  },

  // ══════════════════════════════════════════════════════════════════════
  // FUN / MISC
  // ══════════════════════════════════════════════════════════════════════
  {
    patterns: [
      'joke', 'tell me a joke', 'funny', 'make me laugh', 'humor',
      'a joke please', 'say something funny', 'comedy'
    ],
    response: `😄 Here's a study joke for you!\n\n👨‍🏫 *Teacher: Why is a math book always stressed?*\n🎓 *Student: Because it has too many problems!*\n\n😂\n\nNow that you're smiling — **go ace those problems in real life!** Our faculty will make sure of that! 🏆\n\nCall 📞 **+91 98969 13009** to join us!`
  },
  {
    patterns: [
      'quote', 'inspirational quote', 'motivational quote', 'give me a quote',
      'share a quote', 'famous quote', 'life quote', 'success quote'
    ],
    response: `✨ **Here's a Quote for You!**\n\n*"Education is the most powerful weapon which you can use to change the world."*\n— **Nelson Mandela**\n\n---\n\n*"It does not matter how slowly you go as long as you do not stop."*\n— **Confucius**\n\n---\n\n*"Success is the sum of small efforts repeated day in and day out."*\n— **Robert Collier**\n\nKeep pushing! Your IIT/MBBS dream is closer than you think! 🦅🌟`
  },
  {
    patterns: [
      'can you solve', 'solve this', 'what is 2+2', 'math question',
      'solve for x', 'calculate', 'answer this question',
      'what is the answer', 'numerical question', 'solve equation'
    ],
    response: `🤔 I'm a chatbot assistant for Garud Classes, so I can't solve maths problems directly!\n\nBut our **expert faculty** can! 👨‍🏫\n\n**Ways to get your doubts solved:**\n✅ Join Garud Classes & get daily doubt sessions\n✅ Call us: 📞 **+91 98969 13009**\n✅ WhatsApp your doubt: [+91 98969 13009](https://wa.me/919896913009)\n\nOur teachers love helping students! 🎓`
  },
  {
    patterns: [
      'no', 'nope', 'nah', 'not interested', 'not now', 'not today',
      'maybe later', 'will think', 'will let you know', 'i\'ll think',
      'not sure yet', 'not decided yet', 'undecided', 'confused'
    ],
    response: `😊 No worries at all! Take your time.\n\nWhenever you're ready, we're here to help!\n\n📞 **+91 98969 13009** – Call anytime\n📧 **info@garudclasses.com** – Email us\n🌐 [Contact Form](/contact)\n\n**All the best with your decision!** 🌟`
  },
  {
patterns: [
      'hey',
      'good morning',
      'good afternoon',
      'good evening',
      'namaste',
      'hii',
      'helo'
    ],
    response: `👋 Hello! Welcome to **Garud Classes**!\n\nI'm your virtual assistant. I can help you with:\n• 📚 Courses & Admissions\n• 👨‍🏫 Faculty Information\n• 📞 Contact Details\n• 🏆 Results & Achievements\n• 🕐 Batch Timings\n• 💰 Fee Enquiry\n\nHow can I assist you today?`
  },

  // Courses
  {
    patterns: [
      'course',
      'courses',
      'what do you teach',
      'which course',
      'program',
      'class',
      'classes offered'
    ],
    response: `📚 **Courses Offered at Garud Classes:**\n\n🔬 **JEE Main & Advanced** – For Class 11, 12 & Droppers\n💊 **NEET UG** – For Class 11, 12 & Droppers\n🎓 **Foundation (Class 8–10)** – Build strong concepts early\n📗 **Board Exam Prep** – CBSE & State Board excellence\n⭐ **NTSE / Olympiad** – Competitive exam coaching\n\nTo know more, visit [/courses](/courses) or ask about a specific course!`
  },

  // JEE
  {
    patterns: [
      'jee',
      'iit',
      'jee main',
      'jee advanced',
      'iit jee',
      'engineering entrance'
    ],
    response: `🔬 **JEE Main & Advanced Coaching**\n\nWe offer comprehensive JEE preparation for:\n• Class 11 students (2-year program)\n• Class 12 students (1-year program)\n• Droppers (Intensive program)\n\n✅ Expert faculty with IIT/NIT background\n✅ Regular tests & doubt sessions\n✅ Study material included\n\nFor admission enquiry, call 📞 **+91 98969 13009** or visit [/contact](/contact).`
  },

  // NEET
  {
    patterns: [
      'neet',
      'medical',
      'mbbs',
      'neet ug',
      'medical entrance',
      'doctor'
    ],
    response: `💊 **NEET UG Coaching**\n\nPrepare for NEET with our expert coaching:\n• Class 11 students (2-year program)\n• Class 12 students (1-year program)\n• Droppers (Focused revision program)\n\n✅ Biology, Physics & Chemistry specialists\n✅ NCERT-focused approach\n✅ Regular mock tests\n\nFor more info, call 📞 **+91 98969 13009** or visit [/courses](/courses).`
  },

  // Foundation
  {
    patterns: [
      'foundation',
      'class 8',
      'class 9',
      'class 10',
      '8th',
      '9th',
      '10th',
      'middle school'
    ],
    response: `🎓 **Foundation Course (Class 8–10)**\n\nBuild rock-solid fundamentals early!\n• Covers Science & Mathematics\n• Prepares for Board exams + competitive exams\n• Ideal for Class 8, 9 & 10 students\n\nStrong foundation = better JEE/NEET results!\n\nCall 📞 **+91 98969 13009** for details.`
  },

  // NTSE / Olympiad
  {
    patterns: [
      'ntse',
      'olympiad',
      'kvpy',
      'scholarship',
      'competition',
      'competitive'
    ],
    response: `⭐ **NTSE & Olympiad Coaching**\n\nPrepare for:\n• NTSE (National Talent Search Exam)\n• Math & Science Olympiads\n• Other scholarship exams\n\nOur students have won national-level recognitions!\n\nContact us at 📞 **+91 98969 13009** for the batch schedule.`
  },

  // Admission
  {
    patterns: [
      'admission',
      'enroll',
      'join',
      'register',
      'registration',
      'how to join',
      'how to enroll',
      'apply'
    ],
    response: `✅ **Admission Process at Garud Classes**\n\n1. 📞 Call us at **+91 98969 13009**\n2. 📧 Email: **info@garudclasses.com**\n3. 🏫 Visit our centre directly\n4. 🌐 Fill the contact form at [/contact](/contact)\n\nOur counsellors will guide you through the best batch and course for you!`
  },

  // Fee / Fees
  {
    patterns: [
      'fee',
      'fees',
      'cost',
      'price',
      'charges',
      'how much',
      'payment',
      'scholarship'
    ],
    response: `💰 **Fee Enquiry**\n\nFees vary based on the course and batch type. We also offer:\n• 🎓 Merit-based scholarships\n• 💳 Easy instalment options\n\nFor the latest fee structure, please:\n📞 Call **+91 98969 13009**\n📧 Email **info@garudclasses.com**\n\nOur team will share the complete details!`
  },

  // Timings / Batches
  {
    patterns: [
      'timing',
      'timings',
      'batch',
      'batches',
      'schedule',
      'time',
      'when',
      'morning',
      'evening'
    ],
    response: `🕐 **Batch Timings**\n\nWe offer flexible batch timing options:\n• 🌅 Morning Batches\n• 🌇 Evening Batches\n• 📅 Weekend Batches (Saturday/Sunday)\n\nNew batches start regularly.\n\nTo confirm current batch availability, call 📞 **+91 98969 13009** or email **info@garudclasses.com**.`
  },

  // Contact
  {
    patterns: [
      'contact',
      'phone',
      'number',
      'mobile',
      'email',
      'address',
      'location',
      'where',
      'reach',
      'call'
    ],
    response: `📞 **Contact Garud Classes**\n\n📱 Phone: **+91 98969 13009**\n📧 Email: **info@garudclasses.com**\n🌐 Website: [garudclasses.com](https://www.garudclasses.com)\n\n💬 You can also reach us via the [Contact Form](/contact).`
  },

  // Faculty
  {
    patterns: [
      'faculty',
      'teacher',
      'teachers',
      'professor',
      'staff',
      'educators',
      'mentor',
      'sir',
      'madam'
    ],
    response: `👨‍🏫 **Our Faculty**\n\nGarud Classes has a team of highly qualified and experienced educators:\n• IIT/NIT & top-university alumni\n• Years of teaching experience in JEE & NEET\n• Dedicated doubt-clearing sessions\n\nMeet our faculty at [/faculty](/faculty). 🎓`
  },

  // Results
  {
    patterns: [
      'result',
      'results',
      'selection',
      'topper',
      'toppers',
      'achievement',
      'success',
      'rank',
      'cleared'
    ],
    response: `🏆 **Our Results & Achievements**\n\nGarud Classes students have achieved outstanding results:\n✅ Multiple IIT/NEET selections every year\n✅ Top rankers in JEE Main & Advanced\n✅ 100% Board exam success rate\n✅ NTSE & Olympiad medal winners\n\nSee all results at [/results](/results). 🎉`
  },

  // Gallery
  {
    patterns: [
      'gallery',
      'photos',
      'images',
      'pictures',
      'event',
      'events',
      'activities'
    ],
    response: `🖼️ **Gallery**\n\nExplore moments from Garud Classes:\n• Classroom sessions\n• Student felicitation events\n• Cultural activities\n\nView our gallery at [/gallery](/gallery). 📸`
  },

  // Blog
  {
    patterns: [
      'blog',
      'article',
      'articles',
      'news',
      'tips',
      'study tips',
      'read'
    ],
    response: `📝 **Blog & Study Resources**\n\nStay updated with our blog:\n• Study tips & strategies for JEE/NEET\n• Exam news & notifications\n• Success stories\n\nVisit our blog at [/blog](/blog). ✍️`
  },

  // Test Portal
  {
    patterns: [
      'test',
      'mock test',
      'online test',
      'test portal',
      'practice test',
      'exam',
      'quiz'
    ],
    response: `📝 **Online Test Portal**\n\nPractice with our online test portal:\n🔗 [testportal.garudclasses.com](https://testportal.garudclasses.com/)\n\nFeatures:\n• Chapter-wise tests\n• Full mock tests for JEE & NEET\n• Instant result & analysis\n\nLogin with your credentials to start practising!`
  },

  // Store
  {
    patterns: [
      'store',
      'books',
      'buy',
      'material',
      'study material',
      'notes',
      'shop'
    ],
    response: `🛍️ **Garud Classes Store**\n\nGet quality study materials from our online store:\n🔗 [store.garudclasses.com](https://store.garudclasses.com)\n\nAvailable:\n• Course-wise notes & books\n• Practice papers\n• Reference materials`
  },

  // About
  {
    patterns: [
      'about',
      'who are you',
      'tell me about',
      'garud classes',
      'institute',
      'history',
      'background',
      'founded'
    ],
    response: `🦅 **About Garud Classes**\n\nGarud Classes is a premier coaching institute dedicated to helping students achieve their academic goals.\n\n🎯 **Mission:** Empowering students to soar to new heights\n\n✅ Expert faculty\n✅ Proven track record of results\n✅ Student-first approach\n✅ All-India competitive exam preparation\n\nLearn more at [/about](/about).`
  },

  // Thank you
  {
    patterns: [
      'thank',
      'thanks',
      'thank you',
      'thankyou',
      'great',
      'awesome',
      'nice',
      'helpful'
    ],
    response: `😊 You're welcome! It's our pleasure to help you.\n\nIf you have more questions, feel free to ask.\n\nFor personal guidance, call us at 📞 **+91 98969 13009** anytime. **All the best!** 🌟`
  },
]

// ─── Fallback response ───────────────────────────────────────────────────────
const fallbackResponses = [
  `I'm not sure I understand that. Could you try asking about:\n\n• Courses (JEE, NEET, Foundation)\n• Admissions & Fees\n• Faculty & Results\n• Contact Details\n• Batch Timings\n\nOr call us directly at 📞 **+91 98969 13009**`,
  `Hmm, I didn't catch that! 🤔 I can help you with courses, admissions, fees, faculty, and more.\n\nTry asking: *"What courses do you offer?"* or *"How to enroll?"*`,
  `I don't have an answer for that right now. For detailed assistance, please:\n📞 Call **+91 98969 13009**\n📧 Email **info@garudclasses.com**`
]

// ─── Match user message to knowledge base ───────────────────────────────────
function getResponse (message) {
  const msg = message.toLowerCase().trim()

  // Find matching entry
  for (const entry of knowledgeBase) {
    for (const pattern of entry.patterns) {
      if (msg.includes(pattern)) {
        return entry.response
      }
    }
  }

  // Return random fallback
  const idx = Math.floor(Math.random() * fallbackResponses.length)
  return fallbackResponses[idx]
}

// ─── POST /api/chat ──────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  if (message.trim().length > 500) {
    return res.status(400).json({ error: 'Message too long.' })
  }

  const reply = getResponse(message)
  return res.json({ reply })
})

module.exports = router
