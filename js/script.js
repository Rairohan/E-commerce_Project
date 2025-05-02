document.addEventListener("DOMContentLoaded", function () {
    const productList = document.getElementById("product-list");

    fetch("http://localhost:5000/api/products")
        .then(response => response.json())
        .then(products => {
            // Show only the first three products
            const limitedProducts = products.slice(0, 3);

            productList.innerHTML = limitedProducts.map(product => `
                <div class="product-card">
                    <img src="http://localhost:5000/${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `).join("");

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", function () {
                    const token = localStorage.getItem("token");

                    if (!token) {
                        alert("⚠️ Please log in to add items to your cart.");
                        window.location.href = "login.html";
                        return;
                    }

                    const productId = this.getAttribute("data-id");

                    fetch("http://localhost:5000/api/cart", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ product_id: productId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error === 'Invalid token') {
                            alert("⚠️ Your session has expired. Please log in again.");
                            localStorage.removeItem("token");
                            window.location.href = "login.html";
                        } else {
                            console.log("Add to cart response:", data);
                            alert("🛒 Product added to cart!");
                        }
                    })
                    .catch(error => {
                        console.error("Error adding to cart:", error);
                        alert("❌ Failed to add product to cart.");
                    });
                });
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            productList.innerHTML = "<p>Failed to load products.</p>";
        });
});
