function product(name, amount, isBought) {
    let obj = new Object();
    obj.name = name;
    obj.amount = amount;
    obj.isBought = isBought;
    return obj;
}
let productsArray = JSON.parse(localStorage.getItem("Warehouse"));
if(!productsArray) {
    productsArray = [];
    productsArray.push(product("Помідори", 2, true));
    productsArray.push(product("Печиво", 2, false));
    productsArray.push(product("Сир", 1, false));
}

document.getElementById("new-button").onclick = function () {
    addProduct();
}

document.getElementById("name-input").addEventListener("keypress", function(e) {
    if(e.key === "Enter")
        addProduct();
});

function find(name) {
    for (let product of productsArray)
        if (product.name == name)
            return product;
    return null;
}

function remove(name) {
    for (let i = 0; i != productsArray.length; ++i)
        if (productsArray[i].name === name) {
            productsArray.splice(i, 1);
            return;
        }
}

function nameChanged(prevName, paragraph) {
    if (paragraph.innerText.length > 1 && find(paragraph.innerText) == null) {
        find(prevName).name = paragraph.innerText;
    }
    generate();
}

function increment(pname) {
    if (find(pname)) {
        ++find(pname).amount;
    }
    generate();
}

function decrement(pname) {
    if (find(pname)) {
        --find(pname).amount;
    }
    generate();
}

function byuDontBuy(pname) {
    if (find(pname)) {
        find(pname).isBought = !find(pname).isBought;
    }
    generate();
}

function addProduct() {
    let name = document.getElementById("name-input").value;
    if (find(name) || name.length === 0)
        return;
    productsArray.push(product(name, 1, false));
    document.getElementById("name-input").value = "";
    document.getElementById("name-input").focus();
    generate();
}

function xbuttonFunction(name) {
    remove(name);
    generate();
}

generate();


function makeProductForLeftPanel(product) {
    let div = document.createElement("section");
    div.classList.add("product");
    let nameLine = document.createElement("div");
    nameLine.classList.add("product-line");
    let name = document.createElement("span");
    name.classList.add("product-name");
    if (!product.isBought) {
        name.setAttribute("contenteditable", "true");
        name.innerText = product.name;
    } else {
        let s = document.createElement("span");
        s.innerText = product.name;
        name.appendChild(s);
    }
    name.addEventListener("focusout", function () {
        return nameChanged(product.name, name);
    })
    div.appendChild(name);
    let divAmount = document.createElement("div");
    divAmount.classList.add("quantity-line");
    let remBut = document.createElement("button");
    remBut.classList.add("remove-button");
    remBut.setAttribute("data-tooltip", "Прибрати");
    remBut.innerText = "-";
    if (product.amount > 1)
        remBut.onclick = function () {
            return decrement(product.name);
        };
    else
        remBut.classList.add("disabled");
    let addBut = document.createElement("button");
    addBut.classList.add("add-button");
    addBut.setAttribute("data-tooltip", "Додати");
    addBut.innerText = "+";
    addBut.onclick = function () {
        return increment(product.name);
    };
    let amountSpan = document.createElement("span");
    amountSpan.innerText = product.amount;
    if (product.isBought) {
        remBut.classList.add("crossed");
        addBut.classList.add("crossed");
    }
    divAmount.appendChild(remBut);
    divAmount.appendChild(amountSpan);
    divAmount.appendChild(addBut);
    div.appendChild(divAmount);

    let divBuy = document.createElement("div");
    divBuy.classList.add("condition-line");
    if (product.isBought) {
        let bought = document.createElement("button");
        bought.classList.add("buy-button");
        bought.setAttribute("data-tooltip", "Не купувати");
        bought.innerText = "Не куплено";
        bought.onclick = function () {
            return byuDontBuy(product.name);
        }
        divBuy.appendChild(bought);
    } else {
        let buyButton = document.createElement("button");
        buyButton.classList.add("buy-button");
        buyButton.setAttribute("data-tooltip", "Купити");
        buyButton.innerText = "Куплено";
        buyButton.onclick = function () {
            return byuDontBuy(product.name);
        }
        divBuy.appendChild(buyButton);
        let xbutton = document.createElement("button");
        xbutton.classList.add("delete-button");
        xbutton.setAttribute("data-tooltip", "Видалити");
        xbutton.innerText = "X";
        xbutton.onclick = function () {
            return xbuttonFunction(product.name);
        }
        divBuy.appendChild(xbutton);
    }
    div.appendChild(divBuy);
    return div;
}

function makeProductForRightPanel(product) {
    let div = document.createElement("section");
    div.classList.add("item");
    let name = document.createElement("span");
    name.classList.add("item-name");
    name.innerText = product.name;
    div.appendChild(name);
    let kilkist = document.createElement("span");
    kilkist.classList.add("amount");
    kilkist.innerText = product.amount;
    div.appendChild(kilkist);
    return div;
}

function generate() {
    document.getElementById("product-list").innerHTML = "";
    document.getElementById("notBought").innerHTML = "";
    document.getElementById("bought").innerHTML = "";

    for (let p of productsArray) {
        document.getElementById("product-list").appendChild(makeProductForLeftPanel(p));
        if(p.isBought)
            document.getElementById("bought").appendChild(makeProductForRightPanel(p));
        else
            document.getElementById("notBought").appendChild(makeProductForRightPanel(p));

    }
    localStorage.setItem("Warehouse", JSON.stringify(productsArray));

}
