const initialPieces = [
  // Quân trắng
  { type: "rook", color: "white", position: "A1", symbol: "♖" },
  { type: "knight", color: "white", position: "B1", symbol: "♘" },
  { type: "bishop", color: "white", position: "C1", symbol: "♗" },
  { type: "queen", color: "white", position: "D1", symbol: "♕" },
  { type: "king", color: "white", position: "E1", symbol: "♔" },
  { type: "bishop", color: "white", position: "F1", symbol: "♗" },
  { type: "knight", color: "white", position: "G1", symbol: "♘" },
  { type: "rook", color: "white", position: "H1", symbol: "♖" },
  { type: "pawn", color: "white", position: "A2", symbol: "♙" },
  { type: "pawn", color: "white", position: "B2", symbol: "♙" },
  { type: "pawn", color: "white", position: "C2", symbol: "♙" },
  { type: "pawn", color: "white", position: "D2", symbol: "♙" },
  { type: "pawn", color: "white", position: "E2", symbol: "♙" },
  { type: "pawn", color: "white", position: "F2", symbol: "♙" },
  { type: "pawn", color: "white", position: "G2", symbol: "♙" },
  { type: "pawn", color: "white", position: "H2", symbol: "♙" },
  // Quân đen
  { type: "rook", color: "black", position: "A8", symbol: "♜" },
  { type: "knight", color: "black", position: "B8", symbol: "♞" },
  { type: "bishop", color: "black", position: "C8", symbol: "♝" },
  { type: "queen", color: "black", position: "D8", symbol: "♛" },
  { type: "king", color: "black", position: "E8", symbol: "♚" },
  { type: "bishop", color: "black", position: "F8", symbol: "♝" },
  { type: "knight", color: "black", position: "G8", symbol: "♞" },
  { type: "rook", color: "black", position: "H8", symbol: "♜" },
  { type: "pawn", color: "black", position: "A7", symbol: "♟" },
  { type: "pawn", color: "black", position: "B7", symbol: "♟" },
  { type: "pawn", color: "black", position: "C7", symbol: "♟" },
  { type: "pawn", color: "black", position: "D7", symbol: "♟" },
  { type: "pawn", color: "black", position: "E7", symbol: "♟" },
  { type: "pawn", color: "black", position: "F7", symbol: "♟" },
  { type: "pawn", color: "black", position: "G7", symbol: "♟" },
  { type: "pawn", color: "black", position: "H7", symbol: "♟" },
];


const piece = {
  type: "pawn",
  color: "white",
  position: "A2",
  symbol: "♙",
};

// Lấy phần tử bàn cờ
const chessboard = document.getElementById('chessboard');

// Render bàn cờ
function renderChessboard() {
  const columns = 8;
  const rows = 8;

  // Tạo các ô bàn cờ
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      // Tạo một ô
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Đặt màu xen kẽ (sáng/tối)
      if ((row + col) % 2 === 0) {
        cell.classList.add('light');
      } else {
        cell.classList.add('dark');
      }

      // Đặt tọa độ (vd: "A1", "B2")
      const columnLabel = String.fromCharCode(65 + col); // Chữ cái A-H
      const rowLabel = 8 - row; // Số 1-8 (ngược từ trên xuống dưới)
      cell.dataset.position = `${columnLabel}${rowLabel}`;

      // Gắn sự kiện click (đánh dấu hoặc xử lý)
      cell.addEventListener('click', () => {
        console.log(`Clicked on: ${cell.dataset.position}`);
        highlightCell(cell); // Đánh dấu ô
      });

      // Thêm ô vào bàn cờ
      chessboard.appendChild(cell);
    }
  }
}

// Đánh dấu ô được chọn
function highlightCell(cell) {
  // Xóa các ô đã được đánh dấu
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
  // Đánh dấu ô được chọn
  cell.classList.add('highlight');
}

function renderPieces(pieces, chessboard) {
  // Xóa các quân cờ cũ (nếu có)
  chessboard.querySelectorAll('.piece').forEach(piece => piece.remove());

  // Render từng quân cờ
  pieces.forEach(piece => {
    const cell = chessboard.querySelector(`[data-position="${piece.position}"]`);
    if (cell) {
      const pieceElement = document.createElement('div');
      pieceElement.classList.add('piece', piece.color);
      pieceElement.textContent = piece.symbol;
      cell.appendChild(pieceElement);
    }
  });
}

function movePiece(piece, newPosition, pieces) {
  // Kiểm tra nếu quân cờ đã được chọn
  const targetPieceIndex = pieces.findIndex(p => p.position === piece.position);

  if (targetPieceIndex === -1) {
    console.log("Piece not found!");
    return; // Nếu không tìm thấy quân cờ, thoát hàm
  }

  // Kiểm tra xem có quân cờ nào ở vị trí mới không
  const targetPiece = pieces.find(p => p.position === newPosition);
  if (targetPiece) {
    // Nếu có quân cờ cùng màu ở vị trí đích, không thể di chuyển
    if (targetPiece.color === piece.color) {
      console.log("Cannot move to a position occupied by your own piece!");
      return;
    }
    // Nếu có quân cờ đối phương, di chuyển và "ăn" quân cờ đó
    pieces = pieces.filter(p => p.position !== newPosition); // Xóa quân cờ đối phương
  }

  // Cập nhật vị trí mới cho quân cờ
  pieces[targetPieceIndex].position = newPosition;

  // Render lại bàn cờ
  renderPieces(pieces, document.getElementById('chessboard'));
  console.log(`${piece.type} moved to ${newPosition}`);
}


