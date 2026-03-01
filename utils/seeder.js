require('dotenv').config();
const mongoose = require('mongoose');
const Result   = require('../models/Result');
const Faculty  = require('../models/Faculty');
const Course   = require('../models/Course');
const Blog     = require('../models/Blog');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/garudclasses')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error(err); process.exit(1); });

/* ── Sample Data ── */
const results = [
  { studentName: 'Arjun Sharma',     fatherName: 'Rajesh Sharma',   exam: 'JEE Advanced', rank: 312,  score: 287, year: 2024, category: 'JEE',   isStateTopper: false, testimonial: 'Garud Classes gave me the right direction.' },
  { studentName: 'Priya Verma',      fatherName: 'Mohan Verma',     exam: 'NEET-UG',      rank: 185,  score: 710, year: 2024, category: 'NEET',  isStateTopper: true,  testimonial: 'Faculty support was exceptional.' },
  { studentName: 'Rohit Kumar',      fatherName: 'Suresh Kumar',    exam: 'JEE Mains',    rank: 1204, score: 272, year: 2024, category: 'JEE',   isBoardTopper: false },
  { studentName: 'Sneha Patel',      fatherName: 'Dinesh Patel',    exam: 'NEET-UG',      rank: 490,  score: 695, year: 2024, category: 'NEET' },
  { studentName: 'Amit Singh',       fatherName: 'Ramesh Singh',    exam: 'Class XII Board', rank: 1, score: 498, year: 2024, category: 'BOARD',  isBoardTopper: true, testimonial: 'Top scorer of the district!' },
  { studentName: 'Neha Gupta',       fatherName: 'Alok Gupta',      exam: 'NTSE',         rank: 78,  score: 160, year: 2023, category: 'NTSE' },
  { studentName: 'Vivek Yadav',      fatherName: 'Kamal Yadav',     exam: 'JEE Advanced', rank: 589, score: 268, year: 2023, category: 'JEE' },
  { studentName: 'Ritu Singh',       fatherName: 'Hari Singh',      exam: 'NEET-UG',      rank: 312, score: 700, year: 2023, category: 'NEET' },
];

const faculty = [
  {
    name: 'Dr. Rajesh Kumar',
    designation: 'Head of Physics',
    subject: 'Physics',
    qualification: 'Ph.D. Physics, IIT Delhi',
    experience: 15,
    about: 'Expert in mechanics and electromagnetism with 15+ years of coaching JEE/NEET students.',
    achievements: ['100+ IIT selections', 'Best Teacher Award 2022', 'Author of 3 Physics books'],
    order: 1,
  },
  {
    name: 'Prof. Sunita Sharma',
    designation: 'Senior Chemistry Faculty',
    subject: 'Chemistry',
    qualification: 'M.Sc Chemistry, BHU; B.Ed',
    experience: 12,
    about: 'Specialist in Organic Chemistry, known for innovative problem-solving techniques.',
    achievements: ['200+ NEET selections', 'Chemistry Olympiad mentor'],
    order: 2,
  },
  {
    name: 'Mr. Anil Gupta',
    designation: 'Mathematics Faculty',
    subject: 'Mathematics',
    qualification: 'M.Sc Mathematics, IISC',
    experience: 10,
    about: 'Makes complex calculus and algebra concepts simple and intuitive.',
    achievements: ['150+ JEE selections', 'NDA/CDS coaching expert'],
    order: 3,
  },
  {
    name: 'Dr. Priti Mishra',
    designation: 'Biology Faculty',
    subject: 'Biology',
    qualification: 'Ph.D. Botany, Lucknow University',
    experience: 8,
    about: 'Comprehensive coverage of Biology for NEET, with special focus on diagrams and NCERT mastery.',
    achievements: ['80+ NEET rank holders trained', 'CBSE resource person'],
    order: 4,
  },
];

