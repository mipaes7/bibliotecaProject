const firebaseConfig = {
    apiKey: "AIzaSyBwAep6wXKMmJGtlv4UtIHezDsMSwIlw8Y",
    authDomain: "bibliotecaproject-9ecf0.firebaseapp.com",
    projectId: "bibliotecaproject-9ecf0",
    storageBucket: "bibliotecaproject-9ecf0.appspot.com",
    messagingSenderId: "24467805200",
    appId: "1:24467805200:web:615669842bec090722e695"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
//VARIABLES 
const cardsContainer = document.querySelector('.cardsContainer');
const detailCardsContainer = document.querySelector('.detailCardsContainer');
const fragmento = document.createDocumentFragment();
const detailSubtitulo = document.querySelector('.subtitulo');
const backBtnContainer = document.querySelector('.backBtnContainer');
const loader = document.getElementById('loader');
const paginacionContainer = document.querySelector('.paginacion');
const categoryFilterForm = document.getElementById('categoryFilterForm');
const listsFiltersContainer = document.querySelector('.listsFiltersContainer');
const signUpForm = document.getElementById('signUpForm');
const loginForm = document.getElementById('loginForm');
const authContainer = document.querySelector('.authContainer');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const booksFiltersContainer = document.querySelector('.booksFiltersContainer');
const booksTitleFilterForm = document.getElementById('booksTitleFilter');
const booksAuthorFilterForm = document.getElementById('booksAuthorFilter');
const inputFiles = document.getElementById('files');
let category;
//variables auth
let isUserLogged;
let favBooksArr = [];
let favBooksArrTitle = [];
//variables para paginación
const listsPerPage = 20;
const booksPerPage = 5;
let currentPage = 1;
let arrayListsCardsToSlice;
let slicedListsArrGlobal;
let arrayBooksToSlice;
let slicedBooksArrGlobal;
//EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    getAllLists();
});

document.addEventListener('click', ({ target }) => {
    if (target.matches('.cardsContainer button')) {
        category = target.value;
        limpiarComponentes(cardsContainer);
        limpiarComponentes(paginacionContainer);
        listsFiltersContainer.classList.add('hide');
        paginacionContainer.classList.replace('paginacion', 'paginacionBooks');
        getBooksInList();
        currentPage = 1;
        window.scrollTo(0, 0);
    }

    if (target.matches('.backBtnContainer button')) {
        paginacionContainer.classList.replace('paginacionBooks', 'paginacion');
        limpiarComponentes(detailSubtitulo);
        limpiarComponentes(detailCardsContainer);
        limpiarComponentes(backBtnContainer);
        limpiarComponentes(paginacionContainer);
        listsFiltersContainer.classList.remove('hide');
        booksFiltersContainer.classList.add('hide');
        getAllLists();
        currentPage = 1;
        window.scrollTo(0, 0);
        readFavBooks(isUserLogged);
    }

    if (target.matches('.paginacion #pageBackBtn')) {
        backwardsPageLists();
    }

    if (target.matches('.paginacion #pageFwdBtn')) {
        forwardPageLists();
    }

    if (target.matches('.paginacionBooks #pageBackBtn')) {
        backwardsPageBooks();
        readFavBooks(isUserLogged);

    }

    if (target.matches('.paginacionBooks #pageFwdBtn')) {
        forwardPageBooks();
        readFavBooks(isUserLogged);

    }

    if (target.matches('.updateFilter #monthlyBtn, #weeklyBtn, #allBtn')) {
        filtro = target.value;
        currentPage = 1;
        updateFilter(filtro);
    }

    if (target.matches('.dateFilter, #newestBtn, #oldestBtn')) {
        value = target.value;
        currentPage = 1;
        dateFilter(value);
    }

    if (target.matches('.azFilter, #azBtn, #zaBtn')) {
        currentPage = 1;
        value = target.value;
        azFilter(value);
    }

    if (target.matches('.azFilterAuthor, #azBtnAuthor, #zaBtnAuthor')) {
        value = target.value;
        currentPage = 1;
        azFilterAuthor(value);
    }

    if (target.matches('.azFilterTitle, #azBtnTitle, #zaBtnTitle')) {
        value = target.value;
        currentPage = 1;
        azFilterTitle(value);
    }

    if (target.matches('.favoriteBtn, .favoriteBtn-active')) {
        const bookTitle = target.value;
        console.log(target);
        if (isUserLogged) {
            toggleFavoriteBook(bookTitle, target);
            // readFavBooks(isUserLogged);
        } else {
            authContainer.classList.add('show');
        }
    }

    if (target.matches('#signupBtn, #loginBtn')) {
        authContainer.classList.add('show');
    }

    if (target.matches('#closeFormBtn')) {
        authContainer.classList.remove('show');
    }

    if (target.matches('#gotoFavBtn')) {
        // readFavBooks(isUserLogged);
        currentPage = 1;
        limpiarComponentes(cardsContainer);
        limpiarComponentes(paginacionContainer);
        listsFiltersContainer.classList.add('hide');
        paginacionContainer.classList.replace('paginacion', 'paginacionBooks');
        pintarFavorites(favBooksArr);
        booksFiltersContainer.classList.add('hide');
    }

    if (target.matches('#changeImgBtn')) {
        document.querySelector('.filesInputContainer').classList.remove('hide');
        document.getElementById('userNavContainer').setAttribute('style', 'width:70%');
    }

    if (target.matches('#cancelChange')) {
        document.querySelector('.filesInputContainer').classList.add('hide');
        document.getElementById('userNavContainer').setAttribute('style', 'width:50%');
    }
});

