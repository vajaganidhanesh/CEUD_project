// loading data from local storage

let products = []

if(localStorage.getItem("products")!==null)
{
    products=JSON.parse(localStorage.getItem("products"));
}
else
{
    localStorage.setItem("products",JSON.stringify(products));
}

// copying it in temp array for filteration

let filteredProducts = products;

// getting total pages

let totalPages=null;
let currentPage=null;
let start = null;
let end = null;
let paginate = [];


function setupPagination()
{
    totalPages = Math.ceil(filteredProducts.length/10);
    document.getElementById("totalpages").innerText=totalPages;

    currentPage = 1;
    document.getElementById("currentpage").innerText=currentPage

    for(let i=1;i<=totalPages;i++)
    {
        let link = document.createElement("a");
        link.classList.add("pagelinks");
        link.append(i);
        link.onclick=function( ){
            openpage(i);
        }
        document.getElementById("pagelink").appendChild(link);
    }

    start = (currentPage-1)*10;
    end = currentPage*10;
    paginate = filteredProducts.slice(start,end);
}

// function to display data of given product array

function display(arr){

    document.getElementById('data').innerHTML="";

    let numbering = start+1;

    arr.forEach(function(product,index){
    let tr = document.createElement("tr");

    let numberTd = document.createElement('td');
    numberTd.append(numbering);
    tr.appendChild(numberTd);

    numbering++;

    let nameTd = document.createElement('td');
    nameTd.append(product.name);
    tr.appendChild(nameTd);

    let categoryTd = document.createElement('td');
    categoryTd.append(product.category);
    tr.appendChild(categoryTd);

    let priceTd = document.createElement('td');
    priceTd.append(product.price);
    tr.appendChild(priceTd);

    let imageTd = document.createElement("td");
    let imgEle = document.createElement("img");
    imgEle.src=product.image;
    imgEle.classList.add("pimg");
    imageTd.appendChild(imgEle);
    tr.appendChild(imageTd);
    
    let sellerTd = document.createElement('td');
    sellerTd.append(product.seller);
    tr.appendChild(sellerTd);

    let companyTd = document.createElement('td');
    companyTd.append(product.company);
    tr.appendChild(companyTd);

    let actionTd = document.createElement("td");
    actionTd.classList.add("action")
    let viewIcon = document.createElement("i")
    viewIcon.classList.add("fa-solid");
    viewIcon.classList.add("fa-eye");
    viewIcon.addEventListener("click",function(){
        viewProduct(product.id);
    })
    actionTd.append(viewIcon);
    tr.appendChild(actionTd);

    let editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid");
    editIcon.classList.add("fa-pen-to-square");
    editIcon.addEventListener('click',function(){
        setupUpdateProduct(product.id);
    })
    actionTd.append(editIcon);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid");
    deleteIcon.classList.add("fa-trash-can");

    deleteIcon.addEventListener("click",function(){
        deleteProduct(product.id);
    })

    actionTd.append(deleteIcon);

    document.getElementById('data').appendChild(tr)
    })
}
setupPagination();
display(paginate);

// pagination function for nextPage

function nextPage(){

    if(currentPage<totalPages)
    {
        currentPage++;
        
        openpage(currentPage);
    }
}

// pagination function for prevPage

function prevPage()
{
    if(currentPage>1)
    {
        currentPage--;

        openpage(currentPage);

    }
}

function openpage(pageNo)
{
    currentPage = pageNo
    if(pageNo!=="" && pageNo!==null && pageNo>=1 && pageNo<=totalPages)
    {
        document.getElementById("currentpage").innerText=pageNo;
        start = (currentPage-1)*10;
        end  = currentPage*10;
        paginate = filteredProducts.slice(start,end);
        display(paginate);
    }
}


let filters={
    name:null,
    category:null,
    price:null
}

function readValue(event,property){
    
    if(event.target.value!=="")
    {
        filters[property]=event.target.value;
    }
    else
    {
        filters[property]=null;
    }

}

