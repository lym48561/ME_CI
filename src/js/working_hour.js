// ==========================================
// 1. WORKING HOUR DATE CALCULATOR
// ==========================================

const workingDate = document.getElementById("workingDate");

const currentMonthDisplay = document.getElementById("currentMonth");
const zeroPeriodDisplay = document.getElementById("zeroPeriod");

// Format date as DD/MM/YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Calculate Working Hour periods
function calculateWorkingHour() {
  const parts = workingDate.value.trim().split("/");

  if (parts.length !== 3) {
    currentMonthDisplay.textContent = "-";
    zeroPeriodDisplay.textContent = "Invalid date";
    return;
  }

  const [day, month, year] = parts.map(Number);

  const working = new Date(year, month - 1, day);

  // Validate date
  if (
    !day ||
    !month ||
    !year ||
    working.getFullYear() !== year ||
    working.getMonth() !== month - 1 ||
    working.getDate() !== day
  ) {
    currentMonthDisplay.textContent = "-";
    zeroPeriodDisplay.textContent = "Invalid date";
    return;
  }

  // Current month
  const currentStart = new Date(year, month - 1, 1);
  const currentEnd = new Date(year, month, 0);

  // Previous month: working day + 1
  const previousStart = new Date(year, month - 2, day + 1);
  const previousEnd = new Date(year, month - 1, 0);

  currentMonthDisplay.textContent = `${formatDate(currentStart)} - ${formatDate(currentEnd)}`;

  zeroPeriodDisplay.textContent = `${formatDate(previousStart)} - ${formatDate(previousEnd)}`;
}

// Default date
const today = new Date();

workingDate.value = [
  String(today.getDate()).padStart(2, "0"),
  String(today.getMonth() + 1).padStart(2, "0"),
  today.getFullYear(),
].join("/");

// Update date calculation
workingDate.addEventListener("input", calculateWorkingHour);
workingDate.addEventListener("change", calculateWorkingHour);

calculateWorkingHour();

// ==========================================
// 2. LINE CHECKER ELEMENTS
// ==========================================

const assemblyList = document.getElementById("assemblyList");
const stitchingList = document.getElementById("stitchingList");

const checkAssembly = document.getElementById("checkAssembly");

const assemblyResults = document.getElementById("assemblyResults");
const stitchingResults = document.getElementById("stitchingResults");

const assemblyError = document.getElementById("assemblyError");

// Floors
const floors = ["B3", "B4", "A4"];

// Total expected lines
const totalLinesPerFloor = 7;