const courses = [
  {
    name: 'JEE Main & Advanced',
    category: 'JEE',
    icon: 'fas fa-atom',
    description: 'Comprehensive 2-year program covering Physics, Chemistry, and Mathematics for JEE Main & Advanced preparation.',
    shortDesc: 'Complete JEE preparation with IIT level content.',
    duration: '2 Years',
    eligibility: 'Class 11 passing / Class 12 students',
    features: ['Daily 6 hours of classes', 'Weekly tests on JEE pattern', 'All India Mock Tests', 'Doubt clearing sessions', 'Study material included'],
    fee: '₹75,000/year',
    isActive: true, order: 1,
  },
  {
    name: 'NEET-UG Preparation',
    category: 'NEET',
    icon: 'fas fa-heart-pulse',
    description: 'Intensive coaching for NEET-UG covering Physics, Chemistry, and Biology from NCERT to advanced level.',
    shortDesc: 'NCERT to NEET-advanced level Biology, Physics & Chemistry.',
    duration: '2 Years',
    eligibility: 'Class 11 passing / Class 12 students',
    features: ['Biology special sessions', 'NEET previous year analysis', '20+ mock tests', 'NCERT mastery program'],
    fee: '₹70,000/year',
    isActive: true, order: 2,
  },
  {
    name: 'Foundation (8th-10th)',
    category: 'FOUNDATION',
    icon: 'fas fa-building-columns',
    description: 'Foundation course to build strong concepts in Science and Maths for competitive exam readiness.',
    shortDesc: 'Build strong academic and competitive foundation.',
    duration: '1 Year',
    eligibility: 'Class 8, 9, 10 students',
    features: ['NCERT + competitive syllabus', 'IQ and logical reasoning', 'Science Olympiad preparation', 'Regular parent updates'],
    fee: '₹40,000/year',
    isActive: true, order: 3,
  },
  {
    name: 'Board Exam Excellence',
    category: 'BOARD',
    icon: 'fas fa-trophy',
    description: 'Focused coaching for Class 10 and 12 Board exams to achieve top scores.',
    shortDesc: 'Score 90%+ in CBSE/ICSE/State board exams.',
    duration: '1 Year',
    eligibility: 'Class 10 / Class 12 students',
    features: ['CBSE/ICSE/State board coverage', 'Previous years paper practice', 'Revision classes', 'Chapter-wise tests'],
    fee: '₹35,000/year',
    isActive: true, order: 4,
  },
  {
    name: 'NTSE / Olympiad',
    category: 'NTSE',
    icon: 'fas fa-medal',
    description: 'Specialized course for NTSE, NSO, IMO, and other Olympiad examinations.',
    shortDesc: 'Win scholarships with Olympiad & NTSE coaching.',
    duration: '6 Months',
    eligibility: 'Class 9 and 10 students',
    features: ['MAT and SAT preparation', 'Olympiad special content', 'Scholarship guidance', 'Mock selection tests'],
    fee: '₹25,000',
    isActive: true, order: 5,
  },
];

const blogs = [
  {
    title: 'JEE 2025 Preparation Strategy: Week-by-Week Planner',
    content: `<p>Cracking JEE requires a strategic approach. Here is a week-by-week planner to help you make the most of your preparation time.</p>
<h3>Week 1-4: Concept Building</h3>
<p>Focus on NCERT and strengthen your fundamentals. Start with Class 11 topics and revise all formulae daily.</p>
<h3>Week 5-8: Problem Solving</h3>
<p>Shift to solving JEE-level problems. Use JEE previous year papers as a reference.</p>
<h3>Week 9-12: Mock Tests</h3>
<p>Start full syllabus mock tests. Analyze each test and identify your weak areas.</p>`,
    excerpt: 'A complete week-by-week preparation guide for JEE 2025 aspirants.',
    category: 'JEE Tips',
    tags: ['JEE', 'Preparation', 'Strategy'],
    metaDescription: 'JEE 2025 preparation strategy with a detailed week-by-week planner for aspirants.',
    isPublished: true,
  },
  {
    title: 'NEET Biology: Top 10 Topics You Must Master',
    content: `<p>Biology carries 360 marks in NEET, making it the most important subject. Here are the top 10 topics you must master.</p>
<ol>
<li><strong>Cell Biology</strong> – Structure, functions, and division</li>
<li><strong>Genetics & Evolution</strong> – Mendelian genetics and molecular basis</li>
<li><strong>Human Physiology</strong> – Digestion, circulation, and respiration</li>
<li><strong>Plant Physiology</strong> – Photosynthesis, respiration, and growth</li>
<li><strong>Ecology</strong> – Ecosystems, biodiversity, and environmental issues</li>
</ol>
<p>Focus on NCERT diagrams and practice labelling regularly.</p>`,
    excerpt: 'Master these 10 biology topics to maximize your NEET score.',
    category: 'NEET Tips',
    tags: ['NEET', 'Biology', 'NCERT'],
    metaDescription: 'Top 10 NEET Biology topics to master for maximum marks.',
    isPublished: true,
  },
  {
    title: 'How to Manage Stress During Board Exams',
    content: `<p>Board exam stress is real, but manageable. Here are proven techniques to stay calm and focused.</p>
<h3>1. Plan Your Day</h3>
<p>Create a daily schedule and stick to it. Allocate time for breaks, meals, and sleep.</p>
<h3>2. Exercise Daily</h3>
<p>Even 20 minutes of light exercise releases endorphins and reduces anxiety.</p>
<h3>3. Practice Mindfulness</h3>
<p>Deep breathing and short meditation before studying can improve focus significantly.</p>`,
    excerpt: 'Effective tips to manage board exam stress and perform at your best.',
    category: 'Tips & Tricks',
    tags: ['Stress Management', 'Board Exams', 'Study Tips'],
    metaDescription: 'How to manage stress during board exams with proven techniques.',
    isPublished: true,
  },
];

async function seed() {
  try {
    await Promise.all([
      Result.deleteMany({}),
      Faculty.deleteMany({}),
      Course.deleteMany({}),
      Blog.deleteMany({}),
    ]);
    console.log('🗑  Old data cleared');

    await Result.insertMany(results);
    console.log(`✅ Inserted ${results.length} results`);

    await Faculty.insertMany(faculty);
    console.log(`✅ Inserted ${faculty.length} faculty`);

    // Use .save() so pre-save slug hook fires
    for (const c of courses) { await new Course(c).save(); }
    console.log(`✅ Inserted ${courses.length} courses`);

    for (const b of blogs) {
      await new Blog({ ...b, publishedAt: b.isPublished ? new Date() : undefined }).save();
    }
    console.log(`✅ Inserted ${blogs.length} blog posts`);

    console.log('\n🎉 Seeding complete! You can now run: npm run dev');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
