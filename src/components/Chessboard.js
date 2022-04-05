import React from "react";
import { useRef ,useState } from "react";
import {Piece ,verticalAxis ,horizontalAxis} from "../helper"

import Referee from "../refree/Referee";

import "./Chessboard.css";

import Tile from "./Tiles/Tile" ;


// const pieces = [] ;
 
const initialBoardState = [] ;

for(let i=0 ;i<2 ;i++) {
  const type = (i === 0) ? 'b' : 'w' ;
  let y = (i === 0) ? 7 : 0 ;
  

  initialBoardState.push({image : `assets/images/rook_${type}.png` ,x : 0 ,y : y ,type : "rook" ,team : i})
  initialBoardState.push({image : `assets/images/rook_${type}.png` ,x : 7 ,y : y ,type : "rook" ,team : i})
  initialBoardState.push({image : `assets/images/knight_${type}.png` ,x : 1 ,y : y ,type : "knight" ,team : i})
  initialBoardState.push({image : `assets/images/knight_${type}.png` ,x : 6 ,y : y ,type : "knight" ,team : i})
  initialBoardState.push({image : `assets/images/bishop_${type}.png` ,x : 2 ,y : y ,type : "bishop" ,team : i})
  initialBoardState.push({image : `assets/images/bishop_${type}.png` ,x : 5 ,y : y ,type : "bishop" ,team : i})
  initialBoardState.push({image : `assets/images/queen_${type}.png` ,x : 3 ,y : y ,type : "queen" ,team : i})
  initialBoardState.push({image : `assets/images/king_${type}.png` ,x : 4 ,y : y ,type : "king" ,team : i})

  y = (i === 0) ? 6 : 1 ;
  for(let j=0 ;j<8 ;j++) {
    initialBoardState.push({image : `assets/images/pawn_${type}.png` ,x : j ,y : y ,type : "pawn" ,team : i})
  }
}


