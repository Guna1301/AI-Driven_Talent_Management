const roles = ["Intern", "FSD", "QA", "UI/UX", "DevOps"];

  const yearlyData = {
    2023: roles.map((role) => ({
      role,
      graph: Array.from({ length: 52 }, () => Math.floor(Math.random() * 100)),
    })),
    2024: roles.map((role) => ({
      role,
      graph: Array.from({ length: 52 }, () => Math.floor(Math.random() * 100)),
    })),
  };