import { createComponent } from './input-list-component.js'; // สมมติว่าไฟล์เก่าคุณชื่อนี้

// ฟังก์ชันสำหรับจัดการ Section ทั้งหมด
export function initApp() {
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
      section.querySelector('.app-title-section-number').textContent =
        index + 1;

      // จัดการปุ่มลบ (ห้ามลบถ้าเหลือแค่ 1)
      const removeBtn = section.querySelector('.app-cmd-remove-section');
      removeBtn.disabled = sections.length === 1;
    });
  };

  // ฟังก์ชันสร้าง Section ใหม่
  const createSection = () => {
    // 1. Clone Template ของ Section ออกมา
    const newSection =
      sectionTemplate.content.cloneNode(true).firstElementChild;

    // 2. เรียกใช้ Logic เดิมของคุณ (createComponent) กับ Section นี้
    // ตรงนี้สำคัญมาก! มันจะทำให้ Logic เดิมทำงานเฉพาะใน scope ของ newSection นี้เท่านั้น
    createComponent(newSection);

    // 3. เพิ่ม Event ลบ Section
    newSection
      .querySelector('.app-cmd-remove-section')
      .addEventListener('click', () => {
        newSection.remove();
        updateSectionInfo(); // เรียงเลขใหม่หลังลบ
      });

    // 4. เอาไปแปะในหน้าเว็บ
    sectionsContainer.append(newSection);

    // 5. อัปเดตเลข
    updateSectionInfo();
  };

  // ผูกปุ่มกด Add Section
  addSectionBtn.addEventListener('click', createSection);

  // เริ่มต้นสร้าง 1 Section เสมอ
  createSection();
}

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', initApp);