let turn = true ;
export default function Chessboard() {
  
  let board = [];
  const chessboardRef = useRef(null);

  const referee = new Referee() ;
  
  // let activePiece = null;

  
  console.log("turn- " ,turn)

  const [activePiece, setActivePiece] = useState(null) ;
  const [pieces, setPieces] = useState(initialBoardState) ;
  const [gridX, setGridX] = useState(0) ;
  const [gridY, setGridY] = useState(0) ;
  
  // useEffect(() => {
  // }, []) ;


  function grabPiece(e) {
    // console.log(e.target)

    const element = e.target ;
    const chessboard = chessboardRef.current;
    if(element.classList.contains("chess-piece")  &&  chessboard) {
      // console.log(e.target)

      const curX = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const curY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));
      setGridX(curX) ;
      setGridY(curY) ;

      const x = e.clientX - 50 ;
      const y = e.clientY - 50 ;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      // activePiece = element ;
      setActivePiece(element) ;
    }
  }

  function movePiece(e) {
  // console.log(e.target)

    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      //If x is smaller than minimum amount
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      }
      //If x is bigger than maximum amount
      else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      }
      //If x is in the constraints
      else {
        activePiece.style.left = `${x}px`;
      }

      //If y is smaller than minimum amount
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      }
      //If y is bigger than maximum amount
      else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      }
      //If y is in the constraints
      else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e) {
    const chessboard = chessboardRef.current;
    if(activePiece  &&  chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

      console.log(x ,y) ;

      // removing the attacked pieces
      const currentPiece = pieces.find(p => p.x === gridX  &&  p.y === gridY) ;

      const isValidTurn = ((turn ? 1 : 0) === currentPiece.team) ;
      console.log("** " ,isValidTurn ,turn ,currentPiece.team)

      if(currentPiece) {
        const isValid = referee.isValidMove(gridX ,gridY ,x ,y ,currentPiece.type ,currentPiece.team ,pieces) ;
        // console.log("--> " ,x ,y)

        const isEnPassantMove = referee.isEnPassantMove(gridX ,gridY ,x ,y ,currentPiece.type ,currentPiece.team ,pieces) ;
        const pawnDirection = (currentPiece.team === 1) ? 1 : -1 ;
        console.log("enpass : ",isEnPassantMove)
        if(isEnPassantMove  &&  isValidTurn) {
          console.log("Entered into enpass")
          const updatedPieces = pieces.reduce((results ,piece) => {
            // console.log(piece.x ,piece.y)
            
            if(piece.x === gridX  &&  piece.y === gridY) {
              piece.isEnPassant = false ;
              piece.x = x ;
              piece.y = y ;
              results.push(piece) ;
              console.log("curr added enp") ;
            }else if(!(piece.x === x  &&  piece.y === y - pawnDirection)) {
              results.push(piece) ;
              // if(piece.type === "pawn") {
              //   piece.isEnPassant = false ;
              // }
            }else {
              console.log("removed attacked enp") ;
            }

            return results;
          } ,[] ) ;
          turn = !turn ;
          setPieces(updatedPieces) ;
        }else if(isValid  &&  isValidTurn) {
          const updatedPieces = pieces.reduce((results ,piece) => {
            // console.log(piece.x ,piece.y)
            if(piece.x === gridX  &&  piece.y === gridY) {
              piece.x = x ;
              piece.y = y ;
              results.push(piece) ;
              console.log("curr added") ;

              if((Math.abs(gridY - y) === 2)  &&  piece.type === "pawn") {
                piece.isEnPassant = true ;
                console.log("enpassant set " ,piece.isEnPassant) ;
              }else {
                piece.isEnPassant = false ;
              }
            }else if(!(piece.x === x  &&  piece.y === y)) {
              results.push(piece) ;
              // if(piece.type === "pawn") {
              //   piece.isEnPassant = false ;
              // }
            }else {
              console.log("removed attacked one") ;
            }

            return results;
          } ,[] ) ;
          turn = !turn ;
          setPieces(updatedPieces) ;

          // Two types of setPieces : 
          // (i)  setPieces(updatedPieces) ;
          // (ii)setPieces((value) => { }) ;
               
        }
      }

      // updation of the board pieces
      setPieces((value) => {
        const pieces = value.map((p) => {
          if(p.x == gridX  &&  p.y == gridY) {
            const isValid = referee.isValidMove(gridX ,gridY ,x ,y ,p.type ,p.team ,value) ;
            if(isValid  &&  isValidTurn) {
              p.x = x ;
              p.y = y ;
            }else {
              activePiece.style.position = 'relative' ;
              activePiece.style.removeProperty('top') ;
              activePiece.style.removeProperty('left') ;
              
            }

            
          }
          return p ;
        }) ;
        return pieces ;
      }) ;
      console.log("= ",x ,y)
      if(referee.isCheck(pieces)) {
        console.log("CHECK")
        alert("It's a Check.. ")
      }
      if(!referee.canKingMove((turn == true ? 0 : 1) ,pieces)) {
        console.warn("King can't move")
        if(referee.isCheck(pieces)) {
            console.log("CHECK")
            alert("GAME OVER !! \nIt's a Check & Mate ")
        }else {
            alert("GAME OVER !! \nIt's a Steal & Mate ")
        }
      }

      
      
      // activePiece = null ;
      setActivePiece(null) ;
    }
  }


  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + 2;
        
        const piece = pieces.find( (p) => p.x === i  &&  p.y === j) ;
        let pic = piece ? piece.image : undefined ;
        
        board.push(<Tile key={`${i},${j}`} number={number} image={pic} />) ;

    }
  }

  return <div 
  onMouseDown={e => grabPiece(e) } 
  onMouseUp={e => dropPiece(e)} 
  onMouseMove={e => movePiece(e)}
  ref={chessboardRef}
  id="chessboard">{board}</div>;
}