inputFiles.addEventListener('change', (ev) => {
    uploadFile();
});

categoryFilterForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    currentPage = 1;
    const inputValue = document.getElementById('categoryInput').value;
    console.log(inputValue);
    if (inputValue === '') {
        pintarListCards(slicedListsArrGlobal);
    } else {
        categoryFilter(inputValue);
    }
    categoryFilterForm.reset();
});

booksAuthorFilterForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const inputValue = document.getElementById('authorInput').value;
    console.log(inputValue);
    if (inputValue === '') {
        pintarBooksDetails(slicedBooksArrGlobal);
    } else {
        authorFilter(inputValue);
    }
    booksAuthorFilterForm.reset();
});

booksTitleFilterForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const inputValue = document.getElementById('titleInput').value;
    if (inputValue === '') {
        pintarBooksDetails(slicedBooksArrGlobal);
    } else {
        titleFilter(inputValue);
    }
    booksTitleFilterForm.reset();
});

signUpForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let email = ev.target.elements.emailSignup.value;
    let pass = ev.target.elements.passSignup.value;
    let pass2 = ev.target.elements.passSignupRepeat.value;

    pass === pass2 ? signUpUser(email, pass) : alert("error password");
    authContainer.classList.remove('show');
});

loginForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let email = ev.target.elements.emailLogin.value;
    let pass = ev.target.elements.passLogin.value;
    signInUser(email, pass)
    authContainer.classList.remove('show');
});

document.getElementById("button-logout").addEventListener("click", () => {
    signOut();
});

//FUNCIONES
const getAllLists = async () => {
    loader.classList.remove('hide');
    try {
        const resp = await fetch('https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9');
        if (resp.ok) {
            const data = await resp.json();
            const arrayListsCards = data.results;
            arrayListsCardsToSlice = arrayListsCards;
            const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
            slicedListsArrGlobal = slicedListsArr;
            pintarListCards(slicedListsArr);
            loader.classList.add('hide');
        } else {
            throw resp;
        }
    } catch (error) {
        loader.classList.add('hide');
        throw console.log(error.status);
    }
}

