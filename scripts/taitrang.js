/* ========================================================
   WEBSITE DU LỊCH VŨNG TÀU — taitrang.js
   Phiên bản: 2.0 | Cập nhật: 02/2026
   --------------------------------------------------------
   File chính tích hợp TOÀN BỘ logic dùng chung:
     1. Auth – hiển thị avatar / menu user / profile / logout
     2. Contact – lưu tin nhắn liên hệ vào localStorage
     3. Scroll UX – smooth-scroll, fade-in, back-to-top
   --------------------------------------------------------
   Cách dùng: <script src="scripts/taitrang.js"></script>
   Đặt CUỐI <body> (sau toàn bộ HTML).
   ========================================================
*/

document.addEventListener('DOMContentLoaded', function () {

  // =====================================================
  // 1. AUTH – Kiểm tra đăng nhập & hiển thị giao diện
  //    Đọc 'currentUser' từ localStorage.
  //    Nếu đã đăng nhập → thay nút "ĐĂNG NHẬP" bằng
  //    avatar + tên + dropdown menu (Thông tin cá nhân / Đăng xuất).
  //    Nếu chưa đăng nhập → giữ nút "ĐĂNG NHẬP" trỏ dangnhap.html.
  // =====================================================
  (function initAuth() {
    const username = localStorage.getItem('currentUser');
    const loginBtn = document.getElementById('loginBtn');
    if (!loginBtn) return; // Trang không có nút login (vd: dangnhap, dangky)

    // --- Chưa đăng nhập → giữ nút mặc định ---
    if (!username) {
      loginBtn.innerText = 'ĐĂNG NHẬP';
      loginBtn.href = 'dangnhap.html';
      return;
    }

    // --- Đã đăng nhập → thay nội dung nút bằng avatar ---
    loginBtn.innerHTML =
      '<div style="display:flex;align-items:center;gap:8px;cursor:pointer;">' +
        '<img src="images/user-avatar.png" style="width:32px;height:32px;border-radius:50%;border:2px solid white;">' +
        '<span>' + username + '</span>' +
      '</div>';
    loginBtn.href = '#';

    // --- Inject HTML menu + modal (chỉ 1 lần) ---
    if (!document.getElementById('userMenu')) {
      document.body.insertAdjacentHTML('beforeend',
        // Dropdown menu
        '<div id="userMenu" style="display:none;position:fixed;top:60px;right:20px;' +
          'background:#fff;color:#333;border-radius:8px;' +
          'box-shadow:0 10px 25px rgba(0,0,0,.25);min-width:180px;z-index:999;">' +
          '<div id="openProfile" style="padding:10px 14px;cursor:pointer;">👤 Thông tin cá nhân</div>' +
          '<div id="logout" style="padding:10px 14px;cursor:pointer;color:#c0392b;">🚪 Đăng xuất</div>' +
        '</div>' +
        // Modal thông tin cá nhân
        '<div id="profileModal" style="display:none;position:fixed;inset:0;' +
          'background:rgba(0,0,0,.5);z-index:1000;justify-content:center;align-items:center;">' +
          '<div style="background:#fff;padding:30px;border-radius:12px;width:340px;position:relative;">' +
            '<span id="closeProfileModal" style="position:absolute;top:10px;right:16px;font-size:24px;cursor:pointer;color:#888;">×</span>' +
            '<h3 style="margin-top:0;">👤 Thông tin cá nhân</h3>' +
            '<input id="profileName"  placeholder="Tên đăng nhập"  style="width:100%;padding:8px;margin:6px 0;box-sizing:border-box;">' +
            '<input id="profileEmail" placeholder="Email"           style="width:100%;padding:8px;margin:6px 0;box-sizing:border-box;">' +
            '<input id="profilePhone" placeholder="Số điện thoại"   style="width:100%;padding:8px;margin:6px 0;box-sizing:border-box;">' +
            '<input id="profileDob"   type="date"                   style="width:100%;padding:8px;margin:6px 0;box-sizing:border-box;">' +
            '<input id="profilePass"  type="password" placeholder="Mật khẩu" style="width:100%;padding:8px;margin:6px 0;box-sizing:border-box;">' +
            '<button id="saveProfile" style="width:100%;padding:10px;background:#3498db;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:15px;margin-top:8px;">💾 Lưu thay đổi</button>' +
          '</div>' +
        '</div>'
      );
    }

    // --- Toggle dropdown khi click avatar ---
    loginBtn.onclick = function (e) {
      e.preventDefault();
      var menu = document.getElementById('userMenu');
      menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    };

    // --- Mở modal thông tin cá nhân ---
    document.getElementById('openProfile').onclick = function () {
      document.getElementById('userMenu').style.display = 'none';
      var modal  = document.getElementById('profileModal');
      var user   = JSON.parse(localStorage.getItem('user_' + username) || '{}');

      document.getElementById('profileName').value  = user.username || '';
      document.getElementById('profileEmail').value = user.email    || '';
      document.getElementById('profilePhone').value = user.phone    || '';
      document.getElementById('profileDob').value   = user.dob      || '';
      document.getElementById('profilePass').value  = user.password || '';

      modal.style.display = 'flex';
    };

    // --- Đóng modal khi click X hoặc ngoài modal ---
    document.getElementById('closeProfileModal').onclick = function () {
      document.getElementById('profileModal').style.display = 'none';
    };
    document.getElementById('profileModal').addEventListener('click', function (e) {
      if (e.target === this) this.style.display = 'none';
    });

    // --- Lưu thông tin cá nhân ---
    //     Nếu tên đăng nhập đổi → xóa key cũ, tạo key mới.
    //     Cập nhật 'currentUser' cho phiên đăng nhập hiện tại.
    document.getElementById('saveProfile').onclick = function () {
      var newName = document.getElementById('profileName').value.trim().toLowerCase();
      var email   = document.getElementById('profileEmail').value.trim();
      var phone   = document.getElementById('profilePhone').value.trim();
      var dob     = document.getElementById('profileDob').value;
      var pass    = document.getElementById('profilePass').value.trim();

      if (!newName || !pass) {
        alert('⚠️ Tên & mật khẩu không được rỗng');
        return;
      }

      var oldKey = 'user_' + username;
      var newKey = 'user_' + newName;

      // Kiểm tra tên mới đã tồn tại chưa (trừ trường hợp không đổi tên)
      if (newName !== username && localStorage.getItem(newKey)) {
        alert('❌ Tên đăng nhập đã tồn tại!');
        return;
      }

      var userData = { username: newName, email: email, phone: phone, dob: dob, password: pass };
      localStorage.removeItem(oldKey);
      localStorage.setItem(newKey, JSON.stringify(userData));
      localStorage.setItem('currentUser', newName);

      alert('✅ Cập nhật thành công');
      location.reload(); // Reload để cập nhật UI
    };

    // --- Đăng xuất ---
    //     Chỉ xóa 'currentUser'; dữ liệu user vẫn còn để đăng nhập lại.
    document.getElementById('logout').onclick = function () {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    };

    // --- Click ngoài menu → đóng menu ---
    document.addEventListener('click', function (e) {
      var menu = document.getElementById('userMenu');
      if (menu && !loginBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
      }
    });
  })(); // end initAuth


  // =====================================================
  // 2. CONTACT – Lưu tin nhắn liên hệ vào localStorage
  //    Key: 'contactMessages' → Array of objects.
  //    Chỉ chạy nếu trang có form#contactForm.
  // =====================================================
  (function initContact() {
    var form   = document.getElementById('contactForm');
    var result = document.getElementById('result');
    if (!form) return; // Không phải trang liên hệ → bỏ qua

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('name').value.trim();
      var email   = document.getElementById('email').value.trim();
      var phone   = document.getElementById('phone').value.trim();
      var service = document.getElementById('service')  ? document.getElementById('service').value  : '';
      var tour    = document.getElementById('service2') ? document.getElementById('service2').value : '';
      var message = document.getElementById('message').value.trim();

      // --- Validation ---
      if (!name || !email || !phone) {
        result.style.color = 'red';
        result.textContent = '⚠️ Vui lòng nhập đầy đủ thông tin bắt buộc!';
        return;
      }
      if (!email.includes('@')) {
        result.style.color = 'red';
        result.textContent = '⚠️ Email không hợp lệ!';
        return;
      }

      // --- Tạo object dữ liệu & lưu localStorage ---
      var contactData = {
        id:        Date.now(),
        name:      name,
        email:     email,
        phone:     phone,
        service:   service || 'Không chọn',
        tourType:  tour    || 'Không chọn',
        message:   message || '',
        date:      new Date().toLocaleDateString('vi-VN'),
        status:    'Chưa xử lý'
      };

      var messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      messages.unshift(contactData);       // Mới nhất đầu
      localStorage.setItem('contactMessages', JSON.stringify(messages));

      // --- Hiển thị kết quả & reset form ---
      result.style.color  = 'green';
      result.textContent  = '✅ Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn trong 24h.';

      setTimeout(function () {
        form.reset();
        result.textContent = '';
      }, 3000);
    });

    // --- Tự load tour từ URL param ?tour=... ---
    var params = new URLSearchParams(window.location.search);
    var tourParam = params.get('tour');
    if (tourParam) {
      var sel = document.getElementById('service2');
      if (sel) sel.value = tourParam;
    }
  })(); // end initContact


  // =====================================================
  // 3. SCROLL UX – Smooth scroll, fade-in, back-to-top
  // =====================================================

  // --- 3a. Smooth scroll cho các liên kết #anchor ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- 3b. Fade-in khi element scroll vào viewport ---
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

  document.querySelectorAll('.card, section').forEach(function (el) {
    observer.observe(el);
  });

  // --- 3c. Back-to-top button ---
  var btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.style.cssText =
    'position:fixed;bottom:30px;right:30px;width:50px;height:50px;border-radius:50%;' +
    'background:#C9A24D;color:#fff;border:none;font-size:24px;cursor:pointer;' +
    'opacity:0;visibility:hidden;transition:all .3s ease;z-index:99;' +
    'box-shadow:0 5px 15px rgba(0,0,0,.2);';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.style.opacity    = window.scrollY > 500 ? '1' : '0';
    btn.style.visibility = window.scrollY > 500 ? 'visible' : 'hidden';
  });
  btn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  btn.onmouseenter = function () { btn.style.transform = 'scale(1.1)'; };
  btn.onmouseleave = function () { btn.style.transform = 'scale(1)';   };

}); // end DOMContentLoaded
