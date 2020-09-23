
let = vals = {};
vals.back_to_waist = 15;
vals.height_under_arm = 7.5;
vals.front_of_arm = 10;
vals.breast = 36;

function plus (a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}

function minus (a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}

function mult(a, b) {
    return [a[0] * b, a[1] * b];
}

function below (a, b) {
    return plus(a, [0, b]);
}

function above (a, b) {
    return below(a, -b);
}

function right(a, b) {
    return plus(a, [b, 0]);
}

function left(a, b) {
    return right(a, -b);
}

function height_of(a, b, c) {
    let d = (a[1] - b[1]) / (c[1] - b[1]);
    return [
        b[0] * (1 - d) + c[0] * d,
        a[1]
    ];
}

function width_of(a, b, c) {
    let d = (a[0] - b[0]) / (c[0] - b[0]);
    return [
        a[0],
        b[1] * (1 - d) + c[1] * d
    ];
}

function square_meet(a, b) {
    return [a[0], b[1]];
}

function average(a, b) {
    return [a[0] * 0.5 + b[0] * 0.5, a[1] * 0.5 + b[1] * 0.5];
}

function length(a, b) {
    let c = minus(b, a);
    return Math.sqrt(Math.pow(c[0], 2) + Math.pow(c[1], 2));
}

function direction(a, b) {
    return mult(minus(b, a), 1 / length(a, b));
}

function compute() {
    let points = {};
    points.O = [vals.breast / 2 + 5, 1];
    points['1'] = below(points.O, 0.75);
    points.B = below(points['1'], vals.back_to_waist);
    points.A = above(points.B, vals.height_under_arm);
    points.C = left(points.B, vals.breast / 12);
    points.A1 = height_of(points.A, points['1'], points.C);
    points.G = left(points.A1, vals.breast / 2);
    points.K = left(points.A1, vals.front_of_arm);
    points.I = square_meet(points.K, points.O);
    points.J = square_meet(points.K, points.B);
    points.L = right(points.K, (3 / 8) * vals.front_of_arm);
    points.V = square_meet(points.L, points.O);
    points.Z = average(points.V, points.L);
    points.T = average(points.V, points.Z);
    points['3'] = average(points.T, points.Z);
    points['2'] = left(points.O, vals.front_of_arm / 8);
    points['9'] = left(points.O, vals.breast / 6);
    points['8'] = square_meet(points['9'], points.Z);
    points.X = width_of(points['9'], points['3'], points['2'])
    points.D = left(points.C, 1.5);
    points['11'] = height_of(points.A, points['8'], points.C);
    points.P = average(points.G, points.K);
    points.E = square_meet(points.P, points.O);
    points.F = left(points.E, vals.breast / 12);
    // maybe the breast twelfth needs to go down the diagonal.
    // the source isn't quite clear on that.
    // implemented this way because easier.
    points.N = height_of(below(points.F, vals.breast / 12), points.F, points.G);
    points.H = height_of(points.B, points.F, points.G);


    // Curve points are guesses, need to be refined
    let curve_points = {}
    curve_points['21'] = left(points['1'], vals.front_of_arm / 16);
    curve_points['8X'] = right(average(points['8'], points.X), 0.2);
    curve_points['118'] = plus(points['11'], mult(direction(points.D, points['8']), length(points['11'], points['8']) / 2));
    curve_points.D11 = plus(points['11'], mult(direction(points['8'], points.D), length(points.D, points['11']) / 2));
    return [points, curve_points]
}

let line = ['D', ['D11', '11'], ['118', '8'], ['8X', 'X'], '2', ['21', '1'], 'C']

function render(pp) {
    let [points, curve_points] = pp;
    let pattern = document.querySelector('#pattern');
    pattern.innerHTML = '';

    let path = document.createElement('path');
    let pathstr = 'M ' + mult(points[line[0]], 40);
    for (p of line.slice(1)) {
        if (typeof p === 'string') {
            pathstr += ' L ' + mult(points[p], 40);
        } else {
            pathstr += ' Q ' + mult(curve_points[p[0]], 40) + ' ' + mult(points[p[1]], 40);
        }
    }
    console.log(pathstr);
    path.setAttribute('d', pathstr);
    path.className = 'path'
    pattern.insertBefore(path, null);

    for (p in points) {
        let text = document.createElement('text');
        text.setAttribute('x', points[p][0] * 40);
        text.setAttribute('y', points[p][1] * 40);
        text.innerText = p;
        pattern.insertBefore(text, null);
    }

    pattern.innerHTML = pattern.innerHTML;
}

addEventListener('DOMContentLoaded', () => {
    for (key in vals) {
        window[key].value = vals[key];
    }
    render(compute());
});

addEventListener('change', (e) => {
    vals[e.target.id] = Number(e.target.value);
    render(compute());
    console.log(e.target.id);
});
