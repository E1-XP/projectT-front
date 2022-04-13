export const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? `${window.location.origin}/api`
      : "https://project-t.gtxcodeworks.site",
};
