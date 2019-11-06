// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDR8RVJAXoXesEIwIwKYb-Uq9xd9Nlurfc",
    authDomain: "library-bcc3f.firebaseapp.com",
    databaseURL: "https://library-bcc3f.firebaseio.com",
    projectId: "library-bcc3f",
    storageBucket: "library-bcc3f.appspot.com",
    messagingSenderId: "551416438655",
    appId: "1:551416438655:web:f2fdb3d58f9d1ab1cf844a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

let myLibrary = [];

queryBooks('initialize');

function queryBooks(action, title = null, author = null, read = null){
    //populate library if there are books
    var dbRef = database.ref().child('books/').orderByValue();
    dbRef.once("value", snap => {
        snap.forEach(function(childSnapshot){

            let snapVal = childSnapshot.val();

            if(action === 'initialize'){
                let book = new Book(snapVal.title, snapVal.author, snapVal.pages, snapVal.read);
                myLibrary.push(book);
                render(book);
            }
            else if(title === snapVal.title && author === snapVal.author){
                if(action === 'remove'){
                    childSnapshot.getRef().remove();
                }
                else if(action === 'update'){
                    var updates = {};
                    updates['read/'] = read;
                    childSnapshot.getRef().update(updates);
                }
            }
        });
    });
}

function Book(title, author, pages, read){

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = () => {
        return title + ' by ' + author + ', ' + String(pages) + ' pages, ' + read;
    }
}

function addBookToLibrary(){

    let title = window.prompt('Enter the book title:');
    let author = window.prompt('Enter the author\'s name:');

    myLibrary.forEach(book => {
        if(title === book.title && author === book.author){
            alert('That book already exists in this library');
            return;
        }
    });

    if(title === undefined || author === undefined){
        alert('You need to enter a valid title and author for the book');
        return;
    }

    let pages = Number(window.prompt('Enter the number of pages:'));

    if(pages < 1){
        alert('You need to enter a valid number of pages for the book');
        return;
    }

    let read = window.prompt('Have you read this book? write "yes" if you have read it and "no" if you have not read it.');
    read.trim();
    read.toLowerCase();

    if(read != 'yes' && read != 'no'){
        alert('You can only respond with "yes" or "no"');
        return;
    }

    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
    render(book);

    database.ref('books/' + title).set({
        title: title,
        author: author,
        pages: pages,
        read: read
    });
}

function render(book){

    let table = document.getElementById('book-table');
    let row = table.insertRow();
    let titleCell = row.insertCell();
    let authorCell = row.insertCell();
    let pagesCell = row.insertCell();
    let readCell = row.insertCell();
    let deleteCell = row.insertCell();

    titleCell.innerHTML = book.title;
    authorCell.innerHTML = book.author;
    pagesCell.innerHTML = book.pages;
    readCell.innerHTML = `<select id="read-${book.title}-${book.author}" onchange="readChange(this)"><option value="yes">Already Read</option><option value="no">Not Read</option></select>`;
    deleteCell.innerHTML = '<button id="delete-book" onclick="deleteBook(this)">Delete</button>';
    var readElement = document.getElementById(`read-${book.title}-${book.author}`);
    readElement.value = book.read;
}

function readChange(id){
    let title = id.parentElement.parentElement.cells[0].innerHTML;
    let author = id.parentElement.parentElement.cells[1].innerHTML;
    queryBooks('update', title, author, id.value);
}

function deleteBook(id){
    let row = id.parentElement.parentElement;
    let title = row.cells[0].innerHTML;
    let author = row.cells[1].innerHTML;
    row.parentElement.removeChild(row);

    for(i = 0; i < myLibrary.length; i++){
        if(myLibrary[i].title === title && myLibrary[i].author === author){
            myLibrary.splice(i, 1);
            break;
        }
    }

    if(title != null){
        queryBooks('remove', title, author);
    }
}