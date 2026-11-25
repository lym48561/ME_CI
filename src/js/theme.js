export function initTheme(refreshIcons) {
  const toggleButton = document.getElementById("theme-toggle");

  // Get saved theme or use system preference
  const savedTheme = localStorage.getItem("theme");

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialTheme = savedTheme || (systemDark ? "dark" : "light");

  // Apply theme
  function applyTheme(theme) {
    const isDark = theme === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    localStorage.setItem("theme", theme);

    // Update toggle icon
    if (toggleButton) {
      toggleButton.innerHTML = `
        <i
          data-lucide="${isDark ? "sun" : "moon"}"
          class="w-5 h-5"
        ></i>
      `;

      refreshIcons();
    }
  }

  // Set initial theme
  applyTheme(initialTheme);

  // Toggle between dark and light
  toggleButton?.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");

    applyTheme(isDark ? "light" : "dark");
  });
}
