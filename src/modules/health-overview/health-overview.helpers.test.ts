/**
 * Score Helper Functions Unit Tests
 *
 * Tests utility functions for health score interpretation and display.
 * Functions are now in @/src/modules/score/score.utils.ts
 */

import { describe, it, expect } from "vitest";
import {
  getScoreRiskLevel as getRiskLevelFromScore,
  getScoreCondition as getConditionFromScore,
  getScoreDescription as getDescriptionFromScore,
  getScoreColors as getScoreColor,
  getScoreIcon as getIconName,
} from "../score/score.utils";

// ============================================================================
// getRiskLevelFromScore Tests
// ============================================================================

describe("getRiskLevelFromScore", () => {
  it("should return 'Low Risk' for scores 8-10", () => {
    expect(getRiskLevelFromScore(8)).toBe("Low Risk");
    expect(getRiskLevelFromScore(9)).toBe("Low Risk");
    expect(getRiskLevelFromScore(10)).toBe("Low Risk");
  });

  it("should return 'Moderate Risk' for scores 5-7", () => {
    expect(getRiskLevelFromScore(5)).toBe("Moderate Risk");
    expect(getRiskLevelFromScore(6)).toBe("Moderate Risk");
    expect(getRiskLevelFromScore(7)).toBe("Moderate Risk");
  });

  it("should return 'High Risk' for scores 3-4", () => {
    expect(getRiskLevelFromScore(3)).toBe("High Risk");
    expect(getRiskLevelFromScore(4)).toBe("High Risk");
  });

  it("should return 'Very High Risk' for scores 1-2", () => {
    expect(getRiskLevelFromScore(1)).toBe("Very High Risk");
    expect(getRiskLevelFromScore(2)).toBe("Very High Risk");
  });

  it("should handle edge cases", () => {
    expect(getRiskLevelFromScore(0)).toBe("Very High Risk");
    expect(getRiskLevelFromScore(7.9)).toBe("Moderate Risk");
  });
});

// ============================================================================
// getConditionFromScore Tests
// ============================================================================

describe("getConditionFromScore", () => {
  it("should return 'Excellent' for scores >= 8", () => {
    expect(getConditionFromScore(8)).toBe("Excellent");
    expect(getConditionFromScore(9)).toBe("Excellent");
    expect(getConditionFromScore(10)).toBe("Excellent");
  });

  it("should return 'Good Conditions' for scores 6-7", () => {
    expect(getConditionFromScore(6)).toBe("Good Conditions");
    expect(getConditionFromScore(7)).toBe("Good Conditions");
  });

  it("should return 'Fair' for scores 4-5", () => {
    expect(getConditionFromScore(4)).toBe("Fair");
    expect(getConditionFromScore(5)).toBe("Fair");
  });

  it("should return 'Poor' for scores 2-3", () => {
    expect(getConditionFromScore(2)).toBe("Poor");
    expect(getConditionFromScore(3)).toBe("Poor");
  });

  it("should return 'Hazardous' for score 1", () => {
    expect(getConditionFromScore(1)).toBe("Hazardous");
  });

  it("should handle edge cases", () => {
    expect(getConditionFromScore(0)).toBe("Hazardous");
    expect(getConditionFromScore(7.9)).toBe("Good Conditions");
  });
});

// ============================================================================
// getDescriptionFromScore Tests
// ============================================================================

describe("getDescriptionFromScore", () => {
  it("should return excellent message for scores >= 8", () => {
    const description = getDescriptionFromScore(8);
    expect(description).toContain("excellent");
    expect(description).toContain("Enjoy");
  });

  it("should return good message for scores 6-7", () => {
    const description = getDescriptionFromScore(6);
    expect(description).toContain("good");
    expect(description).toContain("outdoor activities");
  });

  it("should return moderate message for scores 4-5", () => {
    const description = getDescriptionFromScore(4);
    expect(description).toContain("moderate");
    expect(description).toContain("Sensitive individuals");
  });

  it("should return poor message for scores 2-3", () => {
    const description = getDescriptionFromScore(2);
    expect(description).toContain("poor");
    expect(description).toContain("staying indoors");
  });

  it("should return hazardous message for scores <= 1", () => {
    const description = getDescriptionFromScore(1);
    expect(description).toContain("hazardous");
    expect(description).toContain("Avoid");
  });
});

// ============================================================================
// getScoreColor Tests
// ============================================================================

