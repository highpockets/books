function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = (this) => {
        var readString;

        if(read === 'no'){
            readString = 'not read yet';
        }
        else{
            readString = 'already read';
        }
        return title + ' by ' + author + ', ' + String(pages) + ' pages, ' + readString;
    } 
}

let myLibrary = [];

const theHobbit = new Book('The Hobbit', 'J.R.R Tolkien', '295', true);

function addBookToLibrary(){
    let title = window.prompt('Enter the book title:');
    let author = window.prompt('Enter the author\'s name:');
    let pages = Number(window.prompt('Enter the number of pages:'));
    let read = window.prompt('Have you read this book?');
}

addBookToLibrary();
console.log(theHobbit.info());


