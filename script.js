const products = [
    {
        name: "Implora Luxury Gold",
        notes: "Neroli • Jasmine • Sandalwood",
        price: "Rp118.000",
        image: "assets/perfumes/implora-luxury-gold.webp",
        link: "products/luxury-gold.html"
    },
    {
        name: "Implora Magnificent",
        notes: "Blackcurrent • Plum • Musk",
        price: "Rp118.000",
        image: "assets/perfumes/implora-magnificent.webp",
        link: "products/magnificent.html"
    },
    {
        name: "Implora Pink Ribbon",
        notes: "Wild Strawberry • Peony • Caramel",
        price: "Rp118.000",
        image: "assets/perfumes/implora-pink-ribbon.webp",
        link: "products/pink-ribbon.html"
    },
    {
        name: "N°CO Amethyst",
        notes: "Cherry Blossom • Mandarin • Jasmine",
        price: "Rp53.000",
        image: "assets/perfumes/nco-amethyst.webp",
        link: "products/nco-amethyst.html"
    },
    {
        name: "N°CO Bloomique",
        notes: "Bergamot • Tangerine • Vanilla",
        price: "Rp53.000",
        image: "assets/perfumes/nco-bloomique.webp",
        link: "products/nco-bloomique.html"
    },
    {
        name: "N°CO Lunera",
        notes: "Saffron • Raspberry • Rose",
        price: "Rp53.000",
        image: "assets/perfumes/nco-lunera.webp",
        link: "products/nco-lunera.html"
    },
    {
        name: "N°CO Onyx",
        notes: "Passionfruit • Rose • Tonka Bean",
        price: "Rp53.000",
        image: "assets/perfumes/nco-onyx.webp",
        link: "products/nco-onyx.html"
    },
    {
        name: "N°CO Snowflake",
        notes: "Pink Grapefruit • Jasmine • Vanilla",
        price: "Rp53.000",
        image: "assets/perfumes/nco-snowflake.webp",
        link: "products/nco-snowflake.html"
    }
];

const featuredContainer = document.getElementById("featuredProducts");

if (featuredContainer) {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const featured = shuffled.slice(0, 3);

    featuredContainer.innerHTML = featured.map(product => `
        <a href="${product.link}" class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.notes}</p>
                <span>Rp${product.price.toLocaleString("id-ID")}</span>
            </div>
        </a>
    `).join("");
}

let cart = JSON.parse(localStorage.getItem("xiangweiCart")) || [];
let selectedCheckout = JSON.parse(localStorage.getItem("xiangweiCheckout")) || [];

function saveCart() {
    localStorage.setItem("xiangweiCart", JSON.stringify(cart));
}

function formatRupiah(number) {
    return "Rp" + number.toLocaleString("id-ID");
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function showToast(message) {
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

function addToCart(product) {
    cart.push(product);
    saveCart();
    updateCartCount();
    showToast(`${product.name} added to cart`);
}

document.addEventListener("click", function (event) {
    if (event.target.matches(".price-row button, .buy-btn")) {
        event.preventDefault();
        event.stopPropagation();

        const card = event.target.closest(".shop-card");

        if (card) {
            const product = {
                name: card.querySelector("h3").textContent,
                notes: card.querySelector("p").textContent,
                price: Number(card.querySelector(".price-row span").textContent.replace(/\D/g, "")),
                image: card.querySelector("img").src
            };

            addToCart(product);
        }

        const detailPage = event.target.closest(".product-detail-info");

        if (detailPage) {
            const product = {
                name: detailPage.querySelector("h1").textContent,
                notes: "Signature Fragrance",
                price: Number(detailPage.querySelector(".product-price").textContent.replace(/\D/g, "")),
                image: document.querySelector(".product-detail-image img").src
            };

            addToCart(product);
        }
    }
});

function renderCartPage() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart">Your cart is empty. Why not take a look at our products on <u><a href="shop.html">the shop page</a></u>?</div>`;
        cartTotal.textContent = "Rp0";
        return;
    }

    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <input type="checkbox" class="cart-check" data-index="${index}">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>${item.notes}</p>
                    <p>${formatRupiah(item.price)}</p>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
    });

    document.querySelectorAll(".cart-check").forEach((check) => {
        check.addEventListener("change", updateSelectedTotal);
    });

    document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", function () {
            const index = Number(this.dataset.index);
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            renderCartPage();
        });
    });

    checkoutBtn.addEventListener("click", function () {
        const checkedItems = document.querySelectorAll(".cart-check:checked");

        if (checkedItems.length === 0) {
            showToast("Please select products before proceeding to checkout.");
            return;
        }

        selectedCheckout = Array.from(checkedItems).map((check) => {
            return cart[Number(check.dataset.index)];
        });

        localStorage.setItem("xiangweiCheckout", JSON.stringify(selectedCheckout));
        window.location.href = "checkout.html";
    });
}

function updateSelectedTotal() {
    const checkedItems = document.querySelectorAll(".cart-check:checked");
    const cartTotal = document.getElementById("cartTotal");

    let total = 0;

    checkedItems.forEach((check) => {
        const index = Number(check.dataset.index);
        total += cart[index].price;
    });

    cartTotal.textContent = formatRupiah(total);
}

