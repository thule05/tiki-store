// ================== GIỎ HÀNG ==================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Cập nhật số lượng hiển thị trên icon giỏ
function updateCartCount()
{
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById("cart-count");

    if (cartCountEl)
    {
        if (count > 0)
        {
            cartCountEl.textContent = count;
            cartCountEl.classList.remove("hidden");
        } else
        {
            cartCountEl.classList.add("hidden");
        }
    }
}

// ================== THÔNG BÁO THÊM SẢN PHẨM VÀO GIỎ HÀNG ==================
function showToast(message, type = "success", product = null)
{
    const toast = document.getElementById("toast");
    if (!toast) return; 

    let icon = "";
    let bg = "#333";

    if (type === "success")
    {
        icon = '<i class="fa-solid fa-circle-check"></i>';
        bg = "#4caf50";
    }
    if (type === "error")
    {
        icon = '<i class="fa-solid fa-circle-xmark"></i>';
        bg = "#f44336";
    }
    if (type === "info")
    {
        icon = '<i class="fa-solid fa-circle-info"></i>';
        bg = "#2196f3";
    }

    if (product)
    {
        toast.innerHTML = `
            ${icon}
            <img src="${product.image}" width="40" style="border-radius:6px">
            <div>
                <strong>${message}</strong><br>
                <small>${product.name}</small>
            </div>
        `;
    } else
    {
        toast.innerHTML = `${icon} <span>${message}</span>`;
    }

    toast.style.background = bg;

    toast.className = "show";

    setTimeout(() =>
    {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// ================== THÊM SẢN PHẨM ==================
function addToCart(product)
{
    let existing = cart.find(item => item.name === product.name);
    if (existing)
    {
        existing.quantity += 1;
    } else
    {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    showToast("Đã thêm vào giỏ hàng!", "success", product);
}

// Lắng nghe sự kiện khi bấm nút "Thêm"
document.querySelectorAll(".add-to-cart").forEach((btn) =>
{
    btn.addEventListener("click", (e) =>
    {
        let card = e.target.closest(".product-card, .shop-card");

        let product = {
            name: card.querySelector("h3").innerText,
            price: card.querySelector(".price").childNodes[0].textContent.trim(),
            image: card.querySelector("img").src
        }; addToCart(product);
    });
});

// Khi load trang thì cập nhật số lượng luôn
updateCartCount();

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




