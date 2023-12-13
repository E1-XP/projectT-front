export const config = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? `${window.location.origin}/api`
      : "https://project-t.gtxcodeworks.com.pl",
  API_URL_ORIGIN: "https://project-t.gtxcodeworks.com.pl",
};
