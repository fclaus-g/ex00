
var board;
var score = 0;
var rows = 4;
var cols = 4;

window.onload = function() {
	setGame();
	document.getElementById("restart-btn").addEventListener("click", () => {
		document.getElementById("grid-container").innerHTML = "";
		score = 0;
		updateScore();
		setGame();
	});
}

function setGame() {
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			let tile = document.createElement("div");
			tile.id = r.toString() + c.toString();
			let num = board[r][c];
			updateTile(tile, num);
			document.getElementById("grid-container").appendChild(tile);
		}
	}
	setTwo();
	setTwo();
}
function checkWin(){
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (board[r][c] == 2048) {
				return true;
			}
		}
	}
	return false;
}
function hasEmptyTile() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (board[r][c] == 0) {
				return true;
			}
		}
	}
	return false;
}

function hasMoves() {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			if (board[r][c] == 0) {
				return true;
			}
			if (c < cols - 1 && board[r][c] == board[r][c + 1]) {
				return true;
			}
			if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
				return true;
			}
			if (c > 0 && board[r][c] == board[r][c - 1]) {
				return true;
			}
			if (r > 0 && board[r][c] == board[r - 1][c]) {
				return true;
			}
		}
	}
	return false;
}


/**
 * Añade un 2 en una casilla aleatoria del tablero para ello se hace lo siguiente:
 * 1. Selecciona una fila y columna aleatoria haciendo uso de Math.random
 * 2. Si la casilla seleccionada tiene un valor de 0, entonces se añade un 2
 */
function setTwo() {
	if (!hasEmptyTile()){
		alert("Game Over");
		return;
	}
	let found = false;
	while (!found) {
		let r = Math.floor(Math.random() * rows);//
		let c = Math.floor(Math.random() * cols);
		if (board[r][c] == 0) {
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2", "new-tile");
			found = true;
		}
	}
}
/**
 * Actualiza el valor de la casilla en el tablero y en la vista borrando primero
 * el valor de la casilla y añadiendo la nueva clase correspondiente
 * @param {*} tile casilla a actualizar
 * @param {*} num nuevo valor de la casilla
 */
function updateTile(tile, num) {
	tile.innerText = "";
	tile.classList.value = "";//limpia la clase "tile x2, x4, x8, etc"
	tile.classList.add("tile");//añade la clase correspondiente
	if (num > 0) {
		tile.innerText = num;
		if (num <= 4096){
			tile.classList.add("x" + num.toString());
		} else {
			tile.classList.add("x8192");
		}
	}
	setTimeout(() => {
        tile.classList.remove("new-tile");
    }, 200);
}

function updateScore() {
	document.getElementById("score").innerText = score;
}

document.addEventListener("keyup", (event) => {
	if (event.key === "ArrowLeft") {
		if (slideLeft()) {
			setTwo();}
	}
	else if (event.key === "ArrowRight") {
		if (slideRight()){
			setTwo();}
	}
	else if (event.key === "ArrowUp") {
		if (slideUp())
			setTwo();
	}
	else if (event.key === "ArrowDown") {
		if (slideDown()){
			setTwo();}
	}
})

/**
 * Toma la fila y elimina las casillas con valor 0 creando un nuevo array
 * @param {*} row la fila a filtrar
 * @returns lanueva fila sin casillas con valor 0
 */
function filterZero(row) {
	return row.filter(num => num > 0);//devuelve un array con los valores que cumplen la condición
}

/**
 * Toma la fila y desliza las casillas hacia la izquierda
 * 1. Elimina los ceros de la fila
 * 2. Combina las casillas adyacentes con el mismo valor
 * 3. Elimina los ceros de la fila
 * 4. Añade ceros a la fila hasta que tenga la longitud de las columnas
 * @param {*} row 
 * @returns la fila actualizada 
 */
