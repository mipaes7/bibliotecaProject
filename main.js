//VARIABLES 
const cardsContainer = document.querySelector('.cardsContainer');
const detailCardsContainer = document.querySelector('.detailCardsContainer');
const fragmento = document.createDocumentFragment();
const detailSubtitulo = document.querySelector('.subtitulo');
const backBtnContainer = document.querySelector('.backBtnContainer');
let lista;
let arr = [];

//EVENTOS
document.addEventListener('click', ({target}) => {
    if (target.matches('.cardsContainer button')) {
        lista = target.value;
        limpiarComponentes(cardsContainer);
        getBooksInList(lista);
        limpiarComponentes(backBtnContainer);
    }

    if (target.matches('.backBtnContainer button')) {
        limpiarComponentes(detailSubtitulo);
        limpiarComponentes(detailCardsContainer);
        limpiarComponentes(backBtnContainer);  
        pintarListCards(arr);
    }
})

//FUNCIONES
const getAllLists = async () => {
    try {
        const resp = await fetch('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9');
        if (resp.ok) {
            const data = await resp.json();
            const arrayListsCards = data.results;
            pintarListCards(arrayListsCards);
        } else {
            throw resp;
        }
    } catch (error) {
        throw console.log(error.status);
    }
}

const getBooksInList = async () => {
    try {
        const resp = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${lista}.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9`);
        if (resp.ok) {
            const data = await resp.json();
            console.log(data.results.display_name);
            console.log(data.results.books);
            const booksArray = data.results.books;
            pintarDetails(booksArray);
        }
    } catch (error) {
        throw console.log(error.status);
    }
}

const pintarListCards = (arrayListsCards) => {
    arrayListsCards.forEach(element => {
        arr.push(element);
        const card = document.createElement('div');
        const cardH3 = document.createElement('h3');
        const paragraphs1 = document.createElement('p');
        const paragraphs2 = document.createElement('p');
        const paragraphs3 = document.createElement('p');
        const moreBtn = document.createElement('button');
        cardH3.textContent = element.list_name;
        paragraphs1.textContent = `${element.oldest_published_date}`;
        paragraphs2.textContent = `${element.newest_published_date}`;
        paragraphs3.textContent = `${element.updated}`;
        moreBtn.textContent = 'READ MORE!';
        moreBtn.value = element.list_name;
        card.append(cardH3, paragraphs1, paragraphs2, paragraphs3, moreBtn);
        fragmento.append(card);
    });
    cardsContainer.append(fragmento);
}

const pintarDetails = (booksArray) => {
    cardsContainer.innerHTML = '';
    detailSubtitulo.textContent = lista;
    const backBtn = document.createElement('button');
    backBtn.textContent = 'BACK TO LISTS';
    backBtnContainer.append(backBtn);
    window.scrollTo(0, 0);
    booksArray.forEach(element => {
        const detailCard = document.createElement('div');
        const detailCardH4 = document.createElement('h4');
        const bookImg = document.createElement('img');
        const description = document.createElement('p');
        const weeksOnList = document.createElement('p');
        const buyAnchor = document.createElement('a');
        const buyLinkBtn = document.createElement('button');
        detailCardH4.textContent = `#${element.rank} ${element.title}`;
        bookImg.src = `${element.book_image}`;
        bookImg.alt = `${element.title}`;
        description.textContent = `${element.description}`;
        weeksOnList.textContent = `Weeks on list: ${element.weeks_on_list}`;
        buyAnchor.href = `${element.amazon_product_url}`;
        buyAnchor.target = 'blank';
        buyLinkBtn.textContent = `BUY AT AMAZON`;
        buyAnchor.append(buyLinkBtn);
        detailCard.append(detailCardH4, bookImg, weeksOnList, description, buyAnchor);
        fragmento.append(detailCard);
    });

    detailCardsContainer.append(fragmento);
}

const limpiarComponentes = (componente) => {
    componente.innerHTML = '';
};

//INVOCACIONES
getAllLists();

