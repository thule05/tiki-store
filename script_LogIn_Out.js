// ================== MODAL ĐĂNG NHẬP/ĐĂNG KÝ ==================
document.addEventListener("DOMContentLoaded", () =>
{
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const authModal = document.getElementById("auth-modal");
    const closeAuth = document.getElementById("close-auth");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // Mở modal đăng nhập
    loginBtn.addEventListener("click", () =>
    {
        authModal.classList.remove("hidden");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    });

    // Đóng modal
    closeAuth.addEventListener("click", () => authModal.classList.add("hidden"));

    // Chuyển sang form đăng ký
    document.getElementById("show-register").addEventListener("click", e =>
    {
        e.preventDefault();
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");
    });

    // Quay lại form đăng nhập
    document.getElementById("show-login").addEventListener("click", e =>
    {
        e.preventDefault();
        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    });

    // Đăng xuất
    logoutBtn.addEventListener("click", () =>
    {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");

        logoutBtn.classList.add("hidden");
        loginBtn.classList.remove("hidden");
        document.getElementById("welcome-user").textContent = "";
        alert("Bạn đã đăng xuất!");
    });

    // Khi load trang -> check trạng thái login
    if (localStorage.getItem("isLoggedIn") === "true")
    {
        loginBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");
        document.getElementById("welcome-user").textContent =
            "Xin chào, " + localStorage.getItem("username");
    }
});

// ====== Hàm tiện ích hiển thị thông báo ======
function showMessage(elementId, text, type = "error")
{
    const msg = document.getElementById(elementId);
    msg.textContent = text;
    msg.className = "message " + type;
    msg.style.display = "block";
    setTimeout(() => { msg.style.display = "none"; }, 3000);
}

// ====== Xử lý đăng nhập ======
function handleLogin()
{
    const user = document.getElementById("login-username").value.trim();
    const pass = document.getElementById("login-password").value.trim();

    if (!user || !pass)
    {
        showMessage("login-message", "Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(u => u.username === user && u.password === pass);

    if (foundUser)
    {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", user);

        showMessage("login-message", "Đăng nhập thành công!", "success");

        setTimeout(() =>
        {
            document.getElementById("auth-modal").classList.add("hidden");
            document.getElementById("login-btn").classList.add("hidden");
            document.getElementById("logout-btn").classList.remove("hidden");
            document.getElementById("welcome-user").textContent = "Xin chào, " + user;
        }, 1000);
    } else
    {
        showMessage("login-message", "Sai tài khoản hoặc mật khẩu!");
    }
}

// ====== Xử lý đăng ký ======
function handleRegister()
{
    const user = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const pass = document.getElementById("register-password").value.trim();

    if (!user || !email || !pass)
    {
        showMessage("register-message", "Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.username === user))
    {
        showMessage("register-message", "Tên đăng nhập đã tồn tại!");
        return;
    }

    users.push({ username: user, email: email, password: pass });
    localStorage.setItem("users", JSON.stringify(users));

    showMessage("register-message", "Đăng ký thành công!", "success");

    setTimeout(() =>
    {
        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
    }, 1000);
}