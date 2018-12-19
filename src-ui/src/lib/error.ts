export const getErrorMessage = (e: any): string => {
  return e && e.response && e.response.data && e.response.data.message || "Error loading projects";
};
