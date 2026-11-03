import { SeasonInfo, NarrativeSectionData } from '@/types/portfolio';

export const SEASONS: Record<string, SeasonInfo> = {
  summer: {
    id: 'summer',
    name: 'Summer Heat',
    theme: 'Edge Diagnostics & Enterprise Compute',
    era: 'Amazon & Dell Era',
    ambientColor: '#f59e0b', // warm amber
    accentColor: '#d97706',
    description: 'High-temperature client-facing operations, embedded hardware triage, and enterprise compute clusters under heavy load.',
  },
  monsoon: {
    id: 'monsoon',
    name: 'Monsoon Rains',
    theme: 'AdTech Telemetry & Algorithmic Scale',
    era: 'Google Operations Center & Accenture Era',
    ambientColor: '#00f0ff', // electric cyan
    accentColor: '#0284c7',
    description: 'Navigating relentless telemetry deluges: billions of auction events, predictive Smart Bidding, and cloud conversion architectures.',
  },
  autumn: {
    id: 'autumn',
    name: 'Autumn Yield',
    theme: 'Multi-Asset Allocation & Trade Finance',
    era: 'ICICI Bank Era',
    ambientColor: '#eab308', // warm harvest gold
    accentColor: '#ca8a04',
    description: 'Institutional wealth stewardship, multi-asset risk parity, and structured commercial trade finance facilities.',
  },
  spring: {
    id: 'spring',
    name: 'Digital Spring',
    theme: 'Spatial Design & Additive Metallurgy',
    era: 'Templecity Atelier Era',
    ambientColor: '#10b981', // emerald & cyan
    accentColor: '#06b6d4',
    description: 'Parametric CAD reconstruction of Kalinga temple architecture, precision CoreXY additive manufacturing, and cold-cast bronze metallurgy.',
  },
  winter: {
    id: 'winter',
    name: 'Winter Frost',
    theme: 'Full-Stack 3D WebGL & Hybrid Vector RAG',
    era: 'nomadcoder-nt Studio Era',
    ambientColor: '#38bdf8', // crisp frost blue
    accentColor: '#e0f2fe',
    description: 'Production 60 FPS 3D WebGL engineering, custom GPU GLSL shaders, hybrid vector RAG systems, and zero-slop craft.',
  },
};

