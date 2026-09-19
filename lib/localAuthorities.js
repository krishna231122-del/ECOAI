export const getLocalAuthority = (country, region, city, issue) => {
  if (!country) return null;

  const normalizedCountry = country.toLowerCase().trim();
  const normalizedCity = city?.toLowerCase().trim();
  const issueKeywords = issue ? issue.toLowerCase() : "";

  // Helper to determine department based on issue keywords
  const getDepartment = (issueText) => {
    if (issueText.includes("waste") || issueText.includes("garbage") || issueText.includes("dump") || issueText.includes("plastic")) {
      return "Sanitation / Waste Management";
    }
    if (issueText.includes("water") || issueText.includes("sewage") || issueText.includes("river") || issueText.includes("ocean")) {
      return "Water / Environmental Authority";
    }
    if (issueText.includes("air") || issueText.includes("smog") || issueText.includes("pollution") || issueText.includes("smoke")) {
      return "Environmental Protection / Air Quality Authority";
    }
    if (issueText.includes("tree") || issueText.includes("forest") || issueText.includes("deforestation")) {
      return "Forestry / Parks Department";
    }
    if (issueText.includes("animal") || issueText.includes("wildlife")) {
      return "Wildlife / Animal Control";
    }
    return "Relevant Local Environmental Authority";
  };

  const department = getDepartment(issueKeywords);

  // Hardcoded MVP examples
  if (normalizedCountry === "india" && normalizedCity === "dehradun") {
    return {
      authority: "Nagar Nigam Dehradun",
      department: department
    };
  }

  // Generic fallbacks based on country conventions
  if (normalizedCountry === "india") {
    return {
      authority: "Municipal Corporation / Nagar Nigam",
      department: department
    };
  }

  if (normalizedCountry === "usa" || normalizedCountry === "united states") {
    return {
      authority: "City / County Authority",
      department: department
    };
  }

  if (normalizedCountry === "uk" || normalizedCountry === "united kingdom") {
    return {
      authority: "Local Council",
      department: department
    };
  }

  if (normalizedCountry === "canada") {
    return {
      authority: "Municipal Authority",
      department: department
    };
  }

  if (normalizedCountry === "australia") {
    return {
      authority: "Local Council",
      department: department
    };
  }

  // Global fallback
  return {
    authority: "Appropriate Local Civic / Environmental Authority",
    department: department
  };
};
