import { OnboardingAnswers, OnboardingStep } from "./onboardingTypes";

export const ONBOARDING_ANSWERS_VERSION = 1;

// Steps with dark background (room photo behind)
export const DARK_STEP_IDS = new Set([
  "hero",
  "feature-welcome",
  "reviews-loading",
  "congratulations",
]);

export const isDarkStep = (stepId: string) => DARK_STEP_IDS.has(stepId);

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "hero",
    kind: "hero",
    title: "Hostly",
    description: "Scan your property, get AI insights, and increase bookings.",
    cta: "Get started",
  },
  {
    id: "user-name",
    kind: "text",
    title: "What's your name?",
    description: "We will use this to personalize your experience",
    required: false,
    placeholder: "Enter your name",
  },
  {
    id: "feature-welcome",
    kind: "feature",
    title: "Welcome",
    description: "Turn your space into a high-performing listing",
  },
  {
    id: "user-description",
    kind: "multiChoice",
    title: "Which best describes you?",
    description: "This helps us tailor recommendations for you",
    required: false,
    options: [
      {
        id: "host",
        label: "I host on Airbnb / short-term rentals",
        value: "host",
      },
      {
        id: "preparing",
        label: "I'm preparing a new property",
        value: "preparing",
      },
      {
        id: "designing",
        label: "I'm designing a rental space",
        value: "designing",
      },
      {
        id: "exploring",
        label: "I'm just exploring ideas",
        value: "exploring",
      },
    ],
  },
  {
    id: "goal",
    kind: "multiChoice",
    title: "What's your main goal?",
    description: "We'll focus insights on what matters most to you",
    required: false,
    options: [
      {
        id: "more-bookings",
        label: "Get more bookings",
        value: "more_bookings",
      },
      {
        id: "improve-design",
        label: "Improve my space design",
        value: "improve_design",
      },
      {
        id: "prepare-property",
        label: "Prepare a new property",
        value: "prepare_property",
      },
      {
        id: "browsing",
        label: "Just browsing or looking for inspiration",
        value: "browsing",
      },
    ],
  },
  {
    id: "styles",
    kind: "multiChoiceChips",
    title: "Pick up to 5 styles",
    description: "This help us to show you inspiration and redesigns\nthat match your taste.",
    required: false,
    max: 4,
    options: [
      { id: "modern", label: "Modern", value: "modern" },
      { id: "minimal", label: "Minimal", value: "minimal" },
      { id: "scandinavian", label: "Scandinavian", value: "scandinavian" },
      { id: "coastal", label: "Coastal", value: "coastal" },
      { id: "boho", label: "Boho", value: "boho" },
      { id: "japandi", label: "Japandi", value: "japandi" },
      { id: "rustic", label: "Rustic", value: "rustic" },
      { id: "industrial", label: "Industrial", value: "industrial" },
      { id: "luxury", label: "Luxury", value: "luxury" },
      { id: "mediterranean", label: "Mediterranean", value: "mediterranean" },
      { id: "farmhouse", label: "Farmhouse", value: "farmhouse" },
      { id: "mid-century", label: "Mid-century", value: "mid_century" },
      { id: "tropical", label: "Tropical", value: "tropical" },
      { id: "mountain-cabin", label: "Mountain cabin", value: "mountain_cabin" },
      { id: "boutique-hotel", label: "Boutique hotel", value: "boutique_hotel" },
      { id: "parisian", label: "Parisian", value: "parisian" },
      { id: "desert", label: "Desert", value: "desert" },
      { id: "contemporary", label: "Contemporary", value: "contemporary" },
      { id: "urban-loft", label: "Urban loft", value: "urban_loft" },
      { id: "beach-house", label: "Beach house", value: "beach_house" },
      { id: "nordic-cabin", label: "Nordic cabin", value: "nordic_cabin" },
      { id: "warm-minimal", label: "Warm minimal", value: "warm_minimal" },
    ],
  },
  {
    id: "property-name",
    kind: "text",
    title: "Name your property",
    description: "This helps us organize your scans and insights.",
    required: false,
    placeholder: "e.g Beach House or Lake Cabin",
    cta: "Continue",
    cta2: "Skip for now",
  },
  {
    id: "reviews-loading",
    kind: "reviews",
    title: "Setting things up\nfor you...",
    description: undefined,
  },
  {
    id: "congratulations",
    kind: "congratulations",
    title: "You're all set!",
    description: "Turn your space into a high-performing listing.",
    cta: "Continue",
  },
];

export const STEP_INDEX_BY_ID = Object.fromEntries(
  ONBOARDING_STEPS.map((step, index) => [step.id, index])
);

export const getNextStepIndex = (
  step: OnboardingStep,
  currentIndex: number
) => {
  if (step.next) {
    const nextIndex = STEP_INDEX_BY_ID[step.next];
    if (typeof nextIndex === "number") {
      return nextIndex;
    }
  }
  return currentIndex + 1;
};

export const isStepComplete = (
  step: OnboardingStep,
  answers: OnboardingAnswers
) => {
  if (!step.required) {
    return true;
  }

  const answer = answers[step.id];

  if (step.kind === "singleChoice") {
    return typeof answer === "string" && answer.length > 0;
  }

  if (step.kind === "multiChoice" || step.kind === "multiChoiceChips") {
    return Array.isArray(answer) && answer.length > 0;
  }

  if (step.kind === "text") {
    return typeof answer === "string" && answer.trim().length > 0;
  }

  return true;
};
