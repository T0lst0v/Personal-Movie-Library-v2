import React from "react";
import "./cards.css";

class Card extends React.Component {
  render() {
    console.log(this.props.books);
    // console.log(this.props.children);

    return (
      <div className="cardList">
        {this.props.books.map((book, index) => {
          return (
            <div className="card" key={index}>
              <img className="bookCover" src={"https://raw.githubusercontent.com/benoitvallon/100-best-books/master/static/" + book.imageLink} alt="" />
              <p className="bookTitle">{book.title}</p>
              <p className="bookAuthor"> {book.author}</p>
              <p className="bookYear">{book.year} year</p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Card;
