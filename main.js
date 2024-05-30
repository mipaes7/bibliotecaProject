//VARIABLES 
const cardsContainer = document.querySelector('.cardsContainer');
const detailCardsContainer = document.querySelector('.detailCardsContainer');
const fragmento = document.createDocumentFragment();
const baseUrl = fetch('https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9');

//EVENTOS


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
        const resp = await fetch('https://api.nytimes.com/svc/books/v3/lists/full-overview.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9');
        if (resp.ok) {
            const data = await resp.json();
            console.log(data.results.lists);
        }
    } catch (error) {
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
        cardH3.textContent = element.list_name;
        paragraphs1.textContent = `${element.oldest_published_date}`;
        paragraphs2.textContent = `${element.newest_published_date}`;
        paragraphs3.textContent = `${element.updated}`;
        moreBtn.textContent = 'READ MORE!';
        card.append(cardH3, paragraphs1, paragraphs2, paragraphs3, moreBtn);
        fragmento.append(card);
    });
    cardsContainer.append(fragmento);
}


//INVOCACIONES
getAllLists();
getBooksInList();

