import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bot from './components/Bot';
import AboutUs from './components/AboutUs';
import Stacks from './components/stacks';
import Team from './components/team';

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Bot />
      <AboutUs />
      <Stacks />
      <Team />
    </main>
  )
}

export default App
