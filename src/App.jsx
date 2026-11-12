import { About } from './components/About.jsx'
import { Band } from './components/Band.jsx'
import { Contact } from './components/Contact.jsx'
import { Header } from './components/Header.jsx'
import { Hero } from './components/Hero.jsx'
import { MobileDock } from './components/MobileDock.jsx'
import { Screens } from './components/Screens.jsx'
import { Work } from './components/Work.jsx'
import { ScrollProgress } from './components/ui.jsx'

export default function App() {
  return (
    <>
      <a
        href="#work"
        className="sr-only z-[70] rounded-full bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to work
      </a>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Band />
        <Work />
        <Screens />
        <About />
      </main>
      <Contact />
      <MobileDock />
    </>
  )
}
