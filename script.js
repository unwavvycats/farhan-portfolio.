console.log("Script loaded correctly.");

const statusEl = document.getElementById("status");
if (statusEl) {
  const now = new Date().toISOString().slice(0, 10);
  statusEl.textContent = "Skeleton deployed on " + now + ". Full build coming next.";
}
