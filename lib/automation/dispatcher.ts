import { consoleAutomationProvider } from "@/lib/automation/providers/console-provider";
import { AutomationProvider, ReservationAutomationEvent } from "@/lib/automation/types";

const providers: AutomationProvider[] = [consoleAutomationProvider];

export async function dispatchAutomationEvent(event: ReservationAutomationEvent) {
  await Promise.all(
    providers.map(async (provider) => {
      try {
        await provider.dispatch(event);
      } catch (error) {
        console.error(`[automation:${provider.id}] dispatch failed`, error);
      }
    }),
  );
}
