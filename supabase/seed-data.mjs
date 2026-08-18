// Seed script for the new feature tables.
// Run inside the web container: node supabase/seed-data.mjs
// Uses the service-role key (from env) so it can write to all tables.
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}
const sb = createClient(url, key)

// --- helpers -------------------------------------------------------------
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const uid = () => crypto.randomUUID()

const ITINERARIES = {
  default: [
    { title: 'Half Day Old City Walking Tour', duration: 'half', stops: ['Jaffa Gate', 'Western Wall', 'Church of the Holy Sepulchre', 'Cardo'] },
    { title: 'Full Day Highlights Tour', duration: 'full', stops: ['Mount of Olives', 'Old City', 'Yad Vashem', 'Mahane Yehuda Market'] },
    { title: 'Multi-Day Northern Explorer', duration: 'multi', stops: ['Galilee', 'Golan Heights', 'Nazareth', 'Capernaum'] },
  ],
  food: [
    { title: 'Half Day Culinary Market Tour', duration: 'half', stops: ['Carmel Market', 'Levinsky Spice Market', 'Rothschild Blvd'] },
    { title: 'Full Day Food & Wine Experience', duration: 'full', stops: ['Mahane Yehuda', 'Abu Ghosh', 'Local Winery'] },
  ],
  adventure: [
    { title: 'Full Day Desert Adventure', duration: 'full', stops: ['Masada Sunrise', 'Ein Gedi Oasis', 'Dead Sea Float'] },
    { title: 'Half Day Desert Hike', duration: 'half', stops: ['Makhtesh Ramon', 'Desert Wildlife'] },
  ],
  christian: [
    { title: 'Full Day Holy Land Pilgrimage', duration: 'full', stops: ['Sea of Galilee', 'Capernaum', 'Mount of Beatitudes', 'Jordan River'] },
    { title: 'Half Day Jerusalem Christian Sites', duration: 'half', stops: ['Via Dolorosa', 'Church of the Holy Sepulchre', 'Garden Tomb'] },
  ],
}

const FAQS = [
  { q: 'What is included in the tour price?', a: 'The price includes my services as your licensed guide, transportation planning, and a fully customized itinerary. Entrance fees and meals are not included unless noted.' },
  { q: 'How do I book and pay?', a: 'You can book instantly online or send an inquiry. A small deposit secures your date, and the balance is paid directly to me on the day of the tour.' },
  { q: 'Can the tour be customized?', a: 'Absolutely! Every tour is tailored to your interests, pace, and group. Just let me know your preferences when booking.' },
  { q: 'What languages do you guide in?', a: 'I guide in multiple languages — see the languages listed on my profile. Translators can be arranged for other languages on request.' },
  { q: 'What is your cancellation policy?', a: 'Full refund up to 7 days before the tour. Within 7 days, the deposit is non-refundable, but we can reschedule at no charge.' },
  { q: 'Do you accommodate large groups?', a: 'Yes, I can arrange transportation and logistics for groups of any size. Contact me for a custom quote.' },
]

const LEAD_NAMES = ['John Smith', 'Maria Garcia', 'Ahmed Hassan', 'Sarah Cohen', 'David Lee', 'Emma Wilson', 'Luca Rossi', 'Sophie Martin']
const LEAD_SOURCES = ['website', 'referral', 'whatsapp', 'email', 'phone']
const LEAD_STAGES = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']

function offeringFor(guide, base) {
  // pick an itinerary theme based on tour_types/specialties
  const types = (guide.tour_types || []).map((t) => String(t).toLowerCase())
  let set = ITINERARIES.default
  if (types.some((t) => t.includes('food') || t.includes('culinary'))) set = ITINERARIES.food
  else if (types.some((t) => t.includes('adventure') || t.includes('desert') || t.includes('hike'))) set = ITINERARIES.adventure
  else if (types.some((t) => t.includes('christian') || t.includes('pilgrim') || t.includes('holy'))) set = ITINERARIES.christian
  return base || set[0]
}

