import { useState } from 'react';
import Hero from './components/Hero';
import Simulator from './components/Simulator';
import Summary from './components/Summary';
import Footer from './components/Footer';
import {
  actionItems,
  openSourceTools,
  resources,
  steps,
  summaryMetrics,
} from './data/steps';

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStart = () => {
    setCurrentStep(0);
    scrollToSection('simulator');
  };

  const handleViewSummary = () => {
    scrollToSection('summary');
  };

  const handleRunAgain = () => {
    setCurrentStep(0);
    scrollToSection('simulator');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-900 text-text-primary">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_32%),radial-gradient(circle_at_14%_24%,rgba(255,68,68,0.12),transparent_26%),radial-gradient(circle_at_84%_72%,rgba(0,255,136,0.1),transparent_26%)]" />
      <div className="pointer-events-none fixed inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />

      <main className="relative z-10">
        <Hero onStart={handleStart} />
        <Simulator
          currentStep={currentStep}
          onSelectStep={setCurrentStep}
          onStepChange={setCurrentStep}
          onViewSummary={handleViewSummary}
          steps={steps}
        />
        <Summary
          actionItems={actionItems}
          metrics={summaryMetrics}
          onRunAgain={handleRunAgain}
          openSourceTools={openSourceTools}
          resources={resources}
        />
        <Footer />
      </main>
    </div>
  );
}

