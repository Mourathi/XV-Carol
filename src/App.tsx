import { Hero } from './components/Hero'
import { EventDetails } from './components/EventDetails'
import { GiftList } from './components/GiftList'
import { Footer } from './components/Footer'
import { SectionDivider } from './components/SectionDivider'
import { RSVPForm } from './components/RSVPForm'

function App() {
  return (
    <main>
      <Hero />
      <SectionDivider variant="wave" />
      <EventDetails />
      <SectionDivider variant="wave" flip />
      <GiftList />
      <SectionDivider variant="wave" />
      <RSVPForm />
      <Footer />
    </main>
  )
}

export default App
