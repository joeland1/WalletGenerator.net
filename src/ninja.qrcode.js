const QRCode = require("./qrcode.js");
const { Modernizr } = require("./autogen/modernizr");

// determine which type number is big enough for the input text length
const getTypeNumber = function(text) {
  const lengthCalculation = text.length * 8 + 12; // length as calculated by the QRCode
  if (lengthCalculation < 72) {
    return 1;
  } else if (lengthCalculation < 128) {
    return 2;
  } else if (lengthCalculation < 208) {
    return 3;
  } else if (lengthCalculation < 288) {
    return 4;
  } else if (lengthCalculation < 368) {
    return 5;
  } else if (lengthCalculation < 480) {
    return 6;
  } else if (lengthCalculation < 528) {
    return 7;
  } else if (lengthCalculation < 688) {
    return 8;
  } else if (lengthCalculation < 800) {
    return 9;
  } else if (lengthCalculation < 976) {
    return 10;
  }
  return null;
};

const createCanvas = function(text, sizeMultiplier) {
  sizeMultiplier = !sizeMultiplier ? 2 : sizeMultiplier; // default 2
  // create the qrcode itself
  const typeNumber = getTypeNumber(text);
  const qrcode = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
  qrcode.addData(text);
  qrcode.make();
  const width = qrcode.getModuleCount() * sizeMultiplier;
  const height = qrcode.getModuleCount() * sizeMultiplier;
  // create canvas element
  const canvas = document.createElement("canvas");
  const scale = 10.0;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  // compute tileW/tileH based on width/height
  const tileW = width / qrcode.getModuleCount();
  const tileH = height / qrcode.getModuleCount();
  // draw in the canvas
  for (let row = 0; row < qrcode.getModuleCount(); row++) {
    for (let col = 0; col < qrcode.getModuleCount(); col++) {
      ctx.fillStyle = qrcode.isDark(row, col) ? "#000000" : "#ffffff";
      ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
    }
  }
  // return just built canvas
  return canvas;
};

// generate a QRCode and return it's representation as an Html table
const createTableHtml = function(text) {
  const typeNumber = getTypeNumber(text);
  const qr = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
  qr.addData(text);
  qr.make();
  let tableHtml = "<table class='qrcodetable'>";
  for (let r = 0; r < qr.getModuleCount(); r++) {
    tableHtml += "<tr>";
    for (let c = 0; c < qr.getModuleCount(); c++) {
      if (qr.isDark(r, c)) {
        tableHtml += "<td class='qrcodetddark'/>";
      } else {
        tableHtml += "<td class='qrcodetdlight'/>";
      }
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</table>";
  return tableHtml;
};

// generate a QRCode and return it's representation as an Html table
const createSvg = function(text, sizeMultiplier) {
  // https://stackoverflow.com/questions/20539196/creating-svg-elements-dynamically-with-javascript-inside-html
  const typeNumber = getTypeNumber(text);
  const qr = new QRCode(typeNumber, QRCode.ErrorCorrectLevel.H);
  qr.addData(text);
  qr.make();
  const modCount = qr.getModuleCount();
  const size = modCount * sizeMultiplier;
  const ns = "http://www.w3.org/2000/svg";
  function getNode(n, v) {
    n = document.createElementNS(ns, n);
    for (const p in v) {
      if ({}.hasOwnProperty.call(v, p)) {
        n.setAttributeNS(null, p, v[p]);
      }
    }
    return n;
  }
  let root = getNode("svg");
  root.style.width = size + "px";
  root.style.height = size + "px";
  root.appendChild(
    getNode("rect", {
      x: 0,
      y: 0,
      width: size,
      height: size,
      fill: "#fff"
    })
  );
  for (let c = 0; c < modCount; c++) {
    for (let r = 0; r < modCount; r++) {
      if (qr.isDark(r, c)) {
        root.appendChild(
          getNode("rect", {
            x: c * sizeMultiplier,
            y: r * sizeMultiplier,
            width: sizeMultiplier,
            height: sizeMultiplier,
            fill: "#000"
          })
        );
      }
    }
  }
  return root;
};

// show QRCodes with canvas OR table (IE8)
// parameter: keyValuePair
// example: { "id1": "string1", "id2": "string2"}
//		"id1" is the id of a div element where you want a QRCode inserted.
//		"string1" is the string you want encoded into the QRCode.
const showQrCode = function(keyValuePair, sizeMultiplier) {
  for (const key in keyValuePair) {
    if ({}.hasOwnProperty.call(keyValuePair, key)) {
      const value = keyValuePair[key];
      if (Modernizr.svg) {
        document.getElementById(key).innerHTML = "";
        document.getElementById(key).appendChild(createSvg(value, sizeMultiplier));
      } else if (Modernizr.canvas) {
        document.getElementById(key).innerHTML = "";
        document.getElementById(key).appendChild(createCanvas(value, sizeMultiplier));
      } else {
        // for browsers that do not support canvas (IE8)
        document.getElementById(key).innerHTML = createTableHtml(value);
      }
    }
  }
};

module.exports = {
  getTypeNumber,
  createCanvas,
  createTableHtml,
  showQrCode
};