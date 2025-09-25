// ================== GIỎ HÀNG ==================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () =>
{
    const cartBtn = document.getElementById("cart-btn");
    const cartOverlay = document.getElementById("cart-overlay");
    const closeCartBtn = document.querySelector(".close-cart");
    const cartBody = document.getElementById("cart-body");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    function renderCart()
    {
        if (!cartBody || !cartTotal) return;
        cartBody.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) =>
        {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            let row = document.createElement("tr");
            row.innerHTML = `
              <td><img src="${item.img}" width="50"> ${item.name}</td>
              <td>${item.price.toLocaleString()}₫</td>
              <td>
                <input type="number" min="1" value="${item.quantity}"
                       onchange="updateQty(${index}, this.value)">
              </td>
              <td>${itemTotal.toLocaleString()}₫</td>
              <td><button onclick="removeItem(${index})">❌</button></td>
            `;
            cartBody.appendChild(row);
        });

        cartTotal.textContent = total.toLocaleString();
    }

    function saveCart()
    {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    window.addToCart = function (product)
    {
        let existing = cart.find(item => item.name === product.name);
        if (existing)
        {
            existing.quantity++;
        } else
        {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert("Đã thêm vào giỏ hàng!");
    };

    window.updateQty = function (index, qty)
    {
        cart[index].quantity = Math.max(1, parseInt(qty));
        saveCart();
    };

    window.removeItem = function (index)
    {
        cart.splice(index, 1);
        saveCart();
    };

    function updateCartCount()
    {
        if (!cartCount) return;
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Event mở/đóng giỏ hàng
    if (cartBtn && cartOverlay)
    {
        cartBtn.addEventListener("click", () =>
        {
            cartOverlay.classList.add("active");
            renderCart();
        });
    }
    if (closeCartBtn && cartOverlay)
    {
        closeCartBtn.addEventListener("click", () =>
        {
            cartOverlay.classList.remove("active");
        });
    }

    // THÊM SẢN PHẨM VÀO GIỎ HÀNG
    document.querySelectorAll(".add-to-cart").forEach(btn =>
    {
        btn.addEventListener("click", () =>
        {
            // Tìm phần tử cha gần nhất có class product-card hoặc shop-card
            const card = btn.closest(".product-card, .shop-card");
            if (!card) return;

            const name = card.querySelector("h3").innerText;
            const price = parseInt(card.querySelector(".price").innerText.replace(/\D/g, ""));
            const img = card.querySelector("img").src;

            addToCart({ name, price, img });
        });
    });

    // Khi load trang
    updateCartCount();
    renderCart();
});

// ================== CHATBOT ==================
document.addEventListener("DOMContentLoaded", () =>
{
    const chatToggle = document.getElementById("chat-toggle");
    const chatbot = document.getElementById("chatbot");
    const chatClose = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input");
    const chatBox = document.getElementById("chat-body");

    function sendChat()
    {
        let msg = chatInput.value.trim();
        if (!msg) return;

        let p = document.createElement("p");
        p.innerText = "Bạn: " + msg;
        chatBox.appendChild(p);

        chatInput.value = "";

        let bot = document.createElement("p");
        bot.innerText = "Bot: Cảm ơn bạn đã nhắn tin!";
        chatBox.appendChild(bot);

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (chatToggle && chatbot) chatToggle.onclick = () => chatbot.style.display = "flex";
    if (chatClose && chatbot) chatClose.onclick = () => chatbot.style.display = "none";
    if (chatSend) chatSend.onclick = () => sendChat();
});

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



// ================== SLIDESHOW ==================
document.addEventListener("DOMContentLoaded", () =>
{
    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) { showSlides(slideIndex += n); }
    function currentSlide(n) { showSlides(slideIndex = n); }

    function showSlides(n)
    {
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");

        if (slides.length === 0) return;

        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
        for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");

        slides[slideIndex - 1].style.display = "block";
        if (dots[slideIndex - 1]) dots[slideIndex - 1].className += " active";
    }

    // Expose functions
    window.plusSlides = plusSlides;
    window.currentSlide = currentSlide;

    // Auto slide
    setInterval(() => plusSlides(1), 4000);
});

// ================== LỌC & TÌM KIẾM ==================
document.addEventListener("DOMContentLoaded", () =>
{
    const checkboxes = document.querySelectorAll(".filter-checkbox");
    const products = document.querySelectorAll(".shop-card");
    const searchInput = document.getElementById("searchInput");

    function filterProducts()
    {
        const checked = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        const keyword = searchInput?.value.toLowerCase() || "";

        products.forEach(item =>
        {
            const category = item.dataset.category;
            const name = item.querySelector("h3").textContent.toLowerCase();
            const matchCategory = checked.includes(category);
            const matchSearch = name.includes(keyword);

            item.style.display = (matchCategory && matchSearch) ? "block" : "none";
        });
    }

    checkboxes.forEach(cb => cb.addEventListener("change", filterProducts));
    searchInput?.addEventListener("input", filterProducts);
});

// TÍNH NĂNG THANH TÌM KIẾM
function search()
{
    let input = document.getElementById("searchInput").value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(product =>
    {
        let name = product.querySelector(".product-name").textContent.toLowerCase();

        if (name.includes(input))
        {
            product.style.display = "block"; // Hiện sản phẩm
        } else
        {
            product.style.display = "none"; // Ẩn sản phẩm
        }
    });
}




