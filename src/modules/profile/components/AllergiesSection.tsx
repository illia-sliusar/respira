import {
  POLLEN_ALLERGY_OPTIONS,
  type PollenAllergyType,
} from "../types";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

interface AllergiesSectionProps {
  selectedAllergies: PollenAllergyType[];
  onToggle: (allergy: PollenAllergyType) => void;
}

export function AllergiesSection({ selectedAllergies, onToggle }: AllergiesSectionProps) {
  return (
    <MultiSelectDropdown
      label="Pollen Allergies"
      subtitle="Select the pollen types you are allergic to"
      options={POLLEN_ALLERGY_OPTIONS}
      selectedValues={selectedAllergies}
      onToggle={onToggle}
      placeholder="Select allergies"
    />
  );
}