function slide(row) {
	//[0, 2, 2, 2]
	row = filterZero(row);//[2, 2, 2]
	for (let i = 0; i < row.length - 1; i++) {
		if (row[i] == row[i + 1]) {
			row[i] *= 2;//[4, 2, 0]
			row[i + 1] = 0;//[4, 0, 0]
			score += row[i];//score = 4
			updateScore();
		}//[4, 0, 2]
	}
	row = filterZero(row);//[4, 2]
	while (row.length < cols) {
		row.push(0);
	}//[4, 2, 0, 0]
	return row;
}
/**
 * Mueve todas las casillas hacia la izquierda, para ello
 * 1. Toma la fila fila del tablero
 * 2. Desliza las casillas hacia la izquierda [slide(row)]
 * 3. Actualiza la fila en el tablero
 * 4. Actualiza la vista de la fila en el tablero en el DOM, tomando el id de la casilla
 * y actualizando el valor de la casilla
 */
function slideLeft() {
	let oldBoard = board.map(row => [...row]);
	for (let r = 0; r < rows; r++) {
		let row = board[r];
		row = slide(row);
		board[r] = row;

		for (let c = 0; c < cols; c++) {
			let tile = document.getElementById(r.toString() + c.toString());
			updateTile(tile, board[r][c]);
		}
	}
	if (!hasEmptyTile() && !hasMoves()){
		alert("Game Over");
	}
	if (checkWin()){
		alert("You Win");
	}
	if (oldBoard.toString() != board.toString()){
		return true;
	}
}

/**
 * Mueve todas las casillas hacia la derecha, para ello hacemos lo mismo que en slideLeft
 * pero invertimos la fila antes de deslizar las casillas y después de deslizarlas
 * y con ello obtenemos el efecto deseado
 */
function slideRight() {
	let oldBoard = board.map(row => [...row]);
	for (let r = 0; r < rows; r++) {
		let row = board[r];
		row = row.reverse();
		row = slide(row);
		row = row.reverse();
		board[r] = row;

		for (let c = 0; c < cols; c++) {
			let tile = document.getElementById(r.toString() + c.toString());
			updateTile(tile, board[r][c]);
		}
	}
	if (!hasEmptyTile() && !hasMoves()){
		alert("Game Over");
	}
	if (checkWin()){
		alert("You Win");
	}
	if (oldBoard.toString() != board.toString()){
		return true;
	}
}

/**
 * Mueve todas las casillas hacia arriba, para ello hacemos lo siguiente:
 * 1. Creamos un array y tomamos la posicion de la casilla por cada columna
 * 2. Deslizamos las casillas como si fueran una fila
 * 3. Actualizamos la fila en el tablero
 * 4. Actualizamos la vista de la fila en el tablero en el DOM, tomando el id de las casillas	
*/
 function slideUp() {
	let oldBoard = board.map(row => [...row]);
	for (let c = 0; c < cols; c++) {
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		row = slide(row);
		// board[0][c] = row[0];
		// board[1][c] = row[1];
		// board[2][c] = row[2];
		// board[3][c] = row[3];
		for (let r = 0; r < rows; r++) {
			board[r][c] = row[r];
			let tile = document.getElementById(r.toString() + c.toString());
			updateTile(tile, board[r][c]);
		}
	}
	if (!hasEmptyTile() && !hasMoves()){
		alert("Game Over");
	}
	if (checkWin()){
		alert("You Win");
	}
	if (oldBoard.toString() != board.toString()){
		return true;
	}
}

/**
 * Mueve todas las casillas hacia abajo, para ello hacemos lo mismo que en slideUp
 * pero invertimos la fila antes de deslizar las casillas y después de deslizarlas
 * y con ello obtenemos el efecto deseado
 */
function slideDown() {
	let oldBoard = board.map(row => [...row]);
	for (let c = 0; c < cols; c++) {
		let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
		row = row.reverse();
		row = slide(row);
		row = row.reverse();
		board[0][c] = row[0];
		board[1][c] = row[1];
		board[2][c] = row[2];
		board[3][c] = row[3];
		for (let r = 0; r < rows; r++) {
			let tile = document.getElementById(r.toString() + c.toString());
			updateTile(tile, board[r][c]);
		}
	}
	if (!hasEmptyTile() && !hasMoves()){
		alert("Game Over");
	}
	if (checkWin()){
		alert("You Win");
	}
	if (oldBoard.toString() != board.toString()){
		return true;
	}
}