const getBooksInList = async () => {
    loader.classList.remove('hide');
    try {
        const resp = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${category}.json?api-key=cbNK1zjsqawgJqF8fPjdI1sSjY8e7hg9`);
        if (resp.ok) {
            const data = await resp.json();
            const booksArray = data.results.books;
            arrayBooksToSlice = booksArray;
            const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
            slicedBooksArrGlobal = slicedBooksArr;
            // pintarBooksDetails(booksArray);
            pintarBooksDetails(slicedBooksArr);
            loader.classList.add('hide');
        }
    } catch (error) {
        loader.classList.add('hide');
        throw console.log(error.status);
    }
}

const pintarListCards = (arr) => {
    limpiarComponentes(cardsContainer);
    limpiarComponentes(paginacionContainer);
    const backBtn = document.createElement('button');
    const pageInfo = document.createElement('p');
    const forwardBtn = document.createElement('button');
    backBtn.textContent = `BACK`;
    backBtn.id = 'pageBackBtn';
    pageInfo.id = 'pageInfo';
    pageInfo.textContent = `PAGE ${currentPage} OF ${totalPages(arrayListsCardsToSlice, listsPerPage)}`;
    forwardBtn.textContent = `NEXT`;
    forwardBtn.id = 'pageFwdBtn';
    paginacionContainer.append(backBtn, pageInfo, forwardBtn);
    // const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
    toggleBtns(arrayListsCardsToSlice, listsPerPage, forwardBtn, backBtn);
    arr.forEach(element => {
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

const pintarBooksDetails = (arr) => {
    limpiarComponentes(detailCardsContainer);
    booksFiltersContainer.classList.remove('hide');
    limpiarComponentes(backBtnContainer);
    limpiarComponentes(paginacionContainer);
    const backPageBtn = document.createElement('button');
    const pageInfo = document.createElement('p');
    const forwardPageBtn = document.createElement('button');
    backPageBtn.textContent = `BACK`;
    backPageBtn.id = 'pageBackBtn';
    pageInfo.textContent = `PAGE ${currentPage} OF ${totalPages(arrayBooksToSlice, booksPerPage)}`;
    pageInfo.id = 'pageInfo';
    forwardPageBtn.textContent = `NEXT`;
    forwardPageBtn.id = 'pageFwdBtn';
    paginacionContainer.append(backPageBtn, pageInfo, forwardPageBtn);
    // const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
    toggleBtns(arrayBooksToSlice, booksPerPage, forwardPageBtn, backPageBtn);
    detailSubtitulo.textContent = category;
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fa-solid fa-angles-left"></i> BACK TO LISTS';
    backBtnContainer.append(backBtn);
    arr.forEach(element => {
        const detailCard = document.createElement('div');
        const detailCardH4 = document.createElement('h4');
        const separador = document.createElement('HR');
        const bookImg = document.createElement('img');
        const description = document.createElement('p');
        const weeksOnList = document.createElement('p');
        const buyAnchor = document.createElement('a');
        const buyLinkBtn = document.createElement('button');
        const favoriteBtn = document.createElement('button');
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
        if (favBooksArrTitle.includes(element.title)) {
            favoriteBtn.classList.add('favoriteBtn-active');
        } else {
            favoriteBtn.classList.remove('favoriteBtn-active');
            favoriteBtn.classList.add('favoriteBtn');
        }
        favoriteBtn.value = element.title;
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        buyAnchor.append(buyLinkBtn);
        detailCard.append(detailCardH4, separador, bookImg, weeksOnList, description, buyAnchor, favoriteBtn);
        fragmento.append(detailCard);
    });

    detailCardsContainer.append(fragmento);
}

const pintarFavorites = (arr) => {
    readFavBooks(isUserLogged);
    limpiarComponentes(detailCardsContainer);
    booksFiltersContainer.classList.remove('hide');
    limpiarComponentes(backBtnContainer);
    limpiarComponentes(paginacionContainer);
    const backPageBtn = document.createElement('button');
    const pageInfo = document.createElement('p');
    const forwardPageBtn = document.createElement('button');
    backPageBtn.textContent = `BACK`;
    backPageBtn.id = 'pageBackBtn';
    pageInfo.textContent = `PAGE ${currentPage} OF ${totalPages(arr, arr.length)}`;
    pageInfo.id = 'pageInfo';
    forwardPageBtn.textContent = `NEXT`;
    forwardPageBtn.id = 'pageFwdBtn';
    paginacionContainer.append(backPageBtn, pageInfo, forwardPageBtn);
    // const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
    toggleBtns(arr, arr.length, forwardPageBtn, backPageBtn);
    detailSubtitulo.textContent = category;
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fa-solid fa-angles-left"></i> BACK TO LISTS';
    backBtnContainer.append(backBtn);
    arr.forEach((element, index) => {
        const detailCard = document.createElement('div');
        const detailCardH4 = document.createElement('h4');
        const separador = document.createElement('HR');
        const bookImg = document.createElement('img');
        const description = document.createElement('p');
        const weeksOnList = document.createElement('p');
        const buyAnchor = document.createElement('a');
        const buyLinkBtn = document.createElement('button');
        const favoriteBtn = document.createElement('button');
        detailCard.classList.add('booksDetails');
        detailCardH4.textContent = `#${index + 1} ${element.title}`;
        bookImg.src = `${element.book_image}`;
        bookImg.alt = `${element.title}`;
        description.textContent = `${element.description}`;
        description.classList.add('description');
        weeksOnList.textContent = `Weeks on list: ${element.weeks_on_list}`;
        buyAnchor.href = `${element.amazon_product_url}`;
        buyAnchor.target = 'blank';
        buyLinkBtn.innerHTML = `<i class="fa-brands fa-amazon"></i><div><p>Available on</p><p><strong>amazon</strong>.com</p></div>`;
        console.log(favBooksArrTitle.includes(element.title));
        if (favBooksArrTitle.includes(element.title)) {
            favoriteBtn.classList.add('favoriteBtn-active');
        } else {
            favoriteBtn.classList.remove('favoriteBtn-active');
            favoriteBtn.classList.add('favoriteBtn');
        }
        favoriteBtn.value = element.title;
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        buyAnchor.append(buyLinkBtn);
        detailCard.append(detailCardH4, separador, bookImg, weeksOnList, description, buyAnchor, favoriteBtn);
        fragmento.append(detailCard);
    });

    detailCardsContainer.append(fragmento);
}

