import "./style.css";

import { renderHeader } from "./js/components.js";
import { initTheme } from "./js/theme.js";

import {
  createIcons,
  Clock,
  ArrowRight,
  Calculator,
  FileSpreadsheet,
  Moon,
  Sun,
} from "lucide";

// Make Lucide icons available
const icons = {
  Clock,
  ArrowRight,
  Calculator,
  FileSpreadsheet,
  Moon,
  Sun,
};

// Refresh icons whenever needed
export function refreshIcons() {
  createIcons({ icons });
}

// Load shared header
renderHeader();

// Initialize icons and theme
refreshIcons();
initTheme(refreshIcons);