describe("getScoreColor", () => {
  describe("excellent conditions (score >= 8)", () => {
    it("should return emerald/green colors", () => {
      const colors = getScoreColor(8);

      expect(colors.primary).toContain("52, 211, 153"); // emerald-400
      expect(colors.glow).toBe("#10b981"); // emerald-500
    });

    it("should have consistent color scheme for score 8-10", () => {
      const colors8 = getScoreColor(8);
      const colors9 = getScoreColor(9);
      const colors10 = getScoreColor(10);

      expect(colors8.glow).toBe(colors9.glow);
      expect(colors9.glow).toBe(colors10.glow);
    });
  });

  describe("moderate conditions (score 5-7)", () => {
    it("should return yellow colors", () => {
      const colors = getScoreColor(5);

      expect(colors.primary).toContain("251, 191, 36"); // yellow-400
      expect(colors.glow).toBe("#F59E0B"); // yellow-500
    });

    it("should have consistent color scheme for score 5-7", () => {
      const colors5 = getScoreColor(5);
      const colors6 = getScoreColor(6);
      const colors7 = getScoreColor(7);

      expect(colors5.glow).toBe(colors6.glow);
      expect(colors6.glow).toBe(colors7.glow);
    });
  });

  describe("high risk conditions (score 3-4)", () => {
    it("should return orange colors", () => {
      const colors = getScoreColor(3);

      expect(colors.primary).toContain("234, 88, 12"); // orange-600
      expect(colors.glow).toBe("#ea580c");
    });

    it("should have consistent color scheme for score 3-4", () => {
      const colors3 = getScoreColor(3);
      const colors4 = getScoreColor(4);

      expect(colors3.glow).toBe(colors4.glow);
    });
  });

  describe("very high risk conditions (score < 3)", () => {
    it("should return red colors for score 2", () => {
      const colors = getScoreColor(2);

      expect(colors.primary).toContain("239, 68, 68"); // red-500
      expect(colors.glow).toBe("#7f1d1d"); // dark red-900
    });

    it("should return red colors for score 1", () => {
      const colors = getScoreColor(1);

      expect(colors.glow).toBe("#7f1d1d");
    });
  });

  describe("color object structure", () => {
    it("should return all expected color properties", () => {
      const colors = getScoreColor(5);

      expect(colors).toHaveProperty("primary");
      expect(colors).toHaveProperty("secondary");
      expect(colors).toHaveProperty("border");
      expect(colors).toHaveProperty("glow");
      expect(colors).toHaveProperty("text");
      expect(colors).toHaveProperty("badgeText");
      expect(colors).toHaveProperty("scoreText");
    });

    it("should return rgba format for most colors", () => {
      const colors = getScoreColor(5);

      expect(colors.primary).toMatch(/^rgba\(/);
      expect(colors.secondary).toMatch(/^rgba\(/);
      expect(colors.border).toMatch(/^rgba\(/);
    });

    it("should return hex format for glow", () => {
      const colors = getScoreColor(5);

      expect(colors.glow).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

// ============================================================================
// getIconName Tests
// ============================================================================

describe("getIconName", () => {
  it("should return 'eco' for excellent conditions (score >= 8)", () => {
    expect(getIconName(8)).toBe("eco");
    expect(getIconName(9)).toBe("eco");
    expect(getIconName(10)).toBe("eco");
  });

  it("should return 'directions_walk' for moderate conditions (score 5-7)", () => {
    expect(getIconName(5)).toBe("directions_walk");
    expect(getIconName(6)).toBe("directions_walk");
    expect(getIconName(7)).toBe("directions_walk");
  });

  it("should return 'warning' for high risk (score 3-4)", () => {
    expect(getIconName(3)).toBe("warning");
    expect(getIconName(4)).toBe("warning");
  });

  it("should return 'dangerous' for very high risk (score 1-2)", () => {
    expect(getIconName(1)).toBe("dangerous");
    expect(getIconName(2)).toBe("dangerous");
  });

  it("should return 'dangerous' for score 0", () => {
    expect(getIconName(0)).toBe("dangerous");
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("helper function integration", () => {
  it("should provide consistent messaging for excellent conditions", () => {
    const score = 9;
    const riskLevel = getRiskLevelFromScore(score);
    const condition = getConditionFromScore(score);
    const description = getDescriptionFromScore(score);
    const colors = getScoreColor(score);
    const icon = getIconName(score);

    expect(riskLevel).toBe("Low Risk");
    expect(condition).toBe("Excellent");
    expect(description).toContain("excellent");
    expect(colors.glow).toBe("#10b981"); // Green
    expect(icon).toBe("eco");
  });

  it("should provide consistent messaging for hazardous conditions", () => {
    const score = 1;
    const riskLevel = getRiskLevelFromScore(score);
    const condition = getConditionFromScore(score);
    const description = getDescriptionFromScore(score);
    const colors = getScoreColor(score);
    const icon = getIconName(score);

    expect(riskLevel).toBe("Very High Risk");
    expect(condition).toBe("Hazardous");
    expect(description).toContain("hazardous");
    expect(colors.glow).toBe("#7f1d1d"); // Dark red
    expect(icon).toBe("dangerous");
  });

  it("should handle all score values 1-10", () => {
    for (let score = 1; score <= 10; score++) {
      expect(() => getRiskLevelFromScore(score)).not.toThrow();
      expect(() => getConditionFromScore(score)).not.toThrow();
      expect(() => getDescriptionFromScore(score)).not.toThrow();
      expect(() => getScoreColor(score)).not.toThrow();
      expect(() => getIconName(score)).not.toThrow();

      // Verify return types
      expect(typeof getRiskLevelFromScore(score)).toBe("string");
      expect(typeof getConditionFromScore(score)).toBe("string");
      expect(typeof getDescriptionFromScore(score)).toBe("string");
      expect(typeof getScoreColor(score)).toBe("object");
      expect(typeof getIconName(score)).toBe("string");
    }
  });

  it("should have progressively worse conditions as score decreases", () => {
    const scores = [10, 7, 5, 3, 1];
    const conditions = scores.map(getConditionFromScore);

    // Conditions should get progressively worse
    expect(conditions[0]).toBe("Excellent");
    expect(conditions[1]).toBe("Good Conditions");
    expect(conditions[2]).toBe("Fair");
    expect(conditions[3]).toBe("Poor");
    expect(conditions[4]).toBe("Hazardous");
  });
});
