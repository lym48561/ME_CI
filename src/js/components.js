import headerHTML from "../components/header.html?raw";

export function renderHeader() {
  const headerContainer = document.getElementById("site-header");

  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
  }
}
