import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

const CAMPUS_CLUBS = [
  {
    id: 'gdsc',
    name: 'Google Developer Student Club (GDSC)',
    category: 'Technology & Cloud',
    description: 'Community for university students to bridge the gap between theory and practice using Google technologies.',
    lead: 'Rohan Sharma',
    membersCount: 420,
    icon: 'Terminal',
    color: 'from-blue-500 to-emerald-500',
    banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    tags: ['Web Dev', 'Cloud', 'Android', 'AI/ML'],
    meetingVenue: 'Innovation Center Room 204',
    contactEmail: 'gdsc@college.edu',
  },
  {
    id: 'acm',
    name: 'ACM Student Chapter',
    category: 'Computer Science & Research',
    description: 'Premier computing society advancing technical excellence, competitive programming, and algorithmic problem solving.',
    lead: 'Aanya Patel',
    membersCount: 350,
    icon: 'Cpu',
    color: 'from-indigo-500 to-purple-500',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    tags: ['Algorithms', 'Hackathons', 'CP', 'Open Source'],
    meetingVenue: 'Turing Computer Lab 3',
    contactEmail: 'acm@college.edu',
  },
  {
    id: 'robotics',
    name: 'Apex Robotics & Automation Cell',
    category: 'Robotics & Hardware',
    description: 'Hands-on makerspace building autonomous bots, drones, IoT hardware, and competing in National Robowars.',
    lead: 'Vikramaditya Roy',
    membersCount: 280,
    icon: 'Bot',
    color: 'from-amber-500 to-red-500',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    tags: ['RoboWars', 'IoT', 'Drones', 'Arduino/ROS'],
    meetingVenue: 'Makerspace Ground Floor Workshop',
    contactEmail: 'robotics@college.edu',
  },
  {
    id: 'crescendo',
    name: 'Crescendo - Music & Acoustic Society',
    category: 'Music & Cultural Arts',
    description: 'The heartbeat of campus cultural life, hosting open mic nights, Battle of the Bands, and unplugged acoustic sessions.',
    lead: 'Sara Khan',
    membersCount: 310,
    icon: 'Music',
    color: 'from-pink-500 to-rose-500',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    tags: ['Battle of Bands', 'Vocals', 'Guitar', 'Acoustic'],
    meetingVenue: 'Amphitheatre & Music Studio',
    contactEmail: 'crescendo@college.edu',
  },
  {
    id: 'cyberknights',
    name: 'CyberKnights - Security & CTF Guild',
    category: 'Cybersecurity',
    description: 'Elite student defense squad mastering ethical hacking, penetration testing, reverse engineering, and global CTF battles.',
    lead: 'Devansh Verma',
    membersCount: 220,
    icon: 'Shield',
    color: 'from-teal-500 to-cyan-500',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    tags: ['CTF', 'Bug Bounty', 'Network Sec', 'Crypto'],
    meetingVenue: 'Cyber Defense Lab 402',
    contactEmail: 'cyberknights@college.edu',
  },
  {
    id: 'zenith',
    name: 'Zenith - Sports & E-Sports Union',
    category: 'Sports & Gaming',
    description: 'Organizing inter-college football, basketball championships alongside high-stakes Valorant & BGMI e-sports tournaments.',
    lead: 'Karan Mehra',
    membersCount: 460,
    icon: 'Gamepad2',
    color: 'from-emerald-500 to-teal-500',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    tags: ['E-Sports', 'Football', 'Valorant', 'Basketball'],
    meetingVenue: 'Sports Complex & Gaming Arena',
    contactEmail: 'zenith@college.edu',
  },
  {
    id: 'ecell',
    name: 'E-Cell - Entrepreneurship Hub',
    category: 'Startups & Business',
    description: 'Fostering future student founders, hosting Shark Tank style pitch decks, venture capital talks, and startup incubation.',
    lead: 'Ananya Singhania',
    membersCount: 290,
    icon: 'Rocket',
    color: 'from-violet-500 to-fuchsia-500',
    banner: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    tags: ['Pitching', 'Venture Capital', 'Networking', 'Startups'],
    meetingVenue: 'Startup Incubation Bay 101',
    contactEmail: 'ecell@college.edu',
  },
];

// @route   GET /api/clubs
// @desc    Get all campus clubs and dynamic count of active events hosted
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Count events hosted by each club
    const clubEventCounts = await Event.aggregate([
      { $group: { _id: '$club', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    clubEventCounts.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const enrichedClubs = CAMPUS_CLUBS.map((club) => {
      // Check matching event counts
      const matchingCount =
        countMap[club.name] ||
        Object.keys(countMap).find((k) => k.toLowerCase().includes(club.id)) ||
        0;

      return {
        ...club,
        activeEventsCount: typeof matchingCount === 'number' ? matchingCount : 1,
      };
    });

    return res.status(200).json({
      success: true,
      clubs: enrichedClubs,
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve clubs directory.',
    });
  }
});

export default router;