const limpiarComponentes = (componente) => {
    componente.innerHTML = '';
};

const forwardPageLists = () => {
    currentPage += 1;
    const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
    pintarListCards(slicedListsArr);
    // getAllLists();
}

const backwardsPageLists = () => {
    currentPage -= 1;
    const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
    pintarListCards(slicedListsArr);
    // getAllLists();
}
const forwardPageBooks = () => {
    currentPage += 1;
    // getBooksInList();
    const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
    pintarBooksDetails(slicedBooksArr);
}

const backwardsPageBooks = () => {
    currentPage -= 1;
    // getBooksInList();
    const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
    pintarBooksDetails(slicedBooksArr);
}

const sliceData = (arr, page = 1, items) => {
    const index1 = (currentPage - 1) * items;
    const index2 = index1 + items;
    return arr.slice(index1, index2);
}

const totalPages = (arr, items) => {
    return Math.ceil(arr.length / items);
}

const toggleBtns = (arr, items, buttonFwd, buttonBack) => {
    if (currentPage === 1) {
        buttonBack.setAttribute('disabled', true);
    } else {
        buttonBack.removeAttribute('disabled');
    }

    if (currentPage === totalPages(arr, items)) {
        buttonFwd.setAttribute('disabled', true)
    } else {
        buttonFwd.removeAttribute('disabled');
    }
}

