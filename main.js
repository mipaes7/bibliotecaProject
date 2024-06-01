//VARIABLES 
const cardsContainer = document.querySelector('.cardsContainer');
const detailCardsContainer = document.querySelector('.detailCardsContainer');
const fragmento = document.createDocumentFragment();
const detailSubtitulo = document.querySelector('.subtitulo');
const backBtnContainer = document.querySelector('.backBtnContainer');
const loader = document.getElementById('loader');
let lista;

//EVENTOS
document.addEventListener('click', ({target}) => {
    if (target.matches('.cardsContainer button')) {
        lista = target.value;
        limpiarComponentes(cardsContainer);
        getBooksInList(lista);
    }

    if (target.matches('.backBtnContainer button')) {
        limpiarComponentes(detailSubtitulo);
        limpiarComponentes(detailCardsContainer);
        limpiarComponentes(backBtnContainer);  
        getAllLists();
    }
});

//FUNCIONES
const getAllLists = async () => {
    loader.style.display = 'block';
    try {
        const resp = await fetch('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9');
        if (resp.ok) {
            const data = await resp.json();
            const arrayListsCards = data.results;
            pintarListCards(arrayListsCards);
            loader.style.display = 'none';
        } else {
            throw resp;
        }
    } catch (error) {
        loader.style.display = 'none';
        throw console.log(error.status);
    }
}

const getBooksInList = async () => {
    loader.style.display = 'block';
    try {
        const resp = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${lista}.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9`);
        if (resp.ok) {
            const data = await resp.json();
            const booksArray = data.results.books;
            pintarDetails(booksArray);
            loader.style.display = 'none';
        }
    } catch (error) {
        loader.style.display = 'none';
        throw console.log(error.status);
    }
}

const pintarListCards = (arrayListsCards) => {
    arrayListsCards.forEach(element => {
        const card = document.createElement('div');
        const cardH3 = document.createElement('h3');
        const paragraphs1 = document.createElement('p');
        const paragraphs2 = document.createElement('p');
        const paragraphs3 = document.createElement('p');
        const moreBtn = document.createElement('button');
        const separador = document.createElement('HR');
        card.classList.add('listCard');
        cardH3.textContent = element.list_name;
        paragraphs1.textContent = `Oldest: ${element.oldest_published_date}`;
        paragraphs2.textContent = `Newest: ${element.newest_published_date}`;
        paragraphs3.textContent = `Updated: ${element.updated}`;
        moreBtn.innerHTML = 'READ MORE <i class="fa-solid fa-angles-right"></i>';
        moreBtn.value = element.list_name;
        card.append(cardH3, separador, paragraphs1, paragraphs2, paragraphs3, moreBtn);
        fragmento.append(card);
    });
    cardsContainer.append(fragmento);
}

const pintarDetails = (booksArray) => {
    detailSubtitulo.textContent = lista;
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fa-solid fa-angles-left"></i> BACK TO LISTS';
    backBtnContainer.append(backBtn);
    window.scrollTo(0, 0);
    booksArray.forEach(element => {
        const detailCard = document.createElement('div');
        const detailCardH4 = document.createElement('h4');
        const separador = document.createElement('HR');
        const bookImg = document.createElement('img');
        const description = document.createElement('p');
        const weeksOnList = document.createElement('p');
        const buyAnchor = document.createElement('a');
        const buyLinkBtn = document.createElement('button');
        detailCard.classList.add('booksDetails');
        detailCardH4.textContent = `#${element.rank} ${element.title}`;
        bookImg.src = `${element.book_image}`;
        bookImg.alt = `${element.title}`;
        description.textContent = `${element.description}`;
        description.classList.add('description');
        weeksOnList.textContent = `Weeks on list: ${element.weeks_on_list}`;
        buyAnchor.href = `${element.amazon_product_url}`;
        buyAnchor.target = 'blank';
        buyLinkBtn.innerHTML = `<i class="fa-brands fa-amazon"></i><div><p>Available on</p><p><strong>amazon</strong>.com</p></div>`;
        buyAnchor.append(buyLinkBtn);
        detailCard.append(detailCardH4, separador, bookImg, weeksOnList, description, buyAnchor);
        fragmento.append(detailCard);
    });

    detailCardsContainer.append(fragmento);
}

const limpiarComponentes = (componente) => {
    componente.innerHTML = '';
};

//INVOCACIONES
getAllLists();

