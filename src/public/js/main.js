const socket = io();

socket.on('products', products => {
    const htmlBody = document.querySelector('#form-container');
    htmlBody.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("realtime-container");
        div.innerHTML = `    
            <div class="realtime-item">
                <img src= "https://upload.wikimedia.org/wikipedia/commons/1/1b/Square_200x200.png" alt="">
                <p>Title: ${product.title}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: ${product.stock}</p>
                <button class="button-item" id"${product._id}">Ver Mas</button>
            </div>
     
        `;
        htmlBody.append(div);
    });
});

const htmlForm = document.querySelector('#product-form');

htmlForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtenemos los valores del form

    const title = document.querySelector('#title').value;
    const price = document.querySelector('#price').value;
    const stock = document.querySelector('#stock').value;

    //Enviar el nuevo producto al servidor a traves del socket

    const product = {
        title: title,
        price: price, 
        stock: stock
    };

    socket.emit('addProduct', product);

    //Limpiar el form al enviar
    htmlForm.reset();

});