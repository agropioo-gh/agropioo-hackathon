import { tool } from "@openai/agents";
import { z } from "zod";

export const handoffToAdvisor = (() => {
  const raw = tool({
    name: "handoff_to_advisor",
    description:
      "Transfer the farmer to the Agropioo Advisor for detailed crop advice, disease diagnosis, or agronomy questions. Use this when the farmer asks for expert farming advice that goes beyond app control.",
    parameters: z.object({}),
    async execute() {
      return JSON.stringify({
        type: "navigation_button",
        path: "/advisor",
        label: "Open Advisor Chat",
      });
    },
  });

  if (Array.isArray(raw.parameters.required) && raw.parameters.required.length === 0) {
    delete raw.parameters.required;
  }

  return raw;
})();
