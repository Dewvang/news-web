const mobileMenu = document.getElementById('mobile-menu');
const sideMenu = document.getElementById('side-menu');
const overlay = document.getElementById('overlay');

console.log(mobileMenu, sideMenu, overlay);  // ตรวจสอบว่าได้ค่าถูกต้องหรือไม่

// เปิดเมนู
mobileMenu.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
    overlay.classList.toggle('active');
});

// ปิดเมนูเมื่อคลิกพื้นที่ว่าง
overlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
});
