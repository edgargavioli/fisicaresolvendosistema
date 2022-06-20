const table = document.createElement(`table`);
const thead = document.createElement(`thead`);
const tbody = document.createElement(`tbody`); // th é o cabeçalho
// table.setAttribute(`id`, `tabela`)
const numeroMatriz = document.querySelector(`#numeroMatriz`);
let matriz = [];
const check = document.getElementById("mostrarTela");

table.appendChild(thead);
table.appendChild(tbody);

document.getElementById(`body`).appendChild(table);

function criarMatriz() {
  let tamanhoMatriz = 0;
  tamanhoMatriz = Number(numeroMatriz.value);
  for (let linha = 0; linha < tamanhoMatriz; linha++) {
    matriz[linha] = new Array(tamanhoMatriz);
  }

  criarCelulas(matriz);

  return matriz;
}

function criarCelulas(matriz) {
  for (let i = 0; i < matriz.length; i++) {
    let th = document.createElement(`th`);
    th.innerHTML += `i${i + 1}`;
    thead.appendChild(th);
  }

  for (let linha = 0; linha < matriz.length; linha++) {
    let tr = document.createElement(`tr`);

    tbody.appendChild(tr);

    for (let coluna = 0; coluna < matriz.length; coluna++) {
      let td = document.createElement(`td`);
      let input = document.createElement(`input`);

      input.id = "input" + linha + "_" + coluna;
      input.type = "number";

      td.appendChild(input);
      tr.appendChild(td);
    }
    let td = document.createElement(`td`);
    let inputResultado = document.createElement(`input`);
    inputResultado.id = "resultado_" + linha;
    td.appendChild(inputResultado);
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  criarTh();
}

function criarTh() {
  let th = document.createElement(`th`);
  th.innerHTML = `Número`;
  thead.appendChild(th);
}

function passandoNumerosParaMatriz(matriz) {
  let input;
  let valorInput;
  for (let linha = 0; linha < matriz.length; linha++) {
    for (let coluna = 0; coluna < matriz.length; coluna++) {
      input = document.getElementById(`input${linha}_${coluna}`);

      if (input.value == "") {
        input.value = "0";
      }
      valorInput = input.value;

      matriz[linha][coluna] = Number(valorInput);
    }
  }

  for (let linha = 0; linha < matriz.length; linha++) {
    input = document.getElementById(`resultado_${linha}`);
    valorInput = input.value;
    matriz[linha][matriz.length] = Number(valorInput);
  }
  mudarPosição(matriz);
  calcTudo();
}

function mudarPosição(matriz) {
  for (let linha = 0; linha < matriz.length; linha++) {
    for (let coluna = 0; coluna < matriz.length; coluna++) {
      if (matriz[coluna][linha] == 0 && matriz[coluna][linha - 1] == 0) {
        let para = coluna + 1;
        matriz.splice(para, 0, matriz.splice(coluna, 1)[0]);
      } else if (matriz[coluna][0] == 0) {
        let para = coluna + 1;
        matriz.splice(para, 0, matriz.splice(coluna, 1)[0]);
      }
    }
  }
}

function calcLinha(linha, coluna) {
  let resultadoMmc = mmc(matriz[linha][coluna], matriz[coluna][coluna]);
  let matrizPcalculo = criarMatrizAuxiliar(matriz);
  let nl1 = resultadoMmc / matriz[coluna][coluna];
  let nl2 = resultadoMmc / matriz[linha][coluna];
  for (let i = 0; i < matriz.length + 1; i++) {
    matrizPcalculo[coluna][i] *= nl1;
    matriz[linha][i] *= nl2;
  }
  for (let i = 0; i < matriz.length + 1; i++) {
    matriz[linha][i] = matrizPcalculo[coluna][i] - matriz[linha][i];
  }
  if (check.checked == true) {
    mostrar(matriz);
  }
}

function calcTudo() {
  mudarPosição(matriz);
  for (let lin = 1; lin < matriz.length; lin++) {
    for (let col = 0; col < lin; col++) {
      if (matriz[lin][col] != 0) {
        calcLinha(lin, col);
      }
    }
  }
  calcVariaveis();
}

function calcVariaveis() {
  let texto = "";
  const div = document.createElement(`div`);
  let p = document.createElement(`p`);
  let variaveis = new Array(matriz.length);
  for (let i = 0; i < variaveis.length; i++) variaveis[i] = 1;
  for (let i = 1; i <= matriz.length; i++) {
    for (let j = 1; j < i; j++)
      matriz[matriz.length - i][matriz.length] -=
        matriz[matriz.length - i][matriz.length - j] *
        variaveis[matriz.length - j];
    variaveis[matriz.length - i] =
      matriz[matriz.length - i][matriz.length] /
      matriz[matriz.length - i][matriz.length - i];
  }
  for (let i = 1; i <= variaveis.length; i++) {
    if (i != variaveis.length) {
      texto += "i" + i + "=" + variaveis[i - 1].toFixed(2) + "; ";
    } else {
      texto += "i" + i + "=" + variaveis[i - 1].toFixed(2);
    }
  }
  p.innerHTML = texto;
  div.appendChild(p);
  div.classList.add(`resultados`);
  body.appendChild(div);
}

function mostrar(matriz) {
  const div = document.createElement(`div`);
  let p;
  let texto;
  let i;
  for (let lin = 0; lin < matriz.length; lin++) {
    i = 1;
    p = document.createElement(`p`);
    texto = "";
    for (let col = 0; col <= matriz.length; col++) {
      if (col == 0) {
        texto += matriz[lin][col] + "i" + i + " ";
      } else if (matriz[lin][col] < 0 && col < matriz.length) {
        texto += "- " + matriz[lin][col] * -1 + "i" + i + " ";
      } else if (col == matriz.length) {
        texto += " = " + matriz[lin][col];
      } else {
        texto += "+ " + matriz[lin][col] + "i" + i + " ";
      }
      i++;
    }
    p.innerHTML = texto;
    div.appendChild(p);
  }
  div.classList.add(`resultados`);
  body.appendChild(div);
}

function criarMatrizAuxiliar(matriz) {
  let matrizAuxiliar = [];
  for (let linha = 0; linha < matriz.length; linha++) {
    matrizAuxiliar[linha] = new Array(matriz.length);
  }

  for (let linha = 0; linha < matriz.length; linha++) {
    for (let coluna = 0; coluna < matriz.length + 1; coluna++) {
      matrizAuxiliar[linha][coluna] = matriz[linha][coluna];
    }
  }

  return matrizAuxiliar;
}

function mmc(valorMatriz1, valorMatriz2) {
  let mmc = 1;
  let maior;
  if (valorMatriz1 < 0) {
    valorMatriz1 *= -1;
  }
  if (valorMatriz2 < 0) {
    valorMatriz2 *= -1;
  }
  if (valorMatriz1 > valorMatriz2) {
    maior = valorMatriz1;
  } else {
    maior = valorMatriz2;
  }

  for (let i = 1; i <= maior; i++) {
    if (valorMatriz1 % i == 0 && valorMatriz2 % i == 0) {
      mmc *= i;
      valorMatriz1 /= i;
      valorMatriz2 /= i;
      i = 1;
    } else if (valorMatriz1 % i == 0) {
      mmc *= i;
      valorMatriz1 /= i;
      i = 1;
    } else if (valorMatriz2 % i == 0) {
      mmc *= i;
      valorMatriz2 /= i;
      i = 1;
    }
  }
  return mmc;
}
