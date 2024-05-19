const products = [
    { id: 1, name: "ENVI2024-SOLAR-001", price: 600, image: "images/ENVI2024-SOLAR-001.jpg" },
    { id: 2, name: "ENVI2024-HVAC-001", price: 4000, image: "images/ENVI2024-HVAC-001.jpg" },
    { id: 3, name: "ENVI2024-HVACINDUST-001", price: 16000, image: "images/ENVI2024-HVACINDUST-001.jpg" }
];

let cart = [];
let balance = 10000;
let currentUser = null;

function login(event) {
    event.preventDefault();
    currentUser = document.getElementById("username").value;
    document.getElementById("login-view").style.display = "none";
    document.getElementById("balance").style.display = "block";
    document.getElementById("products").style.display = "flex";
    document.getElementById("logout").style.display = "block";
    displayProducts(products);
    document.getElementById("balance-amount").innerText = balance;
}

function logout() {
    currentUser = null;
    document.getElementById("login-view").style.display = "block";
    document.getElementById("balance").style.display = "none";
    document.getElementById("products").style.display = "none";
    document.getElementById("cart").style.display = "none";
    document.getElementById("logout").style.display = "none";
}

function displayProducts(productsToDisplay) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";
    
    productsToDisplay.forEach(product => {
        const productCard = `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>£${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productsContainer.innerHTML += productCard;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
}

function updateCartCount() {
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    document.getElementById("cart-count").innerText = cartCount;
}

function searchProducts() {
    const searchQuery = document.getElementById("search-input").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery)
    );
    displayProducts(filteredProducts);
}

function showProducts() {
    document.getElementById("products").style.display = "flex";
    document.getElementById("cart").style.display = "none";
}

function showCart() {
    document.getElementById("products").style.display = "none";
    document.getElementById("cart").style.display = "flex";
    displayCart();
}

function displayCart() {
    const cartContainer = document.getElementById("cart");
    cartContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }
    
    cart.forEach(item => {
        const cartItem = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>£${item.price} x ${item.quantity} = £${item.price * item.quantity}</p>
                <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartContainer.innerHTML += cartItem;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartContainer.innerHTML += `<h3>Total: £${total}</h3>`;
    cartContainer.innerHTML += `<button onclick="checkout()">Checkout</button>`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    showCart();
}

function checkout() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (total > balance) {
        alert("Insufficient balance!");
    } else {
        balance -= total;
        document.getElementById("balance-amount").innerText = balance;
        cart = [];
        updateCartCount();
        showProducts();
        alert(`Checkout successful! Thank you for your purchase, ${currentUser}!`);
    }
}

// Call displayProducts function when the page loads
window.onload = () => {
    if (currentUser) {
        displayProducts(products);
        document.getElementById("balance-amount").innerText = balance;
    } else {
        document.getElementById("login-view").style.display = "block";
    }
};