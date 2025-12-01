// Global variable to keep track of the section count
let sectionCount = 0;
// Reference to the main area
const sectionsArea = document.getElementById('sectionsArea');
// Reference to the button to add a section
const addSectionButton = document.getElementById('addSectionButton');

// --- Core Functions ---

/**
 * Recalculates the sum of all number inputs within a given section.
 * @param {HTMLElement} sectionElement The container of the section.
 */
function calculateSectionResult(sectionElement) {
  let total = 0;
  // Get all number inputs within this specific section
  const inputs = sectionElement.querySelectorAll('.input-field');

  inputs.forEach((input) => {
    // Get the value and convert it to a number. Use 0 if it's empty/invalid.
    const value = parseFloat(input.value) || 0;
    total += value;
  });

  // Find the result display element and update its content
  const resultElement = sectionElement.querySelector('.result-value');
  if (resultElement) {
    resultElement.textContent = total;
  }
}

/**
 * Updates the "Number X ::" labels sequentially within a given section.
 * @param {HTMLElement} sectionElement The container of the section.
 */
function updateInputLabels(sectionElement) {
  const labels = sectionElement.querySelectorAll('.input-row label');
  labels.forEach((label, index) => {
    label.textContent = `Number ${index + 1} ::`;
  });
}

/**
 * Checks the total number of sections and disables the remove button
 * of all sections if only one remains.
 */
function updateSectionRemovalButtons() {
  const allSections = sectionsArea.querySelectorAll('.section-container');
  const isSingleSection = allSections.length <= 1;

  allSections.forEach((section) => {
    const removeButton = section.querySelector('.btn-remove');
    if (removeButton) {
      // Disable the remove button if it's the only section
      removeButton.disabled = isSingleSection;
      // Change the visual X to a blocked symbol if disabled
      removeButton.innerHTML = isSingleSection ? '🚫' : '❌';
    }
  });
}

// --- Element Creation Functions ---

/**
 * Creates a new input row (Number X :: [input] [remove button]).
 * @param {number} inputIndex The index for the label (e.g., 1 for "Number 1").
 * @param {HTMLElement} sectionElement The parent section to attach the listeners to.
 * @returns {HTMLElement} The created input row element.
 */
function createInputRow(inputIndex, sectionElement) {
  const inputRow = document.createElement('div');
  inputRow.className = 'input-row';

  // 1. Label (Number X ::)
  const label = document.createElement('label');
  label.textContent = `Number ${inputIndex} ::`;

  // 2. Input Field
  const inputField = document.createElement('input');
  inputField.type = 'number';
  inputField.value = 0; // Initial value 0
  inputField.className = 'input-field';

  // Add event listener for real-time calculation
  inputField.addEventListener('input', () => {
    calculateSectionResult(sectionElement);
  });

  // 3. Remove Button
  const removeButton = document.createElement('button');
  removeButton.className = 'btn-remove';
  removeButton.textContent = '❌';

  // Add event listener to remove the input row
  removeButton.addEventListener('click', () => {
    inputRow.remove();
    // Recalculate and update labels after removal
    calculateSectionResult(sectionElement);
    updateInputLabels(sectionElement);
  });

  inputRow.append(label, inputField, removeButton);
  return inputRow;
}

/**
 * Creates a complete new section container.
 * @returns {HTMLElement} The created section element.
 */
function createSection() {
  // Increment the global section counter
  sectionCount++;
  const currentSectionIndex = sectionCount;

  // --- Main Section Container ---
  const section = document.createElement('div');
  section.className = 'section-container';

  // --- Section Header (Add Input, Section Title, Remove Section) ---
  const header = document.createElement('div');
  header.className = 'section-header';

  // Button to add an input
  const addInputButton = document.createElement('button');
  addInputButton.className = 'btn-input';
  addInputButton.innerHTML = '<span style="font-size: 1.2em;">➕</span> Input';

  // Section Title
  const title = document.createElement('h2');
  title.textContent = `Section ${currentSectionIndex}`;

  // Button to remove the section
  const removeSectionButton = document.createElement('button');
  removeSectionButton.className = 'btn-remove';
  removeSectionButton.textContent = '❌';

  header.append(addInputButton, title, removeSectionButton);

  // --- Input Area and Result Area ---
  const inputsArea = document.createElement('div');
  inputsArea.className = 'inputs-area';

  const resultRow = document.createElement('div');
  resultRow.className = 'result-row';
  resultRow.innerHTML = `
        <label>Result ::</label>
        <div class="result-value">0</div>
    `;

  // Append everything to the main section container
  section.append(header, inputsArea, resultRow);

  // --- Event Listeners for the new Section ---

  // 1. Add Input Button Listener
  addInputButton.addEventListener('click', () => {
    // Determine the new input's index
    const currentInputs = inputsArea.querySelectorAll('.input-row').length;
    const newInputRow = createInputRow(currentInputs + 1, section);
    inputsArea.appendChild(newInputRow);
    // Ensure labels are correct if inputs were removed previously
    updateInputLabels(section);
    // Set focus to the new input field
    newInputRow.querySelector('input').focus();
  });

  // 2. Remove Section Button Listener
  removeSectionButton.addEventListener('click', () => {
    // Only remove if there is more than one section
    if (sectionsArea.querySelectorAll('.section-container').length > 1) {
      section.remove();
      updateSectionRemovalButtons(); // Check if only one remains after removal
    }
  });

  // --- Initial Setup ---

  // Add the first input row as required
  inputsArea.appendChild(createInputRow(1, section));
  // Check removal buttons immediately (will disable the first section's button)
  setTimeout(updateSectionRemovalButtons, 0); // Use timeout to ensure DOM is ready

  return section;
}

// --- Main Execution ---

// Event listener for the main "Add Section" button
addSectionButton.addEventListener('click', () => {
  sectionsArea.appendChild(createSection());
  updateSectionRemovalButtons(); // Enable removal buttons when a second section is added
});

// Initialize the view by creating the first section when the page loads
document.addEventListener('DOMContentLoaded', () => {
  sectionsArea.appendChild(createSection());
});
