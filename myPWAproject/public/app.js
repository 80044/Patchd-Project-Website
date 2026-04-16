function fetchClothes(filter = "", sort = "")
{
const url = new URL("/api/clothes", window.location.origin);
if (filter) {
url.searchParams.append('filter', filter);
 }
if (sort) {
url.searchParams.append('sort', sort);
}
fetch(url)
.then(response =>response.json())
.then(data =>{
displayClothes(data);
})
.catch(error =>console.error('Error fetching clothes:', error));
}   

///////////////
// SHOP PAGE //
///////////////
if (window.location.pathname.toLowerCase().includes('shop.html')) {
function displayClothes(clothesList) {
const clothesListSection = document.getElementById('clothes-list');
// Collection sorting //
const sortValue = document.getElementById('sort').value;
let currentCollection = '';
clothesListSection.innerHTML = '';
clothesList.forEach(clothing => {
if (sortValue === 'collection' && clothing.collection !== currentCollection) {
const collectionHeader = document.createElement('h2');
collectionHeader.className = 'collection-header';
collectionHeader.textContent = clothing.collection || 'Collection';
clothesListSection.appendChild(collectionHeader);
currentCollection = clothing.collection;
}


// creating element //
const clothingItem = document.createElement('div');
clothingItem.className = 'clothes-item';
clothingItem.innerHTML = `
<img src="${clothing.image}" alt="${clothing.name}">
<h2>${clothing.name}</h2>
<h4>${clothing.collection || ''}</h4>
<h4>${clothing.type}</h4>
<h3>$${clothing.price}</h3>
<button class="add-to-cart-btn" onclick="addToCart(${clothing.id})">Add to Cart</button>`;
clothesListSection.appendChild(clothingItem);
});
}
}

if (window.location.pathname.toLowerCase().includes('shop.html')) {
const urlParams = new URLSearchParams(window.location.search);
const sortParam = urlParams.get('sort');
const filterParam = urlParams.get('filter');
const filterInput = document.getElementById('filter');
const sortInput = document.getElementById('sort');

if (filterParam && filterInput) {
    filterInput.value = filterParam;
}

if (sortParam) {
    if (sortInput && [...sortInput.options].some(option => option.value === sortParam)) {
        sortInput.value = sortParam;
    }
}

filterInput.addEventListener('input',(e)=> {
    const filterText = e.target.value;
    fetchClothes(filterText, sortInput.value);
});

sortInput.addEventListener('change', (e)=> {
    const sortValue = e.target.value;
    fetchClothes(filterInput.value, sortValue);
});
}

///////////////
// HOME PAGE //
///////////////
if (window.location.pathname.toLowerCase().includes('home.html')) {
function displayClothes(featuredList) {
const clothesListSection = document.getElementsByClassName('FeaturedShowcase')[0];
clothesListSection.innerHTML = '';
const onlyFeatured = featuredList.filter(clothing => Number(clothing.featured) === 1 || clothing.featured === true);
onlyFeatured.forEach(clothing => {
const clothingItem = document.createElement('div');
clothingItem.className = 'FeaturedItem';
clothingItem.style.cursor = 'pointer';
clothingItem.onclick = () => {
    window.location.href = `Shop.html?filter=${encodeURIComponent(clothing.name)}`;
};
clothingItem.innerHTML = `
<img src="${clothing.image}" alt="${clothing.name}">
<h2>${clothing.name}</h2>
<h4>${clothing.type}</h4>
<h3>$${clothing.price}</h3>`;
clothesListSection.appendChild(clothingItem);
});
}
}

if (window.location.pathname.toLowerCase().includes('shop.html')) {
    fetchClothes(document.getElementById('filter').value, document.getElementById('sort').value);
} else {
    fetchClothes();
}