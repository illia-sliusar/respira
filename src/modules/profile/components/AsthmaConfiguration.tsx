import {
  ASTHMA_TRIGGER_OPTIONS,
  type AsthmaTriggerType,
} from "../types";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

interface AsthmaTriggersProps {
  selectedTriggers: AsthmaTriggerType[];
  onToggle: (trigger: AsthmaTriggerType) => void;
}

export function AsthmaConfigurationComponent({ selectedTriggers, onToggle }: AsthmaTriggersProps) {
  return (
    <MultiSelectDropdown
      label="Asthma Triggers"
      subtitle="Select the factors that trigger your asthma"
      options={ASTHMA_TRIGGER_OPTIONS}
      selectedValues={selectedTriggers}
      onToggle={onToggle}
      placeholder="Select triggers"
    />
  );
}
