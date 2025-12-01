/**
 * ส่วนที่ 1: Logic เดิมของคุณ (จัดการ Input ภายใน)
 */
function createComponent(componentElem) {
  const templateElem = componentElem.querySelector('.app-tmp-number-component');

  if (templateElem === null) {
    throw new Error('Template .app-tmp-number-component is not found');
  }

  const inputListContainer = templateElem.parentElement;

  if (inputListContainer === null) {
    throw new Error('Template .app-tmp-number-component does not have parent');
  }

  const regenerateTitleNumbersAndStatus = () => {
    [...inputListContainer.querySelectorAll('.app-cmp-number')].forEach(
      (inputContainer, index, items) => {
        [...inputContainer.querySelectorAll('.app-title-number')].forEach(
          (elem) => (elem.textContent = `${index + 1}`),
        );

        [
          ...inputContainer.querySelectorAll('.app-cmd-remove-number-input'),
        ].forEach((elem) => (elem.disabled = items.length === 1));
      },
    );
  };

  const recalculateResult = () => {
    const result = [
      ...inputListContainer.querySelectorAll('.app-inp-number'),
    ].reduce(
      (result, elem) =>
        result + (Number.isNaN(elem.valueAsNumber) ? 0 : elem.valueAsNumber),
      0,
    );

    [...componentElem.querySelectorAll('.app-out-number')].forEach(
      (elem) => (elem.textContent = result.toLocaleString()),
    );
  };

  const createInputComponent = () => {
    const inputContainer =
      templateElem.content.cloneNode(true).firstElementChild;

    inputContainer.addEventListener('click', (ev) => {
      // ใช้ .closest เพื่อให้แน่ใจว่าเจอปุ่ม แม้จะกดโดน icon ข้างใน
      if (ev.target.closest('.app-cmd-remove-number-input')) {
        inputContainer.remove();
        regenerateTitleNumbersAndStatus();
        recalculateResult();
      }
    });

    // เพิ่ม Event Listener สำหรับการพิมพ์ตัวเลข (input)
    inputContainer.addEventListener('input', () => {
      recalculateResult();
    });

    inputListContainer.append(inputContainer);

    regenerateTitleNumbersAndStatus();
    recalculateResult();
  };

  // Event Listener สำหรับ container หลัก (เผื่อกรณี change อื่นๆ)
  inputListContainer.addEventListener('change', (ev) => {
    if (ev.target?.matches('.app-inp-number')) {
      recalculateResult();
    }
  });

  componentElem.addEventListener('click', (ev) => {
    // ใช้ .closest เพื่อรองรับการกดโดน icon ภายในปุ่ม
    if (ev.target.closest('.app-cmd-add-number-input')) {
      createInputComponent();
    }
  });

  // สร้าง Input แรกเสมอ
  createInputComponent();

  return componentElem;
}

/**
 * ส่วนที่ 2: Logic ใหม่ (จัดการ Section)
 */
function initApp() {
  const sectionsContainer = document.getElementById('app-sections-container');
  const sectionTemplate = document.getElementById('tmp-section');
  const addSectionBtn = document.querySelector('.app-cmd-add-section');

  // ฟังก์ชันอัปเดตเลข Section และสถานะปุ่มลบ
  const updateSectionInfo = () => {
    const sections = [
      ...sectionsContainer.querySelectorAll('.section-container'),
    ];

    sections.forEach((section, index) => {
      // อัปเดตเลข Section 1, 2, 3...
      const titleElem = section.querySelector('.app-title-section-number');
      if (titleElem) titleElem.textContent = index + 1;

      // จัดการปุ่มลบ (ห้ามลบถ้าเหลือแค่ 1)
      const removeBtn = section.querySelector('.app-cmd-remove-section');
      if (removeBtn) removeBtn.disabled = sections.length === 1;
    });
  };

  // ฟังก์ชันสร้าง Section ใหม่
  const createSection = () => {
    // 1. Clone Template ของ Section ออกมา
    const newSection =
      sectionTemplate.content.cloneNode(true).firstElementChild;

    // 2. เรียกใช้ Logic เดิมของคุณ (createComponent) กับ Section นี้
    createComponent(newSection);

    // 3. เพิ่ม Event ลบ Section
    const removeBtn = newSection.querySelector('.app-cmd-remove-section');
    removeBtn.addEventListener('click', () => {
      newSection.remove();
      updateSectionInfo(); // เรียงเลขใหม่หลังลบ
    });

    // 4. เอาไปแปะในหน้าเว็บ
    sectionsContainer.append(newSection);

    // 5. อัปเดตเลข
    updateSectionInfo();
  };

  // ผูกปุ่มกด Add Section
  if (addSectionBtn) {
    addSectionBtn.addEventListener('click', createSection);
  }

  // เริ่มต้นสร้าง 1 Section เสมอ
  createSection();
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', initApp);
