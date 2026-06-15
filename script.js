let listProducts = [];
let cart = [];

async function taiSanPhanTuBackend() {
  try {
    const response = await fetch("http://localhost:5000/api/products");
    listProducts = await response.json();
    document.getElementById("total-badge").innerText =
      `BỘ SƯU TẬP GỒM ${listProducts.length} THIẾT KẾ`;
    hienThiSanPham(listProducts);
  } catch (error) {
    console.error("Lỗi kết nối API Backend:", error);
  }
}

function hienThiSanPham(products) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (products.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-16 text-zinc-400 font-light text-xs tracking-widest uppercase">KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP</div>`;
    return;
  }

  products.forEach((prod) => {
    const tagHTML = prod.tag
      ? `<span class="absolute top-4 left-4 z-10 text-[8px] font-light tracking-[0.3em] bg-white text-black px-3 py-1 uppercase border border-zinc-200 shadow-sm">${prod.tag}</span>`
      : "";
    const oldPriceHTML =
      prod.old_price > 0
        ? `<span class="text-[11px] text-zinc-400 line-through font-light ml-2.5">${prod.old_price.toLocaleString()}đ</span>`
        : "";

    grid.innerHTML += `
            <div class="product-card group relative flex flex-col bg-white">
                <div class="relative aspect-[3/4] overflow-hidden bg-[#fafafa] mb-4">
                    ${tagHTML}
                    <img src="${prod.img1}" class="w-full h-full object-cover">
                    
                    <div class="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/20 to-transparent">
                        <button onclick="addToCart(${prod.id})" class="w-full bg-black text-white text-[9px] tracking-[0.3em] font-light py-3.5 uppercase hover:bg-zinc-800 transition shadow-md">
                            THÊM VÀO GIỎ +
                        </button>
                    </div>
                </div>
                <div class="flex flex-col flex-1 text-center px-2">
                    <h3 class="luxury-heading text-[15px] font-normal text-zinc-800 hover:text-black tracking-wide mb-1 uppercase line-clamp-1">${prod.name.toLowerCase()}</h3>
                    <div class="pt-0.5">
                        <span class="text-[12px] font-medium tracking-wide text-zinc-900">${prod.price.toLocaleString()}đ</span>
                        ${oldPriceHTML}
                    </div>
                </div>
            </div>
        `;
  });
}

function boLocThongMinh() {
  const tuKhoa = document.getElementById("search-input").value.toLowerCase();
  const gioiTinh = document.getElementById("gender-select").value; // nam, nu, all
  const kieuDang = document.getElementById("type-select").value; // ao, quan, all
  const mucGia = document.getElementById("price-select").value;

  let ketQua = listProducts.filter((prod) => {
    // Kiểm tra từ khóa tìm kiếm
    const matchTen = prod.name.toLowerCase().includes(tuKhoa);

    // Phân tích category dạng "nam-ao", "nu-quan", "nam-quan"
    const mangLoai = prod.category.split("-"); // ['nam', 'ao']
    const dbGioiTinh = mangLoai[0];
    const dbKieuDang = mangLoai[1];

    const matchGioiTinh = gioiTinh === "all" || dbGioiTinh === gioiTinh;
    const matchKieuDang = kieuDang === "all" || dbKieuDang === kieuDang;

    // Kiểm tra lọc giá tiền
    let matchGia = true;
    if (mucGia === "duoi-300") matchGia = prod.price < 300000;
    else if (mucGia === "300-600")
      matchGia = prod.price >= 300000 && prod.price <= 600000;
    else if (mucGia === "600-1000")
      matchGia = prod.price >= 600000 && prod.price <= 1000000;
    else if (mucGia === "tren-1000") matchGia = prod.price > 1000000;

    return matchTen && matchGioiTinh && matchKieuDang && matchGia;
  });

  hienThiSanPham(ketQua);
}

function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("hidden");
}

function addToCart(id) {
  const prod = listProducts.find((p) => p.id === id);
  const itemTrongGio = cart.find((item) => item.id === id);
  if (itemTrongGio) {
    itemTrongGio.quantity++;
  } else {
    cart.push({ ...prod, quantity: 1 });
  }
  capNhatGioHang();
  document.getElementById("cart-drawer").classList.remove("hidden");
}

function capNhatGioHang() {
  const container = document.getElementById("cart-items");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    count += item.quantity;
    container.innerHTML += `
            <div class="flex items-center py-4 border-b border-zinc-100">
                <img src="${item.img1}" class="w-16 h-20 object-cover bg-zinc-50">
                <div class="ml-4 flex-1">
                    <h4 class="text-[11px] tracking-wide font-light text-zinc-900 uppercase line-clamp-1">${item.name}</h4>
                    <p class="text-[10px] text-zinc-400 font-light mt-0.5">SỐ LƯỢNG: ${item.quantity}</p>
                    <p class="text-[11px] font-medium text-zinc-900 mt-1">${(item.price * item.quantity).toLocaleString()}đ</p>
                </div>
            </div>
        `;
  });
  document.getElementById("cart-count").innerText = count;
  document.getElementById("cart-total").innerText =
    total.toLocaleString() + "đ";
}

function datHang() {
  if (cart.length === 0) return alert("Giỏ hàng của bạn đang trống!");
  const sdt = prompt("VUI LÒNG NHẬP SỐ ĐIỆN THOẠI ĐỂ XÁC NHẬN ĐƠN HÀNG:");
  if (!sdt) return;
  alert("HỆ THỐNG ĐÃ GHI NHẬN ĐƠN HÀNG THÀNH CÔNG. XIN CẢM ƠN QUÝ KHÁCH!");
  cart = [];
  capNhatGioHang();
  toggleCart();
}

document.addEventListener("DOMContentLoaded", () => {
  taiSanPhanTuBackend();
});
