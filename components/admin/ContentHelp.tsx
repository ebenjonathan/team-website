import { ExternalLink } from 'lucide-react'

const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL

const editable = [
  'Services and their details',
  'Case stories',
  'FAQs',
  'Partners and client logos',
  'Practice notes (articles)',
  'Company profile, stats and contact details',
  'Principal consultants',
  'Downloadable files',
]

export default function ContentHelp() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-5">
      <div>
        <h2 className="text-lg font-bold">Edit other website content</h2>
        <p className="mt-1 text-sm text-white/60 max-w-2xl">
          The rest of the website’s content is edited in TEAM Studio, the content editor that comes with this site.
          Changes there appear on the website within a minute, with no developer needed.
        </p>
      </div>

      <ul className="grid gap-x-8 gap-y-1 text-sm text-white/80 sm:grid-cols-2">
        {editable.map((e) => (
          <li key={e}>• {e}</li>
        ))}
      </ul>

      {studioUrl ? (
        <a href={studioUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold hover:bg-primary-dark">
          Open TEAM Studio <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100 space-y-2">
          <p className="font-semibold">TEAM Studio is not connected yet.</p>
          <p>
            Until it is, this content comes from the files in the website code. Your developer can connect it in about
            an hour using the steps in <code>ADMIN-SETUP.md</code>. Then this page will show an “Open TEAM Studio” button.
          </p>
        </div>
      )}
    </section>
  )
}
