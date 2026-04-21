import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Politique de confidentialité — FocusFlow" }

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors mb-8 inline-block">
          ← Retour
        </Link>

        <h1 className="text-2xl font-semibold text-white mb-2">Politique de confidentialité</h1>
        <p className="text-xs text-neutral-600 mb-10">Dernière mise à jour : avril 2025</p>

        <div className="flex flex-col gap-8 text-sm text-neutral-400 leading-relaxed">
          <section>
            <h2 className="text-white text-sm font-medium mb-2">1. Données collectées</h2>
            <p className="mb-2">
              Lors de la connexion via GitHub OAuth, nous collectons et stockons les informations suivantes :
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-neutral-500">
              <li>Nom d'affichage GitHub</li>
              <li>Adresse email associée au compte GitHub</li>
              <li>Sessions de travail (date de début, date de fin)</li>
              <li>Tâches créées (titre, statut, tag, durée estimée)</li>
              <li>Pomodoros enregistrés (durée, date)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">2. Finalité du traitement</h2>
            <p>
              Ces données sont utilisées exclusivement pour faire fonctionner l'application FocusFlow :
              authentification, affichage de tes statistiques, historique de sessions.
              Aucune donnée n'est revendue, partagée avec des tiers ou utilisée à des fins publicitaires.
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">3. Base légale</h2>
            <p>
              Le traitement est basé sur l'exécution du service (Article 6.1.b du RGPD) :
              les données sont nécessaires pour te fournir l'application.
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">4. Durée de conservation</h2>
            <p>
              Tes données sont conservées tant que ton compte est actif.
              Les sessions d'authentification expirent après 72 heures d'inactivité.
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">5. Cookies</h2>
            <p>
              FocusFlow utilise un unique cookie de session (<span className="font-mono text-xs text-neutral-500">authjs.session-token</span>),
              strictement nécessaire au fonctionnement de l'authentification. Aucun cookie publicitaire ou de tracking n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">6. Tes droits</h2>
            <p className="mb-2">
              Conformément au RGPD, tu disposes des droits suivants :
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-neutral-500">
              <li>Droit d'accès à tes données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement (« droit à l'oubli »)</li>
              <li>Droit à la portabilité</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits ou supprimer ton compte, accède à{" "}
              <Link href="/compte" className="text-accent/70 hover:text-accent transition-colors">
                la page Mon compte
              </Link>{" "}
              ou contacte-nous à{" "}
              <span className="text-neutral-300">[khadidja.aitsiali@gmail.com]</span>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-sm font-medium mb-2">7. Contact</h2>
            <p>
              Pour toute question relative à tes données personnelles :<br />
              <span className="text-neutral-300">[khadidja.aitsiali@gmail.com]</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