const updateFilter = (value) => {
    // const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
    const filtered = arrayListsCardsToSlice.filter(element => element.updated === value);
    console.log(filtered);
    const slicedFiltered = sliceData(filtered, currentPage, filtered.length);
    if (value === 'ALL') {
        pintarListCards(slicedListsArrGlobal);
    }
    else {
        pintarListCards(slicedFiltered);
        toggleBtns(slicedFiltered, slicedFiltered.length, document.getElementById('pageFwdBtn'), document.getElementById('pageBackBtn'));
        document.getElementById('pageInfo').textContent = `PAGE ${currentPage} OF ${totalPages(slicedFiltered, slicedFiltered.length)}`;
    }
}

const dateFilter = (value) => {
    // const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
    let sortedData;
    if (value === 'NEWEST') {
        sortedData = sortByDateDesc(arrayListsCardsToSlice, 'newest_published_date');
    } else {
        sortedData = sortByDateAsc(arrayListsCardsToSlice, 'newest_published_date');
    }
    const slicedListsArr = sliceData(sortedData, currentPage, listsPerPage);
    pintarListCards(slicedListsArr);
}
// const dateFilter = (value) => {
//     // const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
//     const copia = [...slicedListsArrGlobal];
//     const sortedData = sortByDateAsc(copia, value === 'NEWEST' ? 'newest_published_date' : 'oldest_published_date');
//     pintarListCards(sortedData);
// }

const sortByDateDesc = (arr, key) => {
    return arr.sort((a, b) => {
        return new Date(b[key]) - new Date(a[key]);
    });
}

const sortByDateAsc = (arr, key) => {
    return arr.sort((a, b) => {
        return new Date(a[key]) - new Date(b[key]);
    });
}

const azFilter = (value) => {
    // const copia = [...arrayListsCardsToSlice];
    if (value === 'AZ') {
        arrayListsCardsToSlice.sort((a, b) => a.list_name.localeCompare(b.list_name));
    } else if (value === 'ZA') {
        arrayListsCardsToSlice.sort((a, b) => b.list_name.localeCompare(a.list_name));
    }
    const slicedListsArr = sliceData(arrayListsCardsToSlice, currentPage, listsPerPage);
    pintarListCards(slicedListsArr);
}

const azFilterAuthor = (value) => {
    if (value === 'AZ') {
        arrayBooksToSlice.sort((a, b) => a.author.localeCompare(b.author));
    } else if (value === 'ZA') {
        arrayBooksToSlice.sort((a, b) => b.author.localeCompare(a.author));
    }
    const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
    pintarBooksDetails(slicedBooksArr);
}

const azFilterTitle = (value) => {
    if (value === 'AZ') {
        arrayBooksToSlice.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === 'ZA') {
        arrayBooksToSlice.sort((a, b) => b.title.localeCompare(a.title));
    }
    const slicedBooksArr = sliceData(arrayBooksToSlice, currentPage, booksPerPage);
    pintarBooksDetails(slicedBooksArr);
}

const categoryFilter = (value) => {
    // const copia = [...arrayListsCardsToSlice];
    const filtered = arrayListsCardsToSlice.filter(element => element.list_name.toLowerCase().includes(value.toLowerCase()));
    if (filtered.length === 0) {
        alert('No such category found.')
        pintarListCards(slicedListsArrGlobal);
    } else {
        pintarListCards(filtered);
        toggleBtns(filtered, filtered.length, document.getElementById('pageFwdBtn'), document.getElementById('pageBackBtn'));
        document.getElementById('pageInfo').textContent = `PAGE ${currentPage} OF ${totalPages(filtered, filtered.length)}`;
    }
}
const authorFilter = (value) => {
    const copia = [...arrayBooksToSlice];
    const filtered = copia.filter(element => element.author.toLowerCase().includes(value.toLowerCase()));
    if (filtered.length === 0) {
        alert('No such author found in this category.')
        pintarBooksDetails(slicedBooksArrGlobal);
    } else {
        pintarBooksDetails(filtered);
        toggleBtns(filtered, filtered.length, document.getElementById('pageFwdBtn'), document.getElementById('pageBackBtn'));
        document.getElementById('pageInfo').textContent = `PAGE ${currentPage} OF ${totalPages(filtered, filtered.length)}`;
    }
}
const titleFilter = (value) => {
    const copia = [...arrayBooksToSlice];
    const filtered = copia.filter(element => element.title.toLowerCase().includes(value.toLowerCase()));
    if (filtered.length === 0) {
        alert('No such title found in this category.')
        pintarBooksDetails(slicedBooksArrGlobal);
    } else {
        pintarBooksDetails(filtered);
        toggleBtns(filtered, filtered.length, document.getElementById('pageFwdBtn'), document.getElementById('pageBackBtn'));
        document.getElementById('pageInfo').textContent = `PAGE ${currentPage} OF ${totalPages(filtered, filtered.length)}`;
    }
}

