import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhive';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB database:', mongoose.connection.name);

    // Check if events already exist
    const count = await Event.countDocuments();
    if (count > 0) {
      console.log(`[Seed] Database already has ${count} events. Skipping seed.`);
      return;
    }

    console.log('[Seed] Database is empty. Seeding EventHive initial data...');

    // 1. Create Demo Users
    const studentUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex.student@college.edu',
      password: 'password123',
      college: 'Apex Institute of Technology',
      department: 'Computer Science & Engineering',
      year: '3rd Year (Junior)',
      studentId: 'AIT-CS-2023-042',
      role: 'student',
      clubAffiliation: 'ACM Student Chapter',
      interests: ['Hackathons', 'Tech Fests', 'AI Workshops'],
    });

    const organizerUser = await User.create({
      name: 'Priya Sharma',
      email: 'priya.organizer@campus.edu',
      password: 'password123',
      college: 'Apex Institute of Technology',
      department: 'Information Technology',
      year: '4th Year (Senior)',
      studentId: 'AIT-IT-2022-019',
      role: 'organizer',
      clubAffiliation: 'Google Developer Student Club (GDSC)',
      interests: ['Web Dev', 'Hackathons', 'Community Organizing'],
    });

    console.log('[Seed] Created demo student & organizer accounts.');

    // 2. Create Events
    const initialEvents = [
      {
        title: 'HackNova 2026 — 36-Hour National College Hackathon',
        tagline: 'Build, hack, and deploy AI, Web3 & Sustainable Tech solutions',
        description:
          'Join over 600 bright student developers, designers, and innovators for 36 hours of non-stop building! With tracks in Generative AI, Web3, Smart Campus, and Climate Tech, you get mentorship from top tech leads, free meals, Red Bull stations, and a monster prize pool.',
        category: 'Hackathon',
        club: 'Google Developer Student Club (GDSC)',
        college: 'Apex Institute of Technology',
        venue: 'Central Auditorium & Main Computing Cluster (Building 3)',
        mode: 'Hybrid',
        date: '2026-11-14',
        time: '09:00 AM - 09:00 PM (36 Hours)',
        registrationDeadline: '2026-11-10',
        entryFee: 0,
        prizePool: '₹2,50,000 + Internship Offers',
        teamSize: 'Team of 2 - 4',
        capacity: 250,
        registeredCount: 184,
        bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
        tags: ['Hackathon', 'AI', 'FullStack', 'PrizePool', 'FreeFood'],
        schedule: [
          { time: 'Day 1 - 09:00 AM', title: 'Check-in, Swag Bag & Breakfast', description: 'Collect your hacker badge and exclusive hoodie' },
          { time: 'Day 1 - 10:30 AM', title: 'Opening Keynote & Problem Statements', description: 'Tracks unveiled by sponsor engineers' },
          { time: 'Day 1 - 11:30 AM', title: 'Hacking Kicks Off!', description: 'Timer starts, mentor check-ins' },
          { time: 'Day 2 - 04:00 PM', title: 'Hacking Concludes & Project Demos', description: 'Live expo in the exhibition hall' },
          { time: 'Day 2 - 07:00 PM', title: 'Awards Gala & Closing Ceremony', description: 'Trophies and internship announcements' },
        ],
        rules: [
          'Teams must consist of 2 to 4 currently enrolled college students.',
          'All project code must be authored during the 36-hour hackathon window.',
          'Open-source libraries and APIs are permitted; pre-built full applications are prohibited.',
        ],
        organizer: organizerUser._id,
        organizerName: 'Priya Sharma (GDSC Lead)',
        contactEmail: 'hacknova@campus.edu',
        contactPhone: '+91 98112 34567',
        isFeatured: true,
      },
      {
        title: 'Pulse ’26 — Battle of the Campus Bands & Cultural Night',
        tagline: 'High-voltage live music, electrifying riffs, and campus rock energy',
        description:
          'The ultimate musical showdown where 12 collegiate rock, metal, indie, and fusion bands battle it out on a stadium-grade stage with pro audio and lighting. Featuring an acoustic opening act and a celebrity headliner to close the night!',
        category: 'Cultural Fest',
        club: 'Crescendo - Music & Acoustic Society',
        college: 'Apex Institute of Technology',
        venue: 'Open-Air Amphitheatre (OAT)',
        mode: 'In-Person',
        date: '2026-11-20',
        time: '05:30 PM - 10:30 PM',
        registrationDeadline: '2026-11-18',
        entryFee: 0,
        prizePool: '₹75,000 + Studio Recording Deal',
        teamSize: 'Squad of 3 - 7 Members',
        capacity: 800,
        registeredCount: 620,
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
        tags: ['Music', 'BattleOfBands', 'Rock', 'LiveConcert', 'CampusNight'],
        schedule: [
          { time: '05:30 PM', title: 'Gates Open & Acoustic Prelims', description: 'Campus duo openers' },
          { time: '06:45 PM', title: 'Main Battle of Bands', description: 'Top 10 collegiate bands perform original & covers' },
          { time: '09:30 PM', title: 'Headline Guest Performance', description: 'Surprise Indie Rock band performance' },
          { time: '10:15 PM', title: 'Trophy Presentation & Best Drummer/Vocalist Awards', description: 'Crowd voting and jury scores' },
        ],
        rules: [
          'Each band gets 15 minutes of stage time including line check.',
          'Standard drum kit, amps, and mic monitors provided. Bring your own guitars/keys.',
        ],
        organizer: organizerUser._id,
        organizerName: 'Sara Khan (Crescendo President)',
        contactEmail: 'pulse@campus.edu',
        contactPhone: '+91 98223 45678',
        isFeatured: true,
      },
      {
        title: 'Apex Robowars & Autonomous Drone Arena',
        tagline: '15kg & 30kg metal-crushing combat and high-speed obstacle drone racing',
        description:
          'Hear the screeching saws, crushing flippers, and spinning drums in our bulletproof Lexan polycarbonate combat arena! Teams from top engineering universities compete in 15kg/30kg weight categories, accompanied by an acrobatic FPV drone obstacle speed race.',
        category: 'Tech Fest',
        club: 'Apex Robotics & Automation Cell',
        college: 'Apex Institute of Technology',
        venue: 'Mechanical Workshop & Indoor Sports Arena',
        mode: 'In-Person',
        date: '2026-11-28',
        time: '10:00 AM - 06:00 PM',
        registrationDeadline: '2026-11-25',
        entryFee: 150,
        prizePool: '₹1,20,000 Cash Pool',
        teamSize: 'Team of 2 - 5',
        capacity: 180,
        registeredCount: 142,
        bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80',
        tags: ['Robotics', 'Robowars', 'Combat', 'Drones', 'Hardware'],
        schedule: [
          { time: '10:00 AM', title: 'Safety Inspection & Weigh-In', description: 'Failsafe switch tests & weapon specs' },
          { time: '11:30 AM', title: 'Qualifying Bouts (Round of 16)', description: '3-minute adrenaline deathmatches' },
          { time: '02:30 PM', title: 'FPV Drone Obstacle Race Finals', description: 'High-speed LED ring flying' },
          { time: '04:30 PM', title: 'Robowars Semi-Finals & Grand Finale', description: 'Championship showdown' },
        ],
        rules: [
          'Bots must adhere strictly to 15kg/30kg weight limits including battery.',
          'Mandatory wireless radio frequency failsafe cutoff required.',
        ],
        organizer: organizerUser._id,
        organizerName: 'Vikramaditya Roy (Robotics Lead)',
        contactEmail: 'robotics@campus.edu',
        contactPhone: '+91 98334 56789',
        isFeatured: true,
      },
      {
        title: 'Full-Stack AI Agents & LLM Masterclass Bootcamp',
        tagline: 'Build autonomous agents with LangChain, Next.js, FastAPI & Vector DBs',
        description:
          'A hands-on, laptop-open masterclass led by industry software engineers. Learn how to architect, build, and deploy multi-agent systems, implement Retrieval-Augmented Generation (RAG) with vector databases, and deploy production endpoints.',
        category: 'Workshop',
        club: 'ACM Student Chapter',
        college: 'Apex Institute of Technology',
        venue: 'Alan Turing Computing Lab 301',
        mode: 'Hybrid',
        date: '2026-12-05',
        time: '10:00 AM - 03:30 PM',
        registrationDeadline: '2026-12-03',
        entryFee: 0,
        prizePool: 'Certificates + Pro Cloud Credits',
        teamSize: 'Individual',
        capacity: 120,
        registeredCount: 110,
        bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
        tags: ['AI', 'Workshop', 'Python', 'LLM', 'HandsOn'],
        schedule: [
          { time: '10:00 AM', title: 'Foundations of Modern LLM Architectures', description: 'Tokenization, embeddings, and context windows' },
          { time: '11:30 AM', title: 'Building Production RAG Pipelines', description: 'Chunking, hybrid search, and reranking' },
          { time: '01:30 PM', title: 'Autonomous Multi-Agent Orchestration', description: 'Tool calling, memory, and reflection' },
          { time: '03:00 PM', title: 'Deploying & Scaling Your AI Agent', description: 'Dockerizing and hosting live on cloud' },
        ],
        rules: [
          'Bring your own laptop with Node.js and Python 3.10+ installed.',
          'Git familiarity is recommended.',
        ],
        organizer: organizerUser._id,
        organizerName: 'Aanya Patel (ACM Chair)',
        contactEmail: 'acm-bootcamp@campus.edu',
        contactPhone: '+91 98445 67890',
        isFeatured: false,
      },
      {
        title: 'Inter-College E-Sports Clash (Valorant & BGMI)',
        tagline: 'High-stakes 5v5 competitive gaming on 240Hz tournament rigs',
        description:
          'The premier campus gaming showdown! 32 collegiate squads face off in a double-elimination Valorant tournament and 4 dynamic lobby matches in BGMI. Live casting by popular gaming streamers on Twitch & YouTube.',
        category: 'Sports & E-Sports',
        club: 'Zenith - Sports & E-Sports Union',
        college: 'Apex Institute of Technology',
        venue: 'Student Activity Center Esports Arena',
        mode: 'In-Person',
        date: '2026-12-12',
        time: '11:00 AM - 08:00 PM',
        registrationDeadline: '2026-12-09',
        entryFee: 200,
        prizePool: '₹1,00,000 + Gaming Gear',
        teamSize: 'Squad of 5 + 1 Sub',
        capacity: 160,
        registeredCount: 155,
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
        tags: ['Gaming', 'Esports', 'Valorant', 'BGMI', 'Tournament'],
        schedule: [
          { time: '11:00 AM', title: 'Captains Briefing & Map Vetoes', description: 'Standard competitive map pool' },
          { time: '12:00 PM', title: 'Group Stage Fixtures (Bo1)', description: 'Simultaneous 4-stream bracket' },
          { time: '04:30 PM', title: 'Semi-Finals & Lower Bracket Final (Bo3)', description: 'Main stage with live shoutcasting' },
          { time: '06:30 PM', title: 'Grand Finale & MVP Trophy Presentation', description: 'Bo5 championship match' },
        ],
        rules: [
          'All players must be active college students with valid student IDs.',
          'Standard tournament competitive rulebook applies. Anti-cheat mandatory.',
        ],
        organizer: organizerUser._id,
        organizerName: 'Karan Mehra (Esports Coordinator)',
        contactEmail: 'esports@campus.edu',
        contactPhone: '+91 98556 78901',
        isFeatured: true,
      },
      {
        title: 'Founder’s Den: Campus Pitch Deck & Angel Summit',
        tagline: 'Pitch your startup idea to top angel investors and venture capitalists',
        description:
          'Got a disruptive campus startup idea or MVP? Pitch live in front of leading angel investors, alumni founders, and venture fund scouts. 15 selected startups pitch for equity-free seed grants, cloud credits, and accelerator spots.',
        category: 'Seminar & Talk',
        club: 'E-Cell - Entrepreneurship Hub',
        college: 'Apex Institute of Technology',
        venue: 'Management Block Executive Auditorium',
        mode: 'Hybrid',
        date: '2026-12-18',
        time: '01:00 PM - 06:00 PM',
        registrationDeadline: '2026-12-14',
        entryFee: 0,
        prizePool: '₹5,00,000 Equity-Free Seed Fund',
        teamSize: 'Team of 1 - 4 Co-founders',
        capacity: 200,
        registeredCount: 128,
        bannerUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
        tags: ['Startups', 'Pitching', 'VentureCapital', 'Ecell', 'SeedFund'],
        schedule: [
          { time: '01:00 PM', title: 'Fireside Chat: From Dorm Room to Series A', description: 'Alumni founder keynote' },
          { time: '02:15 PM', title: 'Live Pitching Session (Round 1: 8 Startups)', description: '5-min pitch + 3-min investor Q&A' },
          { time: '04:00 PM', title: 'High-Tea & Founder-Investor Speed Networking', description: 'One-on-one booth conversations' },
          { time: '05:15 PM', title: 'Seed Grant Award & Term Sheet Announcements', description: 'Celebration ceremony' },
        ],
        rules: [
          'At least one founder must be a current college student or recent graduate (2025/2026).',
          'Pitch deck format: 10 slides max (Problem, Solution, Market, Traction, Team).',
        ],
        organizer: organizerUser._id,
        organizerName: 'Ananya Singhania (E-Cell President)',
        contactEmail: 'ecell-pitch@campus.edu',
        contactPhone: '+91 98667 89012',
        isFeatured: false,
      },
      {
        title: 'DesignSprint 2026: UI/UX & Generative Designathon',
        tagline: 'Craft human-centric digital interfaces, micro-interactions & design systems',
        description:
          'A fast-paced 12-hour design marathon! Tackle real-world design briefs for social impact, campus mobility, and fintech. Judged by senior design directors on visual craft, design thinking rigor, user empathy, and interactive prototypes.',
        category: 'Design & Arts',
        club: 'Apex Creative Guild',
        college: 'Apex Institute of Technology',
        venue: 'Design Innovation Studio & Mac Lab',
        mode: 'In-Person',
        date: '2026-12-22',
        time: '09:00 AM - 09:00 PM',
        registrationDeadline: '2026-12-20',
        entryFee: 0,
        prizePool: '₹50,000 + Figma Pro Annual Licenses',
        teamSize: 'Solo or Duo (1 - 2)',
        capacity: 100,
        registeredCount: 78,
        bannerUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80',
        tags: ['UIUX', 'Figma', 'Designathon', 'ProductDesign', 'Creativity'],
        schedule: [
          { time: '09:00 AM', title: 'Prompt Reveal & Empathy Mapping', description: 'Brief release across 3 tracks' },
          { time: '01:00 PM', title: 'Wireframing & Mid-Sprint Critique', description: 'Feedback from design mentors' },
          { time: '06:30 PM', title: 'Final Prototype Submission on Figma', description: 'Interactive click-throughs locked' },
          { time: '07:30 PM', title: 'Showcase & People’s Choice Voting', description: 'Exhibition of best UI screens' },
        ],
        rules: [
          'All designs must be submitted via Figma links with view access.',
          'Submissions must include design system components and high-fidelity prototype flows.',
        ],
        organizer: organizerUser._id,
        organizerName: 'Rahul Verma (Design Lead)',
        contactEmail: 'designsprint@campus.edu',
        contactPhone: '+91 98778 90123',
        isFeatured: false,
      },
    ];

    const createdEvents = await Event.insertMany(initialEvents);
    console.log(`[Seed] Successfully seeded ${createdEvents.length} events into MongoDB!`);

    // 3. Create a sample ticket for Alex for the flagship HackNova event
    const hacknovaEvent = createdEvents[0];
    await Registration.create({
      user: studentUser._id,
      event: hacknovaEvent._id,
      ticketCode: 'EH-2026-X89B',
      teamName: 'NeuralKnights',
      teamMembers: ['Alex Rivera (Lead)', 'Siddharth Nair', 'Neha Gupta'],
      status: 'confirmed',
      registeredAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
      notes: 'Super excited to build an on-device AI college companion!',
    });

    console.log(`[Seed] Seeded sample digital pass (EH-2026-X89B) for student Alex Rivera!`);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
  }
};