// Normalize names for comparison
function normalizeLine(name) {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

// Convert pasted Excel data into a Set
function getLineSet(input) {
  return new Set(
    input
      .split(/[\r\n\t]+/)
      .map((line) => normalizeLine(line))
      .filter(Boolean),
  );
}

// ==========================================
// 3. CHECK ASSEMBLY LINES
// ==========================================

function checkAssemblyLines(existingLines) {
  assemblyResults.classList.remove("hidden");

  floors.forEach((floor) => {
    const missingLines = [];

    // Check all 7 expected Assembly lines
    for (let i = 1; i <= totalLinesPerFloor; i++) {
      const lineNumber = String(i).padStart(2, "0");

      const expectedLine = `S02-${floor}-Assembly-${lineNumber}`;

      if (!existingLines.has(normalizeLine(expectedLine))) {
        missingLines.push({
          name: expectedLine,
          number: lineNumber,
        });
      }
    }

    // Get result elements
    const floorPrefix = floor.toLowerCase();

    const statusDisplay = document.getElementById(`${floorPrefix}Status`);

    const missingDisplay = document.getElementById(`${floorPrefix}Missing`);

    const whDisplay = document.getElementById(`${floorPrefix}WH`);

    const whList = document.getElementById(`${floorPrefix}WHList`);

    // Display Assembly results
    if (missingLines.length > 0) {
      statusDisplay.textContent = `${totalLinesPerFloor - missingLines.length}/7 Found | ${missingLines.length} Missing`;

      statusDisplay.className = "text-sm font-semibold mb-3 text-red-500";

      missingDisplay.replaceChildren();

      missingLines.forEach((line) => {
        const item = document.createElement("p");
        item.textContent = line.name;

        missingDisplay.appendChild(item);
      });

      // Show W.H. details
      whDisplay.classList.remove("hidden");

      whList.replaceChildren();

      // Generate department W.H.
      missingLines.forEach((line) => {
        const departments = ["Cutting", "Stitching", "Assembly"];

        departments.forEach((department) => {
          const entry = document.createElement("div");

          entry.className =
            "flex justify-between items-center gap-3 border-b border-slate-200 pb-2";

          const lineName = document.createElement("span");

          lineName.className = "font-medium break-all";

          lineName.textContent = `S02-${floor}-${department}-${line.number}`;

          const whValue = document.createElement("span");

          whValue.className = "font-bold text-red-600 shrink-0";

          whValue.textContent = "0.1";

          entry.appendChild(lineName);
          entry.appendChild(whValue);

          whList.appendChild(entry);
        });
      });
    } else {
      statusDisplay.textContent = "7/7 Found | Complete";

      statusDisplay.className = "text-sm font-semibold mb-3 text-green-600";

      missingDisplay.textContent = "None";

      whDisplay.classList.add("hidden");

      whList.replaceChildren();
    }
  });
}

// ==========================================
// 4. CHECK STITCHING LINES
// ==========================================

function checkStitchingLines(assemblyLines, stitchingLines) {
  stitchingResults.classList.remove("hidden");

  floors.forEach((floor) => {
    const assemblyOutputLines = [];
    const missingStitchingLines = [];

    // --------------------------------------
    // STEP 1: Find Assembly lines with output
    // --------------------------------------

    for (let i = 1; i <= totalLinesPerFloor; i++) {
      const lineNumber = String(i).padStart(2, "0");

      const assemblyLine = `S02-${floor}-Assembly-${lineNumber}`;

      if (assemblyLines.has(normalizeLine(assemblyLine))) {
        assemblyOutputLines.push(lineNumber);
      }
    }

    // --------------------------------------
    // STEP 2: Check corresponding Stitching
    // --------------------------------------

    assemblyOutputLines.forEach((lineNumber) => {
      const stitchingLine = `S02-${floor}-Stitching-${lineNumber}`;

      if (!stitchingLines.has(normalizeLine(stitchingLine))) {
        missingStitchingLines.push(lineNumber);
      }
    });

    // --------------------------------------
    // STEP 3: Get result elements
    // --------------------------------------

    const floorPrefix = floor.toLowerCase();

    const statusDisplay = document.getElementById(
      `st${floorPrefix.toUpperCase()}Status`,
    );

    const missingDisplay = document.getElementById(
      `st${floorPrefix.toUpperCase()}Missing`,
    );

    // --------------------------------------
    // STEP 4: Display results
    // --------------------------------------

    missingDisplay.replaceChildren();

    if (missingStitchingLines.length > 0) {
      statusDisplay.textContent = `${assemblyOutputLines.length - missingStitchingLines.length}/${assemblyOutputLines.length} Found | ${missingStitchingLines.length} Missing`;

      statusDisplay.className = "text-sm font-semibold mb-3 text-red-500";

      // Required W.H. heading
      const heading = document.createElement("p");

      heading.className = "font-bold text-red-600 mb-3";

      heading.textContent = "Required W.H. = 0.1";

      missingDisplay.appendChild(heading);

      // Display Cutting + Stitching only
      missingStitchingLines.forEach((lineNumber) => {
        const departments = ["Cutting", "Stitching"];

        departments.forEach((department) => {
          const entry = document.createElement("div");

          entry.className =
            "flex justify-between items-center gap-3 border-b border-slate-200 py-2";

          const lineName = document.createElement("span");

          lineName.className = "font-medium text-slate-700 break-all";

          lineName.textContent = `S02-${floor}-${department}-${lineNumber}`;

          const whValue = document.createElement("span");

          whValue.className = "font-bold text-red-600 shrink-0";

          whValue.textContent = "0.1";

          entry.appendChild(lineName);
          entry.appendChild(whValue);

          missingDisplay.appendChild(entry);
        });
      });
    } else {
      statusDisplay.textContent =
        assemblyOutputLines.length > 0
          ? `${assemblyOutputLines.length}/${assemblyOutputLines.length} Found | Complete`
          : "No Assembly output lines";

      statusDisplay.className = "text-sm font-semibold mb-3 text-green-600";

      const message = document.createElement("p");

      message.className = "text-sm text-slate-500";

      message.textContent =
        assemblyOutputLines.length > 0
          ? "No missing Stitching lines."
          : "No Assembly output to check.";

      missingDisplay.appendChild(message);
    }
  });
}

// ==========================================
// 5. CHECK ALL LINES BUTTON
// ==========================================

function checkAllLines() {
  const assemblyInput = assemblyList.value.trim();
  const stitchingInput = stitchingList.value.trim();

  // Assembly input is required because Stitching
  // requirements depend on Assembly output.
  if (!assemblyInput) {
    assemblyError.textContent = "Please paste the Assembly line list first.";

    assemblyError.classList.remove("hidden");

    assemblyResults.classList.add("hidden");
    stitchingResults.classList.add("hidden");

    return;
  }

  assemblyError.classList.add("hidden");

  // Convert both lists into lookup sets
  const existingAssemblyLines = getLineSet(assemblyInput);
  const existingStitchingLines = getLineSet(stitchingInput);

  // Check Assembly
  checkAssemblyLines(existingAssemblyLines);

  // Check Stitching based on Assembly output
  checkStitchingLines(existingAssemblyLines, existingStitchingLines);
}

// ==========================================
// 6. BUTTON EVENT
// ==========================================

checkAssembly.addEventListener("click", checkAllLines);