//FIREBASE
const signUpUser = (email, password) => {
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            let user = userCredential.user;
            console.log(`se ha registrado ${user.email} ID:${user.uid}`)
            alert(`se ha registrado ${user.email} ID:${user.uid}`)
            // ...
            // Saves user in firestore
            createUser({
                id: user.uid,
                email: user.email
            });

        })
        .catch((error) => {
            console.log("Error en el sistema" + error.message, "Error: " + error.code);
        });
};

const createUser = (user) => {
    db.collection("users")
        .doc(user.id)
        .set(user)
        .then(() => {
            console.log("Document written with ID: ", user.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
};

const toggleFavoriteBook = async (bookTitle, target) => {
    const userRef = db.collection('users').doc(isUserLogged.uid);
    const favoritesRef = userRef.collection('favorites');
    const book = favoritesRef.where('title', '==', bookTitle);

    try {
        const snapshot = await book.get();
        if (snapshot.empty) {
            const foundBook = arrayBooksToSlice.find(element => element.title === bookTitle);
            createBooks(foundBook);
            target.classList.remove('favoriteBtn');
            target.classList.add('favoriteBtn-active');
        } else {
            snapshot.forEach(doc => {
                doc.ref.delete();
                console.log(`${bookTitle} deleted from favorites`);
                alert(`${bookTitle} deleted from favorites`);
                readFavBooks(isUserLogged);
            });
            target.classList.remove('favoriteBtn-active');
            target.classList.add('favoriteBtn');
        }
    } catch (error) {
        console.error("Error toggling favorite book: ", error);
        alert("Failed to toggle favorite status for the book.");
    }
};

const createBooks = (foundBook) => {
    // let user = firebase.auth().currentUser;
    if (isUserLogged) {
        const userRef = db.collection('users').doc(isUserLogged.uid);
        userRef.collection('favorites')
            .add(foundBook)
            .then(docRef => {
                console.log("Favorite book added with ID: ", docRef.id);
                alert("Book added to favorites!");

            })
            .catch(error => {
                console.error("Error adding favorite book: ", error);
                alert("Failed to add book to favorites.");
            });
    } else {
        console.log("No user is logged in to add a favorite book.");
        alert("You need to be logged in to add favorites.");
    }
};

const readFavBooks = (user) => {
    const userRef = db.collection('users').doc(user.uid);
    const favoritesRef = userRef.collection('favorites');
    favoritesRef.get()
        .then((querySnapshot) => {
            favBooksArr = [];
            favBooksArrTitle = [];
            querySnapshot.forEach((doc) => {
                favBooksArrTitle.push(doc.data().title);
                favBooksArr.push(doc.data());
                console.log(favBooksArr);
            });
        })
        .catch(() => console.log('Error reading documents'));
};

const signInUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;
            console.log(`${user.email} is logged in ID:${user.uid}`)
            alert(`${user.email} is logged in ID:${user.uid}`)
            console.log("USER", user);
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
};

const signOut = () => {
    let user = firebase.auth().currentUser;

    firebase.auth().signOut().then(() => {
        console.log("Sale del sistema: " + user.email)
    }).catch((error) => {
        console.log("hubo un error: " + error);
    });
};

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(`Welcome, ${user.email}, you're logged in`);
        document.getElementById("message").innerText = `Welcome, ${user.email}, you're logged in`;
        document.getElementById('signupBtn').classList.add('hide');
        document.getElementById('loginBtn').classList.add('hide');
        document.getElementById('button-logout').classList.remove('hide');
        isUserLogged = firebase.auth().currentUser;
        readFavBooks(isUserLogged);
        setUserProfileImage(user.uid);
        getUserImages(user.uid);
        document.getElementById('gotoFavBtn').classList.remove('hide');
        document.getElementById('files').classList.remove('hide');
        document.getElementById('changeImgBtn').classList.remove('hide');
        document.getElementById('buttons-login-signup-container').classList.add('hide');
    } else {
        console.log("no hay usuarios en el sistema");
        document.getElementById("message").innerText = `Create an account or Log In`;
        document.getElementById('signupBtn').classList.remove('hide');
        document.getElementById('loginBtn').classList.remove('hide');
        document.getElementById('button-logout').classList.add('hide');
        document.getElementById('gotoFavBtn').classList.add('hide');
        document.getElementById('changeImgBtn').classList.add('hide');
        document.getElementById('buttons-login-signup-container').classList.remove('hide');
        isUserLogged = firebase.auth().currentUser;
        const profileImg = document.querySelector(".profileImg");
        profileImg.innerHTML = "";
    }
});