export const NARRATIVE_SECTIONS: NarrativeSectionData[] = [
  {
    id: 'ignition',
    index: '01',
    title: 'THE BEDROCK',
    subtitle: 'Edge Hardware Diagnostics & Firmware Triage',
    organization: 'Amazon Development Centre',
    seasonId: 'summer',
    seasonName: 'Summer Heat',
    period: 'Sep 2017 — Jun 2019',
    role: 'Edge Hardware Diagnostics & Firmware Triage Specialist',
    location: 'India Operations',
    summary:
      'Diagnosed firmware regressions, embedded Wi-Fi packet drops, and authentication timeouts across Echo, Fire TV, and Kindle devices. 85% first-contact resolution across high-volume operational queues.',
    narrativeParagraphs: [
      'I started at Amazon diagnosing real-time hardware regressions, embedded Wi-Fi packet drops, and authentication timeouts across Echo, Fire TV, and Kindle devices under immense operational load. Rather than relying on generic escalation tickets, I traced embedded logs, packet handshakes, and firmware versions directly to pinpoint where consumer edge devices failed.',
      'Maintaining an 85% first-contact resolution across more than 50,000 escalations taught me how hardware behaves under real-world household conditions. This direct physical triage formed my engineering bedrock: high-level software abstractions are only as reliable as their lowest physical substrate.',
    ],
    highlights: [
      'Engineered systematic triage trees for embedded firmware faults, Wi-Fi handshake packet drop, and authentication timeouts.',
      'Sustained an exceptional 85% first-contact resolution (FCR) rate across complex multi-device household network environments.',
      'Documented root-cause failure vectors directly feeding back into hardware engineering escalation loops and knowledge systems.',
    ],
    metrics: [
      { label: 'Incidents Triaged', value: '50,000+', detail: 'Consumer edge hardware failures' },
      { label: 'First Contact Res', value: '85%', detail: 'Consistently exceeded target benchmarks' },
      { label: 'Hardware Ecosystems', value: '3 Platforms', detail: 'Echo, Fire TV, Kindle' },
    ],
    technologies: ['Edge Hardware Diagnostics', 'Firmware Triage', 'Network Handshakes', 'Embedded Device Telemetry', 'Incident Trees'],
    keyArtifact: 'Echo & Fire TV Low-Level Diagnostic Matrix',
    bridgeText: 'Understanding physical edge client hardware laid the bedrock for architecting commercial enterprise server compute.',
    quickSummary: 'Diagnosed 50,000+ edge hardware incidents across Echo, Fire TV, and Kindle with 85% first-contact resolution and embedded firmware triage.',
  },
  {
    id: 'hardware-forge',
    index: '02',
    title: 'HARDWARE FORGE',
    subtitle: 'Enterprise Compute Architecture & Inside Sales',
    organization: 'Dell International Services',
    seasonId: 'summer',
    seasonName: 'Summer Heat',
    period: 'Jan 2020 — Nov 2021',
    role: 'Enterprise Compute Architecture & Commercial Inside Sales Partner',
    location: 'Global Commercial Markets',
    summary:
      'Configured enterprise PowerEdge rack/blade server specifications and Precision workstations for multinational commercial accounts. 118% quota attainment.',
    narrativeParagraphs: [
      'At Dell, I moved from consumer edge hardware into industrial data center compute. I configured enterprise PowerEdge rack and blade server specifications, high-throughput storage fabrics, and Precision workstations for multinational commercial accounts.',
      'Bridging architectural compute sizing with fast-moving enterprise procurement, I achieved 118% annualized quota attainment while reducing custom build-to-order procurement cycles by 22%. It gave me a deep operational understanding of enterprise infrastructure, thermal limits, and hardware deployment at commercial scale.',
    ],
    highlights: [
      'Architected bespoke Dell PowerEdge rack/blade server, storage array, and Precision workstation specifications for enterprise procurement.',
      'Achieved 118% annualized quota attainment across highly competitive multinational commercial segments.',
      'Synchronized high-velocity demand generation with factory build-to-order lead times, reducing customer procurement cycle turnaround by 22%.',
    ],
    metrics: [
      { label: 'Quota Attainment', value: '118%', detail: 'Annualized commercial target' },
      { label: 'Enterprise Accounts', value: '250+', detail: 'Mid-market & corporate clients' },
      { label: 'Procurement Velocity', value: '-22%', detail: 'Turnaround cycle reduction' },
    ],
    technologies: ['Dell PowerEdge Architecture', 'Enterprise Server Sizing', 'B2B Procurement', 'Storage Fabric', 'Pipeline Execution'],
    keyArtifact: 'Multi-Tier Commercial Compute Sizing Blueprint',
    bridgeText: 'Designing high-density enterprise compute ignited an obsession with what compute powers: high-velocity digital marketing telemetry.',
    quickSummary: 'Delivered 118% quota attainment architecting enterprise server solutions for 250+ accounts and slashing sales turnaround by 22%.',
  },
  {
    id: 'data-monsoon',
    index: '03',
    title: 'DATA MONSOON',
    subtitle: 'AdTech Telemetry, Auction Engineering & Dashboard Visualizations',
    organization: 'Google Operations Center',
    seasonId: 'monsoon',
    seasonName: 'Monsoon Rains',
    period: 'Dec 2021 — May 2023',
    role: 'AdTech Telemetry Strategist & Google Ads Specialist',
    location: 'APAC Operations',
    summary:
      'Escalation engineering for Google Ads auction delivery, conversion tracking anomalies, and Looker Studio/GA4 telemetry dashboards across $4.2M+ in annualized ad spend.',
    narrativeParagraphs: [
      'Joining the Google Operations Center, I stepped into the algorithmic heart of digital advertising. I handled escalation engineering for Google Ads auction delivery, conversion tracking anomalies, and Looker Studio/GA4 telemetry dashboards across $4.2M+ in annualized ad spend.',
      'Managing complex auction dynamics across Search, Display, and Performance Max required treating advertising as a distributed computing problem. By engineering automated telemetry dashboards and executing 120+ structured A/B tests, I drove an average +34% ROAS lift across enterprise client portfolios.',
    ],
    highlights: [
      'Orchestrated performance optimization cycles across massive Search, Display, and Video portfolios totaling $4.2M+ in annualized ad spend.',
      'Designed automated diagnostic dashboards in GA4 and Looker Studio tracking CPC volatility, CTR degradation, and auction bid competitiveness.',
      'Conducted 120+ structured multivariate A/B experiments across bidding strategies, creative copy, and dynamic landing page funnels.',
    ],
    metrics: [
      { label: 'Annualized Ad Spend', value: '$4.2M+', detail: 'Optimized brand budgets' },
      { label: 'Average ROAS Lift', value: '+34%', detail: 'Via Smart Bidding transitions' },
      { label: 'A/B Test Cadence', value: '120+', detail: 'Multivariate auction experiments' },
    ],
    technologies: ['Google Ads Auction Engine', 'GA4 Telemetry', 'Looker Studio Dashboards', 'Attribution Modeling', 'A/B Testing'],
    keyArtifact: 'Predictive Auction Bidding Matrix & Anomaly Detection Dashboard',
    bridgeText: 'Engineering automated ad auction logic led to consultative leadership in enterprise cloud scaling.',
    quickSummary: 'Stewarded $4.2M+ in Google Ads portfolio spend, driving +34% ROAS lift and executing 120+ auction A/B experiments.',
  },
  {
    id: 'cloud-canopy',
    index: '04',
    title: 'CLOUD CANOPY',
    subtitle: 'SMB Consultative Scaling & Automated Smart Bidding',
    organization: 'Accenture Solutions',
    seasonId: 'monsoon',
    seasonName: 'Monsoon Rains',
    period: 'May 2023 — May 2024',
    role: 'Digital Strategy Consultant & Cloud Campaign Lead',
    location: 'Enterprise Client Operations',
    summary:
      'Advised 340+ SMBs on transitioning from legacy manual CPC to machine learning Value-Based Bidding and first-party CRM data ingestion.',
    narrativeParagraphs: [
      'At Accenture, I focused on consultative scaling for 340+ high-growth SMBs, translating machine learning ad infrastructure into profitable commercial outcomes. I guided business leadership through transitioning from legacy manual CPC bidding to AI-driven Value-Based Bidding models.',
      'I engineered first-party data ingestion schemas to bridge offline CRM transactions back into automated bidding feedback loops, achieving a +48% post-consultation conversion lift and sustaining a 98.4% executive client satisfaction rating.',
    ],
    highlights: [
      'Delivered strategic digital audits transitioning SMB leadership from rigid manual CPC to machine learning Value-Based Bidding.',
      'Formulated first-party data ingestion schemas integrating offline CRM conversions back into cloud advertising engines.',
      'Maintained an industry-leading 98.4% executive client satisfaction rating across fast-moving scaling engagements.',
    ],
    metrics: [
      { label: 'SMBs Scaled', value: '340+', detail: 'High-growth businesses guided' },
      { label: 'Conversion Lift', value: '+48%', detail: 'Post-consultation volume increase' },
      { label: 'Client Satisfaction', value: '98.4%', detail: 'Executive CSAT score' },
    ],
    technologies: ['Value-Based Bidding', 'First-Party CRM Ingestion', 'Consultative Advisory', 'Performance Max', 'Cloud Campaign Scaling'],
    keyArtifact: 'AI Smart Bidding Migration Framework & Advisory Audit Protocol',
    bridgeText: 'Synthesizing macro data and conversion capital directly paved the path toward institutional wealth stewardship.',
    quickSummary: 'Advised 340+ high-growth SMBs to unlock a +48% conversion lift via AI Value-Based Bidding with a 98.4% CSAT rating.',
  },
  {
    id: 'the-harvest',
    index: '05',
    title: 'THE HARVEST',
    subtitle: 'Wealth & Trade Relationship Manager, Multi-Asset Allocation & Trade Finance',
    organization: 'ICICI Bank',
    seasonId: 'autumn',
    seasonName: 'Autumn Yield',
    period: 'Jun 2024 — Jun 2026',
    role: 'Wealth & Trade Relationship Manager',
    location: 'Retail & Private Client Division',
    summary:
      'Managed wealth portfolios and trade finance relationships for high-net-worth clients and commercial exporters. Multi-asset risk parity allocation and trade credit underwriting.',
    narrativeParagraphs: [
      'At ICICI Bank, I transitioned from digital capital allocation to private wealth and commercial trade stewardship, managing wealth portfolios and trade finance relationships for high-net-worth clients and commercial exporters across ₹12Cr+ in assets under management.',
      'I structured multi-asset risk parity portfolios balancing equity alpha, fixed income stability, and liquidity horizons, alongside underwriting trade credit facilities, cross-border letters of credit, and foreign exchange hedging. This discipline instilled an uncompromising respect for risk stewardship and real-world capital preservation.',
    ],
    highlights: [
      'Engineered customized asset allocation portfolios balancing equity alpha, fixed income stability, and liquidity horizons.',
      'Structured bespoke trade finance credit lines, letters of credit (LC), and cross-border bank guarantees for commercial import/export clients.',
      'Maintained a 96% client retention rate across turbulent interest rate cycles through quantitative macroeconomic briefings.',
    ],
    metrics: [
      { label: 'Managed AUM', value: '₹12Cr+', detail: 'High-net-worth asset base' },
      { label: 'Portfolio Sizing', value: '$50K+', detail: 'Per individual client portfolio' },
      { label: 'Relationship Retention', value: '96%', detail: 'Annualized client fidelity' },
    ],
    technologies: ['Multi-Asset Allocation', 'Trade Finance & LCs', 'Macroeconomic Risk Modeling', 'Portfolio Rebalancing', 'Regulatory Compliance'],
    keyArtifact: 'Risk-Adjusted Efficient Frontier Allocation & Trade Finance Matrix',
    bridgeText: 'Mastering disciplined capital allocation led to creating real-world physical value: founding a heritage 3D spatial atelier.',
    quickSummary: 'Stewarded ₹12Cr+ in private wealth AUM with 96% retention while structuring multi-asset allocations and commercial trade finance facilities.',
  },
  {
    id: 'roots-structure',
    index: '06',
    title: 'ROOTS & STRUCTURE',
    subtitle: 'Co-Founder & Head of Spatial Design, Mukteshvara Torana CAD, CoreXY 3D Printing & Cold-Cast Bronze',
    organization: 'Templecity Atelier LLP',
    seasonId: 'spring',
    seasonName: 'Digital Spring',
    period: 'Jul 2026 — Present',
    role: 'Co-Founder & Head of Spatial Design',
    location: 'Bhubaneswar / Digital Studio',
    summary:
      'Founded a physical 3D manufacturing atelier in Bhubaneswar. Reverse-engineered the 10th-century Mukteshvara Torana arch into a 1.24M polygon parametric CAD sculpt, producing cold-cast bronze replicas with ±0.15mm tolerances on CoreXY and 12K MSLA machines.',
    narrativeParagraphs: [
      'In Bhubaneswar, I co-founded Templecity Atelier to merge 10th-century Kalinga temple architecture with precision digital manufacturing. I reverse-engineered the monumental Mukteshvara Torana arch into a watertight 1.24-million polygon parametric CAD sculpt derived from hundreds of photogrammetric exposures.',
      'I engineered our production additive workflow across high-speed CoreXY 3D printers and 12K MSLA resin systems, achieving ±0.15mm fabrication tolerances with custom support topologies. Each piece is hand-finished in our proprietary cold-cast bronze formulation with atomized 325-mesh metal powder and authentic liver-of-sulfur antique patination.',
    ],
    highlights: [
      'Sculpted a watertight 1.24-million polygon CAD reconstruction of the Mukteshvara arch from 480 photogrammetric exposures with zero non-manifold defects.',
      'Engineered custom CoreXY and MSLA 3D printing pipelines achieving ±0.15mm fabrication tolerance with micro-touchpoint support lattices.',
      'Developed an in-house cold-cast bronze formulation with atomized 325-mesh metal powder and liver-of-sulfur antique patination for archival replicas.',
    ],
    metrics: [
      { label: 'CAD Polycount', value: '1.24M', detail: 'Watertight sculpted mesh' },
      { label: 'Fabrication Precision', value: '±0.15mm', detail: 'Additive dimensional tolerance' },
      { label: 'Bronze Composition', value: '80%', detail: 'Real 325-mesh metal powder' },
    ],
    technologies: ['Parametric CAD / Blender', 'CoreXY 3D Printing', 'MSLA Additive Slicing', 'Cold-Cast Bronze Metallurgy', 'Photogrammetry'],
    keyArtifact: 'Mukteshvara Torana Watertight CAD Blueprint & Toolpath Profile',
    bridgeText: 'Mastering physical 3D geometry and manufacturing unlocked the ultimate digital canvas: real-time 3D WebGL and GPU shaders.',
    quickSummary: 'Co-founded Templecity Atelier, engineering 1.24M-polygon Mukteshvara Torana CAD models, CoreXY 3D printing at ±0.15mm tolerance, and cold-cast bronze metallurgy.',
  },
  {
    id: 'the-horizon',
    index: '07',
    title: 'THE HORIZON',
    subtitle: 'Full-Stack 3D WebGL Engineering, GLSL Shaders & Hybrid Vector RAG Systems',
    organization: 'nomadcoder-nt Studio',
    seasonId: 'winter',
    seasonName: 'Winter Frost',
    period: 'Current & Future',
    role: 'Full-Stack 3D WebGL Engineer & AI Systems Architect',
    location: 'Global Web / nomadcoder-nt',
    summary:
      'Full-stack 3D WebGL engineering, custom GPU GLSL shaders, and autonomous hybrid vector RAG systems. Bridging 8+ years of hardware, AdTech, wealth, and manufacturing rigor into poetic engineering.',
    narrativeParagraphs: [
      'nomadcoder-nt Studio represents the convergence of all these disciplines: full-stack 3D WebGL creative engineering, custom GPU GLSL shaders, and autonomous hybrid vector RAG systems. I build web experiences that treat the browser as a high-performance graphical engine rather than a static document viewer.',
      'Every system here is engineered for zero-slop execution—60 FPS shader pipelines, sub-180ms semantic retrieval latencies, and human-crafted obsidian editorial design. It is where engineering rigor, capital allocation, and physical form unite.',
    ],
    highlights: [
      'Engineered custom GPU vertex and fragment shaders for real-time particles, snowflakes, and ripples with zero-overhead early culling locking 60 FPS.',
      'Built production Retrieval-Augmented Generation (RAG) pipelines with hybrid vector semantic search, low-latency prompt schemas, and <1.2% hallucination rates.',
      'Crafted an uncompromising obsidian dark technical aesthetic (bbsrguy.github.io standard) with dynamic seasonal CSS tokens and static export architecture.',
    ],
    metrics: [
      { label: 'Runtime Target', value: '60 FPS', detail: 'Zero-drop WebGL performance' },
      { label: 'Semantic Latency', value: '<180ms', detail: 'Median vector RAG retrieval' },
      { label: 'Engineering Code', value: 'Zero Slop', detail: 'Precision, craft & purpose' },
    ],
    technologies: ['React 19 / Next.js 15', 'Three.js / R3F', 'GLSL Shaders', 'Vector RAG & Embeddings', 'TypeScript', 'Tailwind CSS v4', 'Postprocessing'],
    keyArtifact: 'High-Performance GPU-Accelerated 3D WebGL Portfolio Architecture',
    bridgeText: 'Available for high-impact technical roles in 3D WebGL Creative Engineering, AI Systems Architecture, and Spatial Web Strategy.',
    quickSummary: 'Crafting butter-smooth 60 FPS 3D WebGL experiences with custom GLSL shaders and production hybrid vector RAG systems with <180ms latency.',
  },
];

export const SKILL_CATEGORIES = [
  {
    category: 'Spatial & 3D WebGL',
    level: 'Advanced Creative Engineering',
    items: ['Three.js', 'React Three Fiber (R3F)', 'Drei', 'Shader Logic (GLSL)', 'Blender Mesh Modeling', 'ScrollControls Parallax', 'Procedural Particles'],
  },
  {
    category: 'AI & Autonomous Systems',
    level: 'Production RAG & Pipelines',
    items: ['Gemini 2.5 / Flash SDK', 'Hybrid Vector RAG', 'Semantic Search', 'Prompt Architecture', 'Tool Calling & Agents', 'Structured JSON Output'],
  },
  {
    category: 'Frontend Engineering',
    level: 'Production-Grade Architecture',
    items: ['Next.js 15 (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Motion / Framer', 'Web Audio API', 'Responsive Layouts'],
  },
  {
    category: 'Growth & Performance Data',
    level: 'Enterprise Track Record',
    items: ['Google Ads (Search/PMax)', 'GA4 Telemetry', 'A/B Testing Roadmaps', 'Attribution Modeling', 'Multi-Asset Financial Advisory', 'Commercial Hardware B2B'],
  },
];
