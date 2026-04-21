import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Mentions légales — FocusFlow" }

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors mb-8 inline-block">
          ← Retour
        </Link>

        <h1 className="text-2xl font-semibold text-white mb-2">Mentions légales</h1>
        <p className="text-xs text-neutral-600 mb-10">
          Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance en l'économie numérique (LCEN)
        </p>

        <div className="flex flex-col gap-8 text-sm text-neutral-400 leading-relaxed">
          <section>
            <h2 className="text-white text-sm font-medium mb-2">Éditeur du site</h2>
            <p>Nom : <span className="text-neutral-300">Ait Si Ali Khadidja</span></p>
            <p>Email : <span className="text-neutral-300">khadidja.aitsiali@gmail.com</span></p>
            <p>Adresse : <span className="text-neutral-300">Bd de l'Europe, Maubeuge</span></p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">Hébergement</h2>
            <p>Ce site est hébergé par :</p>
            <p className="text-neutral-300">Vercel Inc.</p>
            <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
            <p>
              <a href="https://vercel.com" className="text-accent/70 hover:text-accent transition-colors">
                https://vercel.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (code, design, textes) est la propriété exclusive de l'éditeur.
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">Données personnelles</h2>
            <p>
              Pour toute information relative au traitement de tes données personnelles, consulte notre{" "}
              <Link href="/confidentialite" className="text-accent/70 hover:text-accent transition-colors">
                Politique de confidentialité
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
