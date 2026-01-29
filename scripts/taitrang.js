/* ========================================
   WEBSITE DU LỊCH VŨNG TÀU - JavaScript
   Cập nhật: 2026
   ======================================== */

// ĐÃ SỬA: Kiểm tra form liên hệ tồn tại trước khi add event listener
document.addEventListener('DOMContentLoaded', function() {
  
  // Xử lý form liên hệ (nếu có)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const result = document.getElementById("result");
      if (result) {
        result.style.color = "green";
        result.textContent = "✅ Cảm ơn bạn! Chúng tôi sẽ liên hệ tư vấn trong thời gian sớm nhất.";
        
        // ĐÃ SỬA: Reset form sau 3 giây
        setTimeout(() => {
          contactForm.reset();
          result.textContent = "";
        }, 3000);
      }
    });
  }
  
  // ĐÃ SỬA: Thêm smooth scroll cho các liên kết anchor
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // ĐÃ SỬA: Thêm hiệu ứng fade-in khi scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Áp dụng observer cho các card và section
  document.querySelectorAll('.card, section').forEach(el => {
    observer.observe(el);
  });
  
  // ĐÃ SỬA: Thêm active state cho menu khi scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
  
  // ĐÃ SỬA: Thêm back to top button
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #C9A24D;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 99;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(backToTop);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  backToTop.addEventListener('mouseenter', () => {
    backToTop.style.transform = 'scale(1.1)';
  });
  
  backToTop.addEventListener('mouseleave', () => {
    backToTop.style.transform = 'scale(1)';
  });
  
});
