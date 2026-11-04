import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HeroSection } from './sections/HeroSection'
import { WorkSection } from './sections/WorkSection'
import { ApproachSection } from './sections/ApproachSection'
import { LabSection } from './sections/LabSection'
import { NotesSection } from './sections/NotesSection'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-atmosphere" aria-hidden="true" />
      <div className="site-grain" aria-hidden="true" />
      <Header />
      <main id="main">
        <HeroSection />
        <WorkSection />
        <ApproachSection />
        <LabSection />
        <NotesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}

export default App
