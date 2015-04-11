var canvas = document.getElementById('canvas');
// var canvas2 = document.getElementById('canvas2');
var context = canvas.getContext('2d');
// var context2 = canvas2.getContext('2d');
var go = document.getElementById('btn_go');;



var lengthInput = document.getElementById('selectLength');
var rangeB = document.getElementById('B');
var rangeT = document.getElementById('T');
var integralJ = document.getElementById('J');
/**
 *
 */

function Izing() {
    this.a = [];
    this.L = length + 1;
    that = this;

    // this.energy = 0;
    this.magnetism = 0;
    this.T = 1;
    this.J = 1;
    this.B = 0;
    this.px = choosePixel();
    this.goal = false;
    this.N = 256 * 256;
}



Izing.prototype.fillRandomMatrix = function() {
    for (var i = 0; i < this.L + 1; i++) {
        this.a[i] = [];
        for (var j = 0; j < this.L + 1; j++) {
            if (i === 0 || i === this.L) {
                this.a[i][j] = 0;
            } else if (j === 0 || j === this.L) {
                this.a[i][j] = 0;
            } else {
                this.a[i][j] = Math.random() < 0.5 ? 1 : -1;
            }
        }
    }
};

function choosePixel(bool) {
    var lengthInput = document.getElementById('selectLength');
    var length = parseInt(lengthInput.options[lengthInput.selectedIndex].value, 10);
    var param = 1;
    if (bool) {
        param = 2;
    }
    if (length === 8) {
        return 64 * param;
    } else if (length === 16) {
        return 32 * param;
    } else if (length === 32) {
        return 16 * param;
    } else if (length === 64) {
        return 8 * param;
    } else if (length === 128) {
        return 4 * param;
    } else if (length === 256) {
        return 2 * param;
    } else if (length === 512) {
        return 1 * param;
    }
}


Izing.prototype.fillByColors = function() {
    for (var i = 0; i < this.L; i++) {
        for (var j = 0; j < this.L; j++) {
            if (this.a[i][j] === 1) {
                context.fillRect((j - 1) * this.px, (i - 1) * this.px, this.px, this.px);
            }
            context.fillStyle = 'aqua';

        }
    }
};

Izing.prototype.calculateMagnetism = function() {

    for (var i = 0; i < this.L; i++) {
        for (var j = 0; j < this.L; j++) {
            this.magnetism += this.a[i][j];
        }
    }
    console.log('Magnetism\t' + this.magnetism);
};

Izing.prototype.runMonteCarlo = function() {
    // console.log('The B:\t' + this.B + '\n The T: \t' + this.T);
    var that = this;
    var count = 0;
    while (count < this.N) {
        var theK = [getK(), getK()];
        var Energy1 = calculateEnergy(theK[0], theK[1]);
        // console.log(this.a[1]);
        flip(theK);

        var Energy2 = calculateEnergy(theK[0], theK[1]);
        // console.log(this.a[1]);


        if (Energy2 > Energy1 && Math.random() > Math.exp((Energy1 - Energy2) / this.T)) {
            flip(theK);
        }
        count++;
    }







    function flip(array) {
        that.a[theK[0]][theK[1]] *= -1;

    }

    function getK() {
        return Math.round(1 - 0.5 + Math.random() * (256 - 1 + 1));
    }


    function calculateEnergy(ii, jj) {
        var energy = 0;
        var cur = that.a[ii][jj],
            up = that.a[ii - 1][jj],
            down = that.a[ii + 1][jj],
            left = that.a[ii][jj - 1],
            right = that.a[ii][jj + 1];
        energy -= that.J * cur * up;
        energy -= that.J * cur * down;
        energy -= that.J * cur * left;
        energy -= that.J * cur * right;

        energy -= that.a[ii][jj] * that.B;
        return energy;
    }

};


Izing.prototype.setL = function(param) {
    var length = parseInt(lengthInput.options[lengthInput.selectedIndex].value, 10);
    if (param) length /= 2;
    this.L = length + 1;
};

Izing.prototype.setPixel = function(bool) {
    this.px = choosePixel(bool);
};

Izing.prototype.setGoal = function() {
    this.goal = false;
};

Izing.prototype.getGoal = function() {
    return this.goal;
};

Izing.prototype.setA = function(array) {
    this.a = array;
};

Izing.prototype.clearArray = function() {
    this.a.length = 0;
};

Izing.prototype.SetB = function() {
    this.B = document.getElementById('B').value;
};

Izing.prototype.SetT = function() {
    this.T = document.getElementById('T').value;
};

Izing.prototype.SetT = function() {
    console.log('tatat');
    this.J *= -1;
};

var Izing = new Izing();

go.addEventListener('click', startIzing);

function startIzing() {
    //Очищаем поле
    context.clearRect(0, 0, 512, 512);
    //Обновляем параметры
    Izing.setL();
    Izing.clearArray();
    Izing.setPixel();
    Izing.setGoal();
    // Запускаем расчет
    Izing.fillRandomMatrix();
    Izing.fillByColors();
    Izing.runMonteCarlo();

    setInterval(function() {
        Izing.runMonteCarlo();
        Izing.fillByColors();
    }, 800);
    // Izing.calculateMagnetism();



}
startIzing();

function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) {
            return r[c];
        });
    });
}

function eventB() {
    Izing.SetB();
}
