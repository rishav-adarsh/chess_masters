export const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
export const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

// PieceType {
//   PAWN - 0,
//   BISHOP - 1,
//   KNIGHT - 2,
//   ROOK - 3,
//   QUEEN - 4,
//   KING - 5,
// }

// TeamType {
//   opponent - 0
//   our - 1
// }

export class Position {
    x = -1 ;
    y = -1 ;
}

export class Piece {
  image = "" ;
  x = -1 ;
  y = -1 ;
  type = "" ;
  team = -1 ;
  isEnPassant  ;
}
