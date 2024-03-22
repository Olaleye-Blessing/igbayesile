"use client";

import { useState } from "react";
import Stepper from "./_components/stepper";
import HotelForm from "./_components/hotel-form";

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);
  const handleSetStep = (step: number) => setCurrentStep(step);

  return (
    <main className="layout pb-1">
      <header className="mt-5">
        <h1>Create New Hotel</h1>
        <Stepper current={currentStep} />
      </header>
      <section>
        {currentStep === 0 ? (
          <HotelForm handleSetStep={handleSetStep} />
        ) : (
          <form>Room Form</form>
        )}
      </section>
    </main>
  );
}
