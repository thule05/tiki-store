// ================= Danh sách mã giảm giá =================
const coupons = [
    { code: "SALE5", discount: 5 },
    { code: "SALE10", discount: 10 },
    { code: "SALE20", discount: 20 }
];

let appliedDiscount = 0;

// Đổ coupon vào select
const couponSelect = document.getElementById("coupon");
coupons.forEach(c =>
{
    const opt = document.createElement("option");
    opt.value = c.discount;
    opt.textContent = `${c.code} - Giảm ${c.discount}%`;
    couponSelect.appendChild(opt);
});

// Nút áp dụng
document.getElementById("applyCoupon").addEventListener("click", () =>
{
    const discount = parseInt(couponSelect.value);
    const messageEl = document.getElementById("coupon-message");

    if (discount > 0)
    {
        appliedDiscount = discount;
        renderCart();
        messageEl.style.color = "green";
        messageEl.textContent = `Mã ${couponSelect.options[couponSelect.selectedIndex].text} đã áp dụng.`;
    } else
    {
        appliedDiscount = 0;
        renderCart();
        messageEl.style.color = "red";
        messageEl.textContent = `Không áp dụng mã giảm giá`;
    }
});

// Ghi đè renderCart để tính giảm giá
const oldRenderCart = renderCart;
renderCart = function ()
{
    oldRenderCart();
    let totalText = totalEl.innerText;
    let total = parseInt(totalText.replace(/[^\d]/g, ""));

    if (appliedDiscount > 0)
    {
        let discountAmount = (total * appliedDiscount) / 100;
        let newTotal = total - discountAmount;
        totalEl.innerHTML = `
      Tổng tiền hàng: <span class="old-total">${total.toLocaleString("vi-VN")}₫</span> 
      <br>
      Số tiền giảm: <span class="discount-amount">-${discountAmount.toLocaleString("vi-VN")}₫</span>
      <hr style="margin: 8px 0; border: 0; border-top: 1px dashed #999;">
      Tổng thanh toán: <span class="new-total">${newTotal.toLocaleString("vi-VN")}₫</span>
    `;
    }
};