function isValidMovePawn(currentPosition, targetPosition, color, pieces) {
  const currentRow = parseInt(currentPosition[1]);
  const currentCol = currentPosition.charCodeAt(0);
  const targetRow = parseInt(targetPosition[1]);
  const targetCol = targetPosition.charCodeAt(0);

  // Hướng di chuyển (trắng đi lên, đen đi xuống)
  const direction = color === "white" ? 1 : -1;

  // Kiểm tra bước đi thẳng (không ăn quân)
  if (currentCol === targetCol) {
    const step = targetRow - currentRow;
    if (step === direction) return true; // 1 bước thẳng
    if (step === 2 * direction && (color === "white" ? currentRow === 2 : currentRow === 7)) {
      // Bước đầu tiên, di chuyển 2 ô
      const betweenRow = currentRow + direction;
      const betweenPosition = `${String.fromCharCode(currentCol)}${betweenRow}`;
      return !pieces.some(p => p.position === betweenPosition || p.position === targetPosition);
    }
  }

  // Kiểm tra nước đi chéo (ăn quân)
  if (Math.abs(currentCol - targetCol) === 1 && targetRow - currentRow === direction) {
    const targetPiece = pieces.find(p => p.position === targetPosition);
    return targetPiece && targetPiece.color !== color; // Chỉ ăn quân khác màu
  }

  return false;
}

function isValidMoveRook(currentPosition, targetPosition, pieces) {
  const currentRow = parseInt(currentPosition[1]);
  const currentCol = currentPosition.charCodeAt(0);
  const targetRow = parseInt(targetPosition[1]);
  const targetCol = targetPosition.charCodeAt(0);

  // Đi theo hàng ngang hoặc dọc
  if (currentRow === targetRow || currentCol === targetCol) {
    const directionRow = targetRow === currentRow ? 0 : targetRow > currentRow ? 1 : -1;
    const directionCol = targetCol === currentCol ? 0 : targetCol > currentCol ? 1 : -1;

    let nextRow = currentRow + directionRow;
    let nextCol = currentCol + directionCol;

    // Kiểm tra các ô trung gian
    while (nextRow !== targetRow || nextCol !== targetCol) {
      const position = `${String.fromCharCode(nextCol)}${nextRow}`;
      if (pieces.some(p => p.position === position)) return false;
      nextRow += directionRow;
      nextCol += directionCol;
    }

    // Kiểm tra ô đích
    const targetPiece = pieces.find(p => p.position === targetPosition);
    return !targetPiece || targetPiece.color !== pieces.color;
  }

  return false;
}

function isValidMoveKnight(currentPosition, targetPosition, pieces) {
  const currentRow = parseInt(currentPosition[1]);
  const currentCol = currentPosition.charCodeAt(0);
  const targetRow = parseInt(targetPosition[1]);
  const targetCol = targetPosition.charCodeAt(0);

  // Kiểm tra các bước đi hình chữ "L"
  const rowDiff = Math.abs(targetRow - currentRow);
  const colDiff = Math.abs(targetCol - currentCol);

  if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
    const targetPiece = pieces.find(p => p.position === targetPosition);
    return !targetPiece || targetPiece.color !== pieces.color;
  }

  return false;
}

function isValidMoveQueen(currentPosition, targetPosition, pieces) {
  return isValidMoveRook(currentPosition, targetPosition, pieces) ||
         isValidMoveBishop(currentPosition, targetPosition, pieces);
}

function isValidMoveKing(currentPosition, targetPosition, pieces) {
  const currentRow = parseInt(currentPosition[1]);
  const currentCol = currentPosition.charCodeAt(0);
  const targetRow = parseInt(targetPosition[1]);
  const targetCol = targetPosition.charCodeAt(0);

  // Vua chỉ được đi 1 ô theo mọi hướng
  const rowDiff = Math.abs(targetRow - currentRow);
  const colDiff = Math.abs(targetCol - currentCol);

  if (rowDiff <= 1 && colDiff <= 1) {
    const targetPiece = pieces.find(p => p.position === targetPosition);
    return !targetPiece || targetPiece.color !== pieces.color;
  }

  return false;
}

function isValidMove(piece, targetPosition, pieces) {
  switch (piece.type) {
    case "pawn":
      return isValidMovePawn(piece.position, targetPosition, piece.color, pieces);
    case "rook":
      return isValidMoveRook(piece.position, targetPosition, pieces);
    case "knight":
      return isValidMoveKnight(piece.position, targetPosition, pieces);
    case "bishop":
      return isValidMoveBishop(piece.position, targetPosition, pieces);
    case "queen":
      return isValidMoveQueen(piece.position, targetPosition, pieces);
    case "king":
      return isValidMoveKing(piece.position, targetPosition, pieces);
    default:
      return false;
  }
}

function onPieceMove(selectedPiece, targetPosition) {
  if (isValidMove(selectedPiece, targetPosition, initialPieces)) {
    movePiece(selectedPiece, targetPosition);
    console.log(`${selectedPiece.type} moved to ${targetPosition}`);
  } else {
    console.log("Invalid move!");
  }
}


// Render bàn cờ khi tải trang
renderChessboard();
renderPieces(initialPieces, document.getElementById('chessboard'));