    function addRow() {
    const container = document.getElementById("kvContainer");

    const div = document.createElement("div");
    div.className = "kv-row";

    div.innerHTML = `
        <input type="text" placeholder="Key" name = "spec_key[]">
        <input type="text" placeholder="Value" name = "spec_value[]">
        <button type="button" class="remove" onclick="this.parentElement.remove()">X</button>
    `;

    container.appendChild(div);
}


window.onload = function() {
    loadProducts();
};

function loadProducts() {
    console.log("Fetching products...");
    fetch('../backend/products/fetchProducts.php')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const tableBody = document.querySelector("#productTable tbody");
            let rows = ""; 

            data.forEach(product => {
                rows += `
                    <tr>
                        <td><img src="../backend/products/${product.image}" alt="img" 
                             onerror="this.onerror=null;this.src='https://via.placeholder.com/50';"></td>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>RS. ${product.price}</td>
                        <td>${product.stockQuantity}</td>
                    </tr>
                `;
            });
            tableBody.innerHTML = rows;
        })
        .catch(error => console.error('Fetch error:', error));

document.getElementById("productForm").reset();
    }



    //TODO : Add session for admin and only allow access to this page if admin is logged in. Also add a logout button to end the session.
function deleteProduct(){
    let productId = document.getElementById("deleteID");
    productId = productId.value.trim();
    if(!productId){
        alert("Please enter a product ID to delete.");
        return;
    }else{
        console.log(`Attempting to delete product with ID: ${productId}`);
        if(confirm(`Are you sure you want to delete product with ID ${productId}?`)){
            fetch(`../backend/products/DeleteProductById.php?deleteId=${productId}`, {
                method: "DELETE"
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                alert(data);
                loadProducts();
            })
            .catch(error => console.error('Delete error:', error));
        }
    }

}function updateStock() {
    const id = document.getElementById('updateId').value;
    const qty = document.getElementById('updateStock').value;
    const price = document.getElementById('updatePrice').value;
    const discount = document.getElementById('updateDiscount').value;

    if (!id) {
        alert("Please enter a Product ID.");
        return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('newqty', qty);
    formData.append('newPrice', price);
    formData.append('newDiscount', discount);

    fetch('../backend/products/updatingProductById.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        if (data.includes("Success")) {
            loadProducts(); 
            document.getElementById('updateId').value = "";
            document.getElementById('updateStock').value = "";
            document.getElementById('updatePrice').value = "";
            document.getElementById('updateDiscount').value = "";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while updating.");
    });
}


// Insert product specifications

function submitData() {

   
   const rows = document.querySelectorAll("#kvContainer .kv-row");
   const specs = [];

 const idInput = document.getElementById("product_id") || document.querySelector('input[name="product_id"]');
   const id = idInput.value.trim();

   if(!id){
    alert("Please enter a product ID");
    return;
   }

   rows.forEach(row=>{
    const key = row.querySelector('input[name="spec_key[]"]').value.trim();
    const value = row.querySelector('input[name="spec_value[]"]').value.trim();

    if(key && value){
        specs.push({ key, value});
    }
   });

   console.log("Submitting specs for product ID:", id);
   console.log("Specs:", specs);

   fetch('../backend/productSpec/addProductSepec.php', {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, specifications: specs})
    })
    .then(res => res.text())
    .then(data => alert(data))
    .catch(err => console.error(err));
}

function searchProduct() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const table = document.getElementById('productTable');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(3)');
        if (nameCell && nameCell.textContent.toLowerCase().includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}