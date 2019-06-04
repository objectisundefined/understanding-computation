//  zero = -> p { -> x { x } }
//   one = -> p { -> x { p[x] } }
//   two = -> p { -> x { p[p[x]] } }
// three = -> p { -> x { p[p[x]] } }
//  four = -> p { -> x { p[p[x]] } }
//  five = -> p { -> x { p[p[x]] } }

const succ = n => proc => x => proc(n(proc)(x))
const zero = proc => x => x

const one   = succ(zero)
const two   = succ(succ(zero))
const three = succ(succ(succ(zero)))
const four  = succ(succ(succ(succ(zero))))
const five  = succ(succ(succ(succ(succ(zero)))))

const integer = proc => proc(x => x + 1)(0)

console.log(
  integer(zero),
  integer(succ(zero)),
  integer(succ(succ(zero))),
  integer(succ(succ(succ(zero)))),
  integer(succ(succ(succ(succ(zero))))),
)

// true = -> x { -> y { x } }
const _true = x => y => x
// true = -> x { -> y { y } }
const _false = x => y => y

const boolean = proc => proc(true)(false)

console.log(
  boolean(_true),
  boolean(_false),
)

// if = -> p { -> x { -> y { p[x][y] } } }
// eager calculating value a and b
const _if = bool => x => y => bool(x)(y)

console.log(
  _if(_true)('a')('b'),
  _if(_false)('a')('b'),
)

const _zero_v = n => n(x => _false)(_true)

console.log(
  _zero_v(zero),
  _zero_v(succ(zero)),
)

// pair = -> x { -> y { -> f { f[x][y] } } }
const pair = x => y => f => f(x)(y)
// left = -> p { p[-> x { -> y { x } }] }
const left = p => p(x => y => x)
// right = -> p { p[-> x { -> y { y } }] }
const right = p => p(x => y => y)

console.log(
  integer(left(pair(zero)(succ(zero)))),
  integer(right(pair(zero)(succ(zero)))),
)

const slide = p => pair(right(p))(succ(right(p)))

const increment = succ
const decrement = n => left(n(slide)(pair(zero)(zero)))

console.log(
  integer(increment(zero)),
  integer(decrement((succ(succ(zero))))),
  integer(decrement((succ(succ(succ(zero)))))),
)

// add = -> m { -> n { n[increment][m] } }
const add = m => n => n(increment)(m)
// subtract = -> m { -> n { n[decrement][m] } }
const subtract = m => n => n(decrement)(m)
// multiply = -> m { -> n { n[add[m]][zero] } }
const multiply = m => n => n(add(m))(zero)
// power = -> m { -> n { n[multiply[m]][one] } }
const power = m => n => n(multiply(m))(succ(zero))

console.log(
  integer(add(three)(two)),
  integer(subtract(three)(two)),
  integer(multiply(three)(two)),
  integer(multiply(succ(three))(two)),
  integer(power(three)(two)),
)

// three - five = 0
// monus

// less or equal
const _le = m => n => _zero_v(subtract(m)(n))
// less than
const _lt = m => n => _le(m)(decrement(n))

console.log(
  boolean(_le(succ(zero))(zero)),
  boolean(_le(zero)(succ(zero))),
)

// Y = -> f { -> x { f[x[x]] } }[-> x { f[x[x]] }]
// Z = -> f { -> x { f[-> y { x[x][y] } }[-> x { f[-> y { x[x][y] }]

// const Z = f => (g => f(y => g(g)(y)))(g => f(y => g(g)(y)))
// y => g(g)(y) is just f
const Z = h => (f => f(f))(f => h(x => f(f)(x)))

const reverse = Z(f => s => s.length ? f(s.slice(1)) + s[0] : '')

console.log(reverse('abcde'))

/*
const mod = (m, n) => {
  if (m >= n) {
    return mod(m - n, m)
  }

  return m
}
*/

const mod = Z(f => m => n =>
  _if(_le(n)(m))
    // eager calculating value, RangeError: Maximum call stack size exceeded
    (_ => f(subtract(m)(n))(n) (_))
    (m)
)

console.log(
  integer(mod(power(three)(three))(two)),
  integer(mod(power(three)(three))(three)),
)

const empty = pair(_true)(_true)
const unshift = l => x => pair(_false)(pair(x)(l))
const _empty_l = left
const head = l => left(right(l))
const rest = l => right(right(l))

const list = l => {
  const r = []

  while (!boolean(_empty_l(l))) {
    r.push(head(l))
    l = rest(l)
  }

  return r
}

