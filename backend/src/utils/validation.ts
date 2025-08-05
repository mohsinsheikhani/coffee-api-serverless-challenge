export const validateUpdateCoffeeRequest = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Checkng if at least one field is provided for update
  const hasValidFields = Object.keys(data).some(
    (key) =>
      ["name", "description", "price", "category", "available"].includes(key) &&
      data[key] !== undefined
  );

  if (!hasValidFields) {
    errors.push("At least one field must be provided for update");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
