export default class Referee {
  isTileOccupied(x, y, boardState) {
    // console.log("checking if tile is occupied !!");
    const piece = boardState.find((p) => p.x === x && p.y === y);
    if (piece) return true;
    return false;
  }

  isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team) {
    return !(this.isTileOccupied(x ,y ,boardState)  &&  !this.isTileOccupiedByEnemy(x, y, boardState, team));
  }

  isTileOccupiedByEnemy(x, y, boardState, team) {
    // console.log("checking if tile can be attacked !!");
    const piece = boardState.find(
      (p) => p.x === x && p.y === y && p.team != team
    );
    if (piece) return true;
    return false;
  }

  isEnPassantMove(px, py, x, y, type, team, boardState) {
    const pawnDirection = team === 1 ? 1 : -1;
    // console.log("entered enpass function")

    if (type === "pawn") {
      if (((x - px === -1  ||  x - px === 1)) && y - py === pawnDirection) {
        const piece = boardState.find(
          (p) =>
            p.x === x  &&  p.y === y - pawnDirection  &&  p.isEnPassant
        );
        if (piece) {
            return true;
        } 
      }
    }

    return false;
  }

  isCheck(boardState) {

    const king_w = boardState.find( p => p.type === "king"  &&  p.team === 1) ;
    const king_b = boardState.find( p => p.type === "king"  &&  p.team === 0) ;
    console.log("} " ,king_w.x ,king_w.y ,king_b.x ,king_b.y ,this.pawnMove(6 ,3 ,5 ,2 ,0 ,boardState))
    let ans = false ,temp = false ;
    boardState.forEach(p => {
        if(p.team === 0) {
            temp = false ;
            // console.log(p.x ,p.y ,p.type ,p.team)
            if(p.type === "pawn") {
                temp = this.pawnMove(p.x ,p.y ,king_w.x ,king_w.y ,0 ,boardState) ;
            }else if(p.type === "rook") {
                temp = this.rookMove(p.x ,p.y ,king_w.x ,king_w.y ,0 ,boardState) ;
            }else if(p.type === "knight") {
                temp = this.knightMove(p.x ,p.y ,king_w.x ,king_w.y ,0 ,boardState) ;
            }else if(p.type === "bishop") {
                temp = this.bishopMove(p.x ,p.y ,king_w.x ,king_w.y ,0 ,boardState) ;
            }else if(p.type === "king") {
                temp = this.kingMove(p.x ,p.y ,king_w.x ,king_w.y ,0 ,boardState) ;
            }else if(p.type === "queen") {
                temp = this.queenMove(p.x ,p.y ,king_w.x ,king_w.y ,0 ,boardState) ;
            }
        }else if(p.team === 1) {
            // console.log(p.x ,p.y ,p.type ,p.team)
            temp = false ;
            if(p.type === "pawn") {
                temp = this.pawnMove(p.x ,p.y ,king_b.x ,king_b.y ,1 ,boardState) ;
            }else if(p.type === "rook") {
                temp = this.rookMove(p.x ,p.y ,king_b.x ,king_b.y ,1 ,boardState) ;
            }else if(p.type === "knight") {
                temp = this.knightMove(p.x ,p.y ,king_b.x ,king_b.y ,1 ,boardState) ;
            }else if(p.type === "bishop") {
                temp = this.bishopMove(p.x ,p.y ,king_b.x ,king_b.y ,1 ,boardState) ;
            }else if(p.type === "king") {
                temp = this.kingMove(p.x ,p.y ,king_b.x ,king_b.y ,1 ,boardState) ;
            }else if(p.type === "queen") {
                temp = this.queenMove(p.x ,p.y ,king_b.x ,king_b.y ,1 ,boardState) ;
            }        
        }if(temp) {
              console.log(p.type ,p.x ,p.y)
        }
        ans |= temp ;
    });
    console.log("==> " ,ans)
    return ans ;
  }

  pawnMove(px ,py ,x ,y ,team ,boardState) {

    const specialRow = team === 1 ? 1 : 6;
    const pawnDirection = team === 1 ? 1 : -1;

      // Movement Logic
      if (px === x && py === specialRow && y - py === 2 * pawnDirection) {
        if (
          !this.isTileOccupied(x, y, boardState) &&
          !this.isTileOccupied(x, y - pawnDirection, boardState)
        ) {
          return true;
        }
      } else if (px === x && y - py === pawnDirection) {
        if (!this.isTileOccupied(x, y, boardState)) {
          return true;
        }
      }
      // Attacking Logic
      else if (x - px === -1 && y - py === pawnDirection) {
        if (this.isTileOccupiedByEnemy(x, y, boardState, team)) {
          console.log("attack on left !!");
          return true;
        }
      } else if (x - px === 1 && y - py === pawnDirection) {
        if (this.isTileOccupiedByEnemy(x, y, boardState, team)) {
          console.log("attack on right !!");
          return true;
        }
      }

    return false ;
  }

  knightMove(px ,py ,x ,y ,team ,boardState) {
    for(let i=-1 ;i<2 ;i+=2) {
        for(let j=-1 ;j<2 ;j+=2) {
            if(y - py === 2*i) {
                if(x - px === j) {
                    if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                        return true ;
                    }
                }
            }if(x - px === 2*i) {
                if(y - py === j) {
                    if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                        return true ;
                    }
                }
            }
        }
    }
    return false ;
  }
 
  bishopMove(px ,py ,x ,y ,team ,boardState) {
    for(let i=1 ;i<8 ;i++) {

        if(x - px === i  &&  y - py === i) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(x > px  &&  y > py) {
            if(this.isTileOccupied(px+i ,py+i ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        if(x - px === i  &&  y - py === -i) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(x > px  &&  y < py) {
            if(this.isTileOccupied(px+i ,py-i ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        if(x - px === -i  &&  y - py === i) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(x < px  &&  y > py) {
            if(this.isTileOccupied(px-i,py+i ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        if(x - px === -i  &&  y - py === -i) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(x < px  &&  y < py) {
            if(this.isTileOccupied(px-i ,py-i ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
    }
    return false;
  }

  rookMove(px ,py ,x ,y ,team ,boardState) {

    for(let i=1 ;i<8 ;i++) {
        if(x - px === i  &&  y === py) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(x > px  &&  y === py) {
            if(this.isTileOccupied(px+i ,py ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        if(x - px === -i  &&  y === py) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(x < px  &&  y === py) {
            if(this.isTileOccupied(px-i ,py ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        if(y - py === i  &&  x === px) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(y > py  &&  x === px) {
            if(this.isTileOccupied(px ,py+i ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        if(y - py === -i  &&  x === px) {
            if(this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
                return true ;
            }
        }if(y < py  &&  x === px) {
            if(this.isTileOccupied(px ,py-i ,boardState)) {
                // console.log("illegal") ;
                break ;
            }
        }
        
    }
    return false ;
  }

  queenMove(px ,py ,x ,y ,team ,boardState) {
    if(px === x  ||  py === y) {
        return this.rookMove(px ,py ,x ,y ,team ,boardState) ;
    }else {
        return this.bishopMove(px ,py ,x ,y ,team ,boardState) ;
    }
  }

  kingMove(px ,py ,x ,y ,team ,boardState) {
    if(Math.abs(x - px) < 2  &&  Math.abs(y - py) < 2) {
        return true ;
    }
    return false ;
  }
 
  canKingMove(team ,boardState) {
    const king = boardState.find( p => p.type === "king"  &&  p.team === team) ;
    let ans = false ;
    if(king) {
        ans |= this.isKingSafeHelper(king.x+1 ,king.y+1 ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x+1 ,king.y ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x+1 ,king.y-1 ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x ,king.y+1 ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x ,king.y-1 ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x-1 ,king.y+1 ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x-1 ,king.y ,!king.team ,boardState) ;console.log(ans)
        ans |= this.isKingSafeHelper(king.x-1 ,king.y-1 ,!king.team ,boardState) ;console.log(ans)
    }
    // ans = false; 
    console.log(":- " ,ans ,king.x ,king.y) ;
    return ans ;
  }

  isKingSafeHelper(x ,y ,team ,boardState) {
      if(x < 0  ||  x > 7  ||  y < 0  ||  y > 7) {
          return false ;
      }if(!this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team)) {
          return false ;
      }
      return this.isKingSafe(x ,y ,!team ,boardState) ;
  }

  isKingSafe(x ,y ,team ,boardState) {
    let temp = true ,ans = true
    const pieceDirection = (team === 1) ?  1 : -1 ;
    boardState.forEach(p => {
        // console.log(p.type ,team ,p.team) ;
        temp = true ;
        if(p.type === "pawn"  &&  p.team === (team+1)%2) {
            if(p.x === x-1  &&  p.y === y+pieceDirection) temp = false;
            if(p.x === x+1  &&  p.y === y+pieceDirection) temp = false;
        }else if(p.type === "knight"  &&  p.team === (team+1)%2) {
            if(p.x === x+2  &&  p.y === y+1 ) temp = false;
            if(p.x === x+2  &&  p.y === y-1 ) temp = false;
            if(p.x === x-2  &&  p.y === y+1 ) temp = false;
            if(p.x === x-2  &&  p.y === y-1 ) temp = false;
            if(p.x === x+1  &&  p.y === y+2 ) temp = false;
            if(p.x === x-1  &&  p.y === y+2 ) temp = false;
            if(p.x === x+1  &&  p.y === y-2 ) temp = false;
            if(p.x === x-1  &&  p.y === y-2 ) temp = false;
        }else if(p.type === "bishop"  &&  p.team === (team+1)%2) {
            temp = !this.bishopMove(p.x ,p.y ,x ,y ,team ,boardState);
        }else if(p.type === "rook"  &&  p.team === (team+1)%2) {
            temp = !this.rookMove(p.x ,p.y ,x ,y ,team ,boardState);
        }else if(p.type === "queen"  &&  p.team === (team+1)%2) {
            temp = !this.queenMove(p.x ,p.y ,x ,y ,team ,boardState);
        }else if(p.type === "king"  &&  p.team === (team+1)%2) {
            if(p.x === x  &&  p.y === y+1 ) temp = false;
            if(p.x === x  &&  p.y === y-1 ) temp = false;
            if(p.x === x-1  &&  p.y === y+1 ) temp = false;
            if(p.x === x-1  &&  p.y === y ) temp = false;
            if(p.x === x-1  &&  p.y === y-1 ) temp = false;
            if(p.x === x+1  &&  p.y === y+1 ) temp = false;
            if(p.x === x+1  &&  p.y === y ) temp = false;
            if(p.x === x+1  &&  p.y === y-1 ) temp = false;
        }
        ans &= temp ;
        if(!temp)  console.log(p.type ,p.x ,p.y ,p.team ,team)
    });
    console.log("\\\ -- ",ans)
    return ans ;
    
  }

  isValidMoveForKing(px ,py ,x ,y ,team ,type ,boardState) {
    if(x < 0  ||  x > 7  ||  y < 0  ||  y > 7) {
        return false ;
    }if(px === x  &&  py === y) {
        return true ;
    } 
    return this.isValidMove(px, py, x, y, type, team, boardState) ; 
  }
  

  isValidMove(px, py, x, y, type, team, boardState) {

    const specialRow = team === 1 ? 1 : 6;
    const pawnDirection = team === 1 ? 1 : -1;

    if (type === "pawn") {
      return this.pawnMove(px ,py ,x ,y ,team ,boardState) ;
    }else if(type === "knight") {
        console.log("Knight moves") ;
        return this.knightMove(px ,py ,x ,y ,team ,boardState) ;
    }else if(type === "bishop") {
        console.log("bishop moves !!") ;
        return this.bishopMove(px ,py ,x ,y ,team ,boardState) ; 
    }else if(type === "rook") {
        console.log("rook moves") ;
        return this.rookMove(px ,py ,x ,y ,team ,boardState) ;
    }else if(type === "king") {
        console.log("king moves")

        // For safe move
        if(Math.abs(x - px) < 2  &&  Math.abs(y - py) < 2) {
            console.log(" King is moving..")
            if(this.isKingSafe(x ,y ,team ,boardState)) {
                console.warn("--> King is safe here")
                return this.isTileEmptyOrOccupiedByEnemy(x ,y ,boardState ,team) ;
            }else {
                console.warn("King is not safe here")
            }
            
        }
    }else if(type === "queen") {
        console.log("queen moves") ;

        return this.queenMove(px ,py ,x ,y ,team ,boardState) ; 
    }

    console.log("invalid move");
    return false;
  }
}
