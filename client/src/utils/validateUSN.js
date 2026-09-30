const branchCodes = {
  AI: "Artificial Intelligence & Machine Learning",
  CV: "Civil Engineering",
  IC: "CSE (IoT & Cyber Security including Blockchain Tech)",
  CS: "Computer Science & Engineering",
  DS: "CSE (Data Science)",
  EE: "Electrical & Electronics Engineering",
  EC: "Electronics & Communication Engineering",
  ME: "Mechanical Engineering",
};

export const validateUSN = (usn, selectedBranch, admissionYear) => {
  const normalizedUSN = usn.trim().toUpperCase();

  // Exact basic structure:
  // 1CD + 2 digits + 2 letters + 3 digits
  const usnPattern = /^1CD(\d{2})([A-Z]{2})(\d{3})$/;

  const match = normalizedUSN.match(usnPattern);

  // Any structural problem
  if (!match) {
    return {
      valid: false,
      message: "Invalid USN",
    };
  }

  const [, usnYear, usnBranchCode] = match;

  // Check whether the branch code is one of our valid branch codes
  if (!branchCodes[usnBranchCode]) {
    return {
      valid: false,
      message: "Invalid USN",
    };
  }

  // Check admission year if one has been entered
  if (admissionYear) {
    const normalizedAdmissionYear = admissionYear.toString().trim();

    if (!/^\d{4}$/.test(normalizedAdmissionYear)) {
      return {
        valid: false,
        message: "Invalid USN",
      };
    }

    const expectedYearCode = normalizedAdmissionYear.slice(-2);

    if (usnYear !== expectedYearCode) {
      return {
        valid: false,
        message: "Invalid USN",
      };
    }
  }

  // Branch mismatch gets the specific message
  if (selectedBranch && usnBranchCode !== selectedBranch) {
    return {
      valid: false,
      message:
        "USN branch code doesn't match the selected branch. Please check your branch or USN.",
    };
  }

  return {
    valid: true,
    normalizedUSN,
    branchCode: usnBranchCode,
    admissionYearCode: usnYear,
    studentNumber: normalizedUSN.slice(-3),
  };
};