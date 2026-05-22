import { AutomationProvider } from "@/lib/automation/types";

export const consoleAutomationProvider: AutomationProvider = {
  id: "console",
  async dispatch(event) {
    console.info(
      `[automation:${event.name}] reservation=${event.reservation.id} status=${event.reservation.status}`,
    );
  },
};