function filter()
{
    filteredProducts=products;
    if (filters.name!==null) {
        filteredProducts=filteredProducts.filter(function(product,index){
            return filters.name.toUpperCase() === product.name.toUpperCase();
        })
    }
    if(filters.category!==null){
        filteredProducts=filteredProducts.filter(function(product,index){
            return filters.category.toUpperCase()  === product.category.toUpperCase();
        })
    }
    if(filters.price!==null)
    {
        let price = filters.price.split("-");

        filteredProducts=filteredProducts.filter(function(product,index){
            return product.price>=Number(price[0]) && product.price<=Number(price[1])
        })
    }
    if(filteredProducts.length!==0){
        document.getElementById('message').style.display='none';

        setupPagination();
        display(paginate)
    }
    else
    {
        document.getElementById('data').innerHTML="";
        document.getElementById('message').style.display='block'
    }

    
}

function toggleModal(open,modalID)
{
//    alert()
   if(open===true)
   {
       document.getElementById(modalID).style.display="flex";
   }
   else
   {
       document.getElementById(modalID).style.display="none";
   }
}


// function to close modal by clicking on the background area

    function closeModal(event,textid){
        if(event.target.id===textid)
        {
            toggleModal(false,event.target.id);
        }
    }



function viewProduct(id){
    let product = products.find(function(product,index){
        return product.id === id;
    });

    document.getElementById("pro_img").src=product.image;
    document.getElementById("pro_name").innerText = "Name : " + product.name;
    document.getElementById("pro_category").innerText ="Category : " + product.category;
    document.getElementById("pro_price").innerText= "Price : " + product.price;
    document.getElementById("pro_seller").innerText ="Seller :  " + product.seller;
    document.getElementById("pro_company").innerText = 'Company : ' + product.company;


    toggleModal(true,'view_modal');
}

// function to setup data for updata
let productToUpdate=null;

function setupUpdateProduct(id){
    // console.log(id);
    productToUpdate = products.find(function(product,index){
        return product.id === id;
    })

    document.getElementById('product_name_up').value = productToUpdate.name;
    document.getElementById('product_category_up').value = productToUpdate.category;
    document.getElementById('product_price_up').value = productToUpdate.price;
    document.getElementById('product_seller_up').value = productToUpdate.seller;
    document.getElementById('product_company_up').value = productToUpdate.company;
    document.getElementById('product_image_up').value = productToUpdate.image;

    toggleModal(true,"update_modal")
}

// function to update the product

function updateProduct()
{

    productToUpdate.name=document.getElementById('product_name_up').value;
    productToUpdate.category=document.getElementById('product_category_up').value;
    productToUpdate.price=Number(document.getElementById('product_price_up').value);
    productToUpdate.seller=document.getElementById('product_seller_up').value;
    productToUpdate.company=document.getElementById('product_company_up').value;
    productToUpdate.image=document.getElementById('product_image_up').value;

    display(paginate);
    toggleModal(false,"update_modal");

    localStorage.setItem("products",JSON.stringify(products));

}

// function to add a new product

function addProduct()
{
    let product = {};

    if(products.length!==0)
    {
        let lastId= products[products.length-1].id;
        product.id = ++lastId;
    }
    else
    {
        product.id = 1;
    }

    product.name=document.getElementById('product_name').value;
    product.category=document.getElementById('product_category').value;
    product.price=Number(document.getElementById('product_price').value);
    product.seller=document.getElementById('product_seller').value;
    product.company=document.getElementById('product_company').value;
    product.image=document.getElementById('product_image').value;

    products.push(product);

    start = (currentPage-1)*10;
    end = currentPage*10;
    paginate = filteredProducts.slice(start,end);
    display(paginate);

    toggleModal(false,'add_modal');

    localStorage.setItem("products",JSON.stringify(products));
}

// function to deleteProduct

let deleteId = null;
function deleteProduct(id)
{

    deleteId = id;
    toggleModal(true,'delete_modal')

}

// function to conform delete the product


function confirmation(status)
{
    
    if(status === true)
    {
        let productIndex = filteredProducts.findIndex(function(product,index){
            return product.id === deleteId;
        })
        filteredProducts.splice(productIndex,1);

        let mainProductIndex = products.findIndex(function(product,index){
            return product.id === deleteId;
        })
        products.splice(mainProductIndex,1);

        start = (currentPage-1)*10;
        end = currentPage*10;
        paginate = filteredProducts.slice(start,end);

        localStorage.setItem("products",JSON.stringify(products));
        filter();
        display(paginate);
    }

    toggleModal(false,'delete_modal')
}
