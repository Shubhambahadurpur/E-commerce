
let start = 0;
let productSection = document.getElementById("product-section");
let loadMore = document.getElementById('loadmore');
loadMore.addEventListener('click', () => {
    start = start + 5;
    let data = {
        initial: start
    }
    let opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    fetch(`/`, opt)
        .then(response =>
            response = response.json()

        )
        .then((response) => {
            console.log(response);
            if (response === 'no') {
                let btn = document.getElementById('loadmore');
                alert("no more");
                btn.style.display = 'none';
            }
            else {
                nextProds = response;
                for (let i = 0; i < nextProds.length; i++) {
                    let productCard = document.createElement('div');
                    productCard.classList.add("product");
                    productCard.innerHTML = `
                                        <div class="image">
                                            <img src=${nextProds[i].productImage} alt="">
                                        </div>
                                    <div class="product-name">
                                        ${nextProds[i].productName}
                                    </div>
                                    <div class="buttons" >
                                        <button class="cart">ADD TO CART</button>
                                        <button class="detail" id=${nextProds[i]._id}>View Details</button>
                                        </div>
                                        `;
                    // <button class="detail" id=${nextProds[i].prodId}>View Details</button>
                    productSection.appendChild(productCard);

                    let bttn = document.getElementById(nextProds[i]._id);
                    bttn.addEventListener('click', function () {
                        viewDetails(this);
                    })

                }

            }
        })
})


async function viewDetails(e) {

    let productId = e.id;
    console.log(productId);
    let data = {
        productId: productId
    }
    let opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    const response = await fetch("/popup", opt);
    const productObject = await response.json();
    let popup = document.getElementById("product-details");

    let popupCard = document.createElement("div");
    popupCard.innerHTML = `<div class="product-details" id=${productObject.prodId}>
                            <div class="image-section">
                                <img src=${productObject.productImage} alt="">
                            </div>
                            <div class="details">
                                <h1>${productObject.productName}</h1>
                                <h4>${productObject.productDescription}</h4>
                                <h2>${productObject.productPrice}</h2>
                                <button class = "buy-btn">Buy Now</button>
                            </div>
                            <div class="closeDiv">
                            <button class="close" id = "closeBtn">X</button>
                            </div>
                        </div>
                        `;
    let container = document.getElementById('container');
    container.insertBefore(popupCard, container.children[0]);
    document.getElementById("closeBtn").addEventListener("click", () => {
        popupCard.remove();
    })

}

async function logOut(event){
    console.log(event.id);
    let data = {
        username : event.id
    }
    let opt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    try{
        let response = await fetch("/logout",opt);
        let responseObj = await response.json();
        if(responseObj.status == 200)
        {
            window.location.href = "/";
        }
    }
    catch(err){
        console.log(err);
    }
}


// document.getElementById("myProfile").addEventListener('click',()=>{
//     document.body.innerHTML = "";
// })



