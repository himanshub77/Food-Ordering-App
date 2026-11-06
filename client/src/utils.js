export const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