// number list
const _n_list = l => list(l).map(integer)

console.log(
  _n_list(empty),
  _n_list(unshift(empty)(zero)),
  _n_list(unshift(unshift(empty)(zero))(one)),
  _n_list(unshift(unshift(unshift(empty)(zero))(one))(two)),
)

/*
const range = (m, n) => {
  if (m <= n) {
    return [m, range(m + 1, n)]
  }

  return []
}
*/

// m => n => [m..n]
const range = Z(f => m => n =>
  _if(_le(m)(n))
    // eager calculating value
    (_ => unshift(f(increment(m))(n))(m) (_))
    (empty)
)

console.log(
  _n_list(range(one)(five))
)

const flodl = Z(f => g => acc => l =>
  _if(_empty_l(l))
    (acc)
    // eager calculating value
    (_ => f(g)(g(acc)(head(l)))(rest(l)) (_))
)

const foldr = Z(f => g => acc => l =>
  _if(_empty_l)(l)
    (acc)
    // eager calculating value
    (_ => g(head(l))(f(g)(acc)(rest(l))) (_))
)

const map = f => foldr(x => acc => unshift(acc)(f(x)))(empty)

console.log(
  integer(flodl(add)(three)(range(one)(five))),
  integer(foldr(add)(zero)(range(one)(five))),
  _n_list(map(increment)(range(one)(five))),
)

// string, just char list
const ten = multiply(two)(five)

const _n_b = ten
const _n_f = increment(_n_b)
const _n_i = increment(_n_f)
const _n_u = increment(_n_i)
const _n_z = increment(_n_u)

const char = p => '0123456789BFiuz'.charAt(integer(p))
const string = l => list(l).reduce((acc, x) => acc + char(x), '')

// string list
const _s_list = l => list(l).map(string).join(', ')

console.log(
  list(range(one)(_n_z)).map(char)
)

const _s_fizz = unshift(unshift(unshift(unshift(empty)(_n_z))(_n_z))(_n_i))(_n_f)
const _s_buzz = unshift(unshift(unshift(empty)(_n_z))(_n_u))(_n_b)
const _s_fizzbuzz = unshift(unshift(unshift(unshift(unshift(unshift(unshift(empty)(_n_z))(_n_u))(_n_b))(_n_z))(_n_z))(_n_i))(_n_f)

console.log(
  string(_s_fizz),
  string(_s_buzz),
  string(_s_fizzbuzz),
)

/*
const div = (m, n) => {
  if (m < n) {
    return 0
  }

  return div(m - n , n) + 1
}
*/

const div = Z(f => m => n =>
  _if(_lt(m)(n))
    (zero)
    // eager calculating value
    (_ => increment(f(subtract(m)(n))(n)) (_))
)

console.log(
  integer(div(five)(one)),
  integer(div(five)(two)),
  integer(div(five)(three)),
)

/*
const push = (l, x) => {
  if (l.length == 0) {
    return [x]
  }

  return [l[0], ...push(l.slice(1), x)]
}
*/

const push = Z(f => l => x =>
  _if(_empty_l(l))
    (unshift(empty)(x))
    // eager calculating value
    (_ => unshift(f(rest(l))(x))(head(l)) (_))
)

console.log(
  _n_list(push(empty)(zero)),
  _n_list(push(range(zero)(two))(three)),
)

// number digits
/*
const _digits = (n) => {
  if (n < 10) {
    return [n]
  }

  return [..._digits(~~(n / 10)), n % 10]
}
*/

const _digits = Z(f => n =>
  _if(_lt(n)(ten))
    (unshift(empty)(n))
    (_ => push(f(div(n)(ten)))(mod(n)(ten)) (_))
)

console.log(
  _n_list(_digits(three)),
  _n_list(_digits(power(ten)(two))),
  _n_list(_digits(add(power(ten)(two))(three))),
)

/*
const _fizzbuzz = t => {
  if (t % 15 == 0) {
    return 'FizzBuzz'
  }

  if (t % 3 == 0) {
    return 'Fizz'
  }

  if (t % 5 == 0) {
    return 'Buzz'
  }

  return String(t)
}
*/

const _fizzbuzz = n =>
  _if(_zero_v(mod(n)(multiply(three)(five))))
    (_s_fizzbuzz)
    (_if(_zero_v(mod(n)(three)))
      (_s_fizz)
      (_if(_zero_v(mod(n)(five)))
        (_s_buzz)
        (_digits(n))
      )
    )

console.log(
  _s_list(map(_fizzbuzz)(range(zero)(multiply(four)(five))))
)
