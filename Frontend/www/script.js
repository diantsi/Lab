console.log(pizza_info);

function orderPizza(title, size, price, sizeValue, weight, icon) {
    let obj = {
        title: title,
        size: size,
        price: price,
        sizeValue: sizeValue,
        weight: weight,
        icon: icon,
        amount: 1
    };
    return obj;
}

let orderedPizzas = JSON.parse(localStorage.getItem("orderedPizzas")) || [];

let typesOfPizzas = document.querySelectorAll(".types>span");
typesOfPizzas.forEach(function (type) {
    type.addEventListener("click", function () {
        document.getElementById("selected").removeAttribute("id");
        type.id = "selected";
        document.querySelector(".category").innerText = type.innerText;
        let counter = document.createElement("span");
        counter.className = "total";
        document.querySelector(".category").appendChild(counter);
        generatePizzaList();
    });
});

function generatePizzaList() {
    let quantity = 0;
    let html = "";
    let selectedType = document.getElementById("selected").innerText;
    for (let pizza of pizza_info) {
        if (selectedType === "Усі" ||
            selectedType === "М'ясні" && pizza.content.meat ||
            selectedType === "З ананасами" && pizza.content.pineapple ||
            selectedType === "З грибами" && pizza.content.mushroom ||
            selectedType === "З морепродуктами" && pizza.content.ocean ||
            selectedType === "Вега" && pizza.type === "Вега піца") {
            quantity++;
            html += `
<div class ="pizza-item">
    <div class="markers">
       ${pizza.is_new ? '<div class="new">Новинка</div>' : ""}
       ${pizza.is_popular ? '<div class="popular">Популярне</div>' : ""}
   </div>
    <img src="${pizza.icon}" alt="${pizza.title}">
    <h2 class="title">${pizza.title}</h2>
    <p class="type">${pizza.type}</p>
    <p class="composition">${Object.values(pizza.content).flat().join(', ')}.</p>
    <div class="size-properties">
        ${pizza.small_size ? `<div class="small">
        <p>
           <img src=assets/images/size-icon.svg>
          <span class="small-size">${pizza.small_size.size}</span>
        </p>
        <p>
           <img src=assets/images/weight.svg>
          <span class="small-weight">${pizza.small_size.weight}</span>
        </p>
        <h2>${pizza.small_size.price}</h2>
        <p>грн</p>
        <button class="buy-button" onclick="addPizza('${pizza.title}', 'Маленька', '${pizza.small_size.price}', '${pizza.small_size.size}', '${pizza.small_size.weight}', '${pizza.icon}')">Купити</button>
        </div>` : ""}
        ${pizza.big_size ? `<div class="big">
        <p>
          <img src=assets/images/size-icon.svg>
          <span class="big-size">${pizza.big_size.size}</span>
        </p>
        <p>
           <img src=assets/images/weight.svg>
          <span class="big-weight">${pizza.big_size.weight}</span>
        </p>
        <h2>${pizza.big_size.price}</h2>
        <p>грн</p>
        <button class="buy-button" onclick="addPizza('${pizza.title}', 'Велика', '${pizza.big_size.price}', '${pizza.big_size.size}', '${pizza.big_size.weight}', '${pizza.icon}')">Купити</button>
        </div>` : ""}
    </div>
</div>
`;
        }
    }
    document.querySelector(".total").innerText = quantity;
    document.querySelector(".variety").innerHTML = html;

}

function updateWarehouse() {
    let html = "";
    let sum = 0;

    for (let pizza of orderedPizzas) {
        html += htmlForCart(pizza);
        sum += pizza.price * pizza.amount;
    }
    const orderPizzasElement = document.querySelector('.card');

    orderPizzasElement.innerHTML = html;
    document.querySelector('.in-cart').innerText=orderedPizzas.length;
    document.querySelector('#sum').innerText=sum+" грн";

    localStorage.setItem("orderedPizzas", JSON.stringify(orderedPizzas));
}

document.querySelector('#clean-order').addEventListener("click", function () {
    orderedPizzas = []
    updateWarehouse()
})

function htmlForCart(pizza) {
    return `
     <div class="item">
            <section class="data">
                <span class="name">${pizza.title} (${pizza.size})</span>
                <div class="info-pizza">
                    <img src=assets/images/size-icon.svg>
                    <span>${pizza.sizeValue}</span>
                    <img src=assets/images/weight.svg>
                    <span>${pizza.weight}</span>
                </div>
                <div class="order-buttons">
                    <span class="price">${pizza.price*pizza.amount +" грн"}</span>
                    <button class="minus" onclick="minusOne('${pizza.title}', '${pizza.size}')">-</button>
                    <span class="quantity">${pizza.amount}</span>
                    <button class="plus" onclick="plusOne('${pizza.title}', '${pizza.size}')">+</button>
                    <button class="delete" onclick="removePizza('${pizza.title}', '${pizza.size}')">х</button>
                </div>
            </section>
            <img src=${pizza.icon} alt="pizza">
        </div>
    `
}

function minusOne(title, size) {
    for (let order of orderedPizzas) {
        if (order.title === title && order.size === size) {
            if (order.amount === 1) {
                removePizza(order.title, order.size);
                return;
            }
            order.amount--;
            updateWarehouse();
            return;
        }
    }
}

function plusOne(title, size) {
    for (let order of orderedPizzas) {
        if (order.title === title && order.size === size) {
            order.amount++;
            updateWarehouse();
            return;
        }
    }
}

function removePizza(title, size) {
    for (let i = 0; i < orderedPizzas.length; ++i) {
        if (orderedPizzas[i].title === title && orderedPizzas[i].size === size) {
            orderedPizzas.splice(i, 1);
            updateWarehouse();
            return;
        }
    }
}

function addPizza(title, size, price, sizeValue, weight, icon) {
    for (let order of orderedPizzas) {
        if (order.title === title && order.size === size) {
            order.amount++;
            updateWarehouse();
            return;
        }
    }
    orderedPizzas.push(orderPizza(title, size, price, sizeValue, weight, icon, 1));
    updateWarehouse();
}

generatePizzaList();
updateWarehouse();