function uploadFile() {
    const file = document.getElementById("files").files[0];
    const user = firebase.auth().currentUser;

    if (user && file) {
        const storageRef = firebase.storage().ref();
        const userProfileRef = storageRef.child(`profileImages/${user.uid}/${file.name}`);

        db.collection('users').doc(user.uid).get().then(doc => {
            if (doc.exists && doc.data().profileImageUrl) {
                const oldImageUrl = doc.data().profileImageUrl;
                const oldImageRef = firebase.storage().refFromURL(oldImageUrl);
                oldImageRef.delete().then(() => {
                    console.log("Old image deleted successfully.");
                }).catch(error => {
                    console.error("Failed to delete old image:", error);
                });
            }

            userProfileRef.put(file).then(snapshot => {
                return userProfileRef.getDownloadURL();
            }).then(url => {
                db.collection('users').doc(user.uid).update({
                    profileImageUrl: url
                }).then(() => {
                    console.log("Profile image updated.");
                    document.querySelector(".profileImg").src = url;  // Update the image displayed in the UI
                    alert("File Uploaded and Profile Updated");
                }).catch(error => console.error("Error updating user profile image: ", error));
            }).catch(error => {
                console.error('Upload failed:', error);
                alert("Failed to upload file.");
            });
        }).catch(error => {
            console.error("Error retrieving user data:", error);
        });
    } else {
        alert("No file selected or user not logged in.");
    }
}

function displayImage(imageRef) {
    imageRef.getDownloadURL().then(function (url) {
        const imagesContainer = document.querySelector(".profileImg");
        imagesContainer.innerHTML = '';
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.width = 150;
        imgElement.height = 200;
        imagesContainer.appendChild(imgElement);
    }).catch(function (error) {
        console.error("Error fetching image URL: ", error);
    });
}

function getUserImages(userId) {
    const userImagesRef = firebase.storage().ref(`/profileImages/${userId}`);

    userImagesRef.listAll().then(function (result) {
        result.items.forEach(function (imageRef) {
            // Display the image in the UI
            displayImage(imageRef);
        });
    }).catch(function (error) {
        console.error("Error listing user images: ", error);
    });
}

function setUserProfileImage(userId) {
    db.collection('users').doc(userId).get().then(doc => {
        const profileImg = document.querySelector(".profileImg"); // Make sure this is the correct selector for your image container
        if (doc.exists && doc.data().profileImageUrl) {
            profileImg.src = doc.data().profileImageUrl;
        } else {
            console.log("No profile image found.");
            profileImg.src = ""; // Optionally set to a default image or clear the existing image
        }
    }).catch(error => {
        console.error("Error retrieving user data:", error);
    });
}

//INVOCACIONES
// getAllLists();