// --- main ----------------------------------------------------------------
async function run() {
  const { data: guides, error } = await sb.from('guides').select('*').order('created_at', { ascending: true })
  if (error) { console.error('Failed to fetch guides:', error.message); process.exit(1) }
  console.log(`Seeding ${guides.length} guides...`)

  // Detect which optional tables exist
  const tables = ['tour_offerings', 'tour_stops', 'guide_pricing', 'guide_faqs', 'guide_verifications', 'crm_leads', 'crm_activities', 'ad_campaigns', 'traveler_profiles']
  const exists = {}
  for (const t of tables) {
    const { error: e } = await sb.from(t).select('id').limit(1)
    exists[t] = !e || !e.message.includes('Could not find the table')
    console.log(`  table ${t}: ${exists[t] ? 'exists' : 'MISSING'}`)
  }

  // Clear existing seed rows (idempotent re-run).
  // Child tables (tour_stops, crm_activities) cascade via FK ON DELETE CASCADE
  // when their parent (tour_offerings / crm_leads) rows are removed.
  const guideIds = guides.map((g) => g.id)
  for (const t of ['tour_offerings', 'guide_pricing', 'guide_faqs', 'guide_verifications', 'crm_leads', 'ad_campaigns']) {
    if (!exists[t]) continue
    const { error: de } = await sb.from(t).delete().in('guide_id', guideIds)
    if (de) console.warn(`  cleanup ${t}: ${de.message}`)
  }

  let count = 0
  for (const guide of guides) {
    const id = guide.id
    const exp = guide.years_experience || 5
    const priceBase = 200 + Math.min(exp, 20) * 10

    // --- tour_offerings + stops ---
    if (exists.tour_offerings) {
      const theme = offeringFor(guide)
      const offerings = [ITINERARIES.default[0], ITINERARIES.default[1], offeringFor(guide)].filter((v, i, a) => a.findIndex((x) => x.title === v.title) === i).slice(0, 3)
      for (const o of offerings) {
        const { data: off } = await sb.from('tour_offerings').insert({
          guide_id: id, title: o.title, duration: o.duration,
          description: `A ${o.duration === 'half' ? 'half-day' : o.duration === 'full' ? 'full-day' : 'multi-day'} tour with ${guide.full_name}. ${o.stops.join(', ')}.`,
        }).select().single()
        if (off && exists.tour_stops && o.stops) {
          const stops = o.stops.map((title, i) => ({
            tour_offering_id: off.id, title,
            time: i === 0 ? '09:00' : i === 1 ? '11:00' : i === 2 ? '13:00' : '15:00',
            description: `Visit ${title}.`,
            order_index: i,
          }))
          await sb.from('tour_stops').insert(stops)
        }
      }
    }

    // --- guide_pricing ---
    if (exists.guide_pricing) {
      const tiers = [
        { duration: 'half', min: 1, max: 4, flat: priceBase },
        { duration: 'half', min: 5, max: 10, flat: priceBase + 80 },
        { duration: 'full', min: 1, max: 4, flat: priceBase * 2 },
        { duration: 'full', min: 5, max: 10, flat: priceBase * 2 + 120 },
      ]
      await sb.from('guide_pricing').insert(tiers.map((t) => ({
        guide_id: id, duration: t.duration, group_size_min: t.min, group_size_max: t.max, flat_rate: t.flat,
        description: `${t.duration === 'half' ? 'Half' : 'Full'} day for ${t.min}-${t.max} guests`,
      })))
    }

    // --- guide_faqs ---
    if (exists.guide_faqs) {
      const faqs = FAQS.slice(0, 4).map((f, i) => ({ guide_id: id, question: f.q, answer: f.a, order_index: i }))
      await sb.from('guide_faqs').insert(faqs)
    }

    // --- guide_verifications ---
    if (exists.guide_verifications && guide.licensed_guide_number) {
      await sb.from('guide_verifications').insert({
        guide_id: id, license_number: guide.licensed_guide_number, status: 'approved',
        reviewer_notes: 'Verified license number.', submitted_at: guide.created_at,
        reviewed_at: guide.updated_at,
      })
    }

    count++
  }

  // --- crm_leads for first 6 guides ---
  if (exists.crm_leads) {
    for (let i = 0; i < Math.min(6, guides.length); i++) {
      const guide = guides[i]
      for (let j = 0; j < 3; j++) {
        const stage = LEAD_STAGES[(i + j) % LEAD_STAGES.length]
        const lead = {
          guide_id: guide.id, traveler_name: LEAD_NAMES[(i + j) % LEAD_NAMES.length],
          source: LEAD_SOURCES[(i + j) % LEAD_SOURCES.length], stage,
          tour_date: new Date(Date.now() + (j + 1) * 14 * 86400000).toISOString().slice(0, 10),
          group_size: 2 + j, budget: ['$500-$1000', '$1000-$2000', '$2000+'][j % 3],
          notes: 'Interested in a private tour.',
        }
        const { data: created } = await sb.from('crm_leads').insert(lead).select().single()
        if (created && exists.crm_activities) {
          await sb.from('crm_activities').insert([
            { lead_id: created.id, type: 'note', description: 'Lead created from inquiry.' },
            { lead_id: created.id, type: 'stage_change', description: `Moved to ${stage}.` },
          ])
        }
      }
    }
  }

  // --- ad_campaigns for first 3 guides ---
  if (exists.ad_campaigns) {
    const placements = ['search_featured', 'homepage', 'region_page']
    for (let i = 0; i < Math.min(3, guides.length); i++) {
      const guide = guides[i]
      await sb.from('ad_campaigns').insert({
        guide_id: guide.id, name: `${guide.full_name.split(' ')[0]}'s Featured Campaign`,
        placement: placements[i], status: 'active',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        budget: 500, impressions: 1200 + i * 300, clicks: 45 + i * 12,
      })
    }
  }

  // --- counts ---
  console.log('\n--- Resulting counts ---')
  for (const t of tables) {
    if (!exists[t]) continue
    const { count } = await sb.from(t).select('*', { count: 'exact', head: true })
    console.log(`  ${t}: ${count}`)
  }
  console.log('\nSeed complete.')
}

run().catch((e) => { console.error(e); process.exit(1) })