function renderCheckoutPage() {
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");
    const checkoutForm = document.getElementById("checkoutForm");

    if (!checkoutItems) return;

    selectedCheckout = JSON.parse(localStorage.getItem("xiangweiCheckout")) || [];

    if (selectedCheckout.length === 0) {
        checkoutItems.innerHTML = `<p class="empty-cart">No items selected for checkout.</p>`;
        checkoutTotal.textContent = "Total: Rp0";
        return;
    }

    let total = 0;
    checkoutItems.innerHTML = "";

    selectedCheckout.forEach((item) => {
        total += item.price;

        checkoutItems.innerHTML += `
            <div class="checkout-summary-item">
                <h4>${item.name}</h4>
                <p>${formatRupiah(item.price)}</p>
            </div>
        `;
    });

    checkoutTotal.textContent = `Total: ${formatRupiah(total)}`;

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        showToast("Order placed successfully");

        const orders = JSON.parse(localStorage.getItem("xiangweiOrders")) || [];

        const newOrder = {
            id: "XW-" + Date.now(),
            date: new Date().toLocaleString("id-ID"),
            items: selectedCheckout,
            status: "Processing"
        };

        orders.push(newOrder);
        localStorage.setItem("xiangweiOrders", JSON.stringify(orders));

        cart = cart.filter((cartItem) => {
            return !selectedCheckout.some((checkoutItem) => {
                return checkoutItem.name === cartItem.name && checkoutItem.price === cartItem.price;
            });
        });

        localStorage.setItem("xiangweiCart", JSON.stringify(cart));
        localStorage.removeItem("xiangweiCheckout");

        setTimeout(() => {
            window.location.href = "orders.html";
        }, 1600);
    });
}

updateCartCount();
renderCartPage();
renderCheckoutPage();

// ================= PAYMENT METHOD DETAIL =================

const paymentRadios = document.querySelectorAll('input[name="payment"]');
const bankDetail = document.getElementById("bankDetail");
const ewalletDetail = document.getElementById("ewalletDetail");

paymentRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
        if (bankDetail) bankDetail.classList.remove("show");
        if (ewalletDetail) ewalletDetail.classList.remove("show");

        if (this.value === "bank") {
            bankDetail.classList.add("show");
        }

        if (this.value === "ewallet") {
            ewalletDetail.classList.add("show");
        }
    });
});

// ================= ORDERS PAGE =================

function renderOrdersPage() {
    const ordersList = document.getElementById("ordersList");
    if (!ordersList) return;

    const orders = JSON.parse(localStorage.getItem("xiangweiOrders")) || [];

    if (orders.length === 0) {
        ordersList.innerHTML = `<div class="empty-cart">No orders found.</div>`;
        return;
    }

    ordersList.innerHTML = "";

    orders.reverse().forEach((order) => {
        let total = 0;
        let itemsHTML = "";

        order.items.forEach((item) => {
            total += item.price;
            itemsHTML += `
                <div class="order-item">
                    <span>${item.name}</span>
                    <strong>${formatRupiah(item.price)}</strong>
                </div>
            `;
        });

        ordersList.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>${order.id}</h3>
                        <p>${order.date}</p>
                    </div>
                    <span>${order.status}</span>
                </div>

                ${itemsHTML}

                <div class="order-total">
                    Total: ${formatRupiah(total)}
                </div>
            </div>
        `;
    });
}

const commentForm = document.getElementById("commentForm");

if (commentForm) {
    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const scriptURL =
            "https://script.google.com/macros/s/AKfycbxJ3LCWff16cRvP7OMKhl-nG1ksLuIagXicevb58QIbZzs8_E-Dsz4zmi_xun90q0-t/exec";

        const name = document.getElementById("commentName").value;
        const comment = document.getElementById("commentText").value;
        const message = document.getElementById("commentMessage");

        const formData = new URLSearchParams();
        formData.append("name", name);
        formData.append("comment", comment);

        fetch(scriptURL, {
            method: "POST",
            body: formData
        })
        .then(() => {
            message.textContent = "Thank you! Your comment has been submitted.";
            message.classList.add("show");
            commentForm.reset();

            setTimeout(() => {
                message.classList.remove("show");
                message.textContent = "";
            }, 4000);
        })
        .catch(err => {
            console.error(err);
            message.textContent = "Failed to submit comment.";
        });

        // munculin pesan
        message.textContent = "Thank you! Your comment has been submitted.";
        message.classList.add("show");

        // reset form
        commentForm.reset();

        // ilangin lagi setelah 4 detik
        setTimeout(() => {
            message.classList.remove("show");
            message.textContent = "";
        }, 4000);
    });
}

const galleryImages = document.querySelectorAll(".gallery-image");
const imageModal = document.getElementById("imageModal");
const fullImage = document.getElementById("fullImage");
const closeModal = document.querySelector(".close-modal");

galleryImages.forEach(image => {
    image.addEventListener("click", () => {
        imageModal.style.display = "flex";
        fullImage.src = image.src;
    });
});

if (closeModal) {
    closeModal.addEventListener("click", () => {
        imageModal.style.display = "none";
    });
}

if (imageModal) {
    imageModal.addEventListener("click", (e) => {
        if (e.target === imageModal) {
            imageModal.style.display = "none";
        }
    });
}

renderOrdersPage();