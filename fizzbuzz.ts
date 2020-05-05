
type Eq<A, B extends A> = 'eq';

type test_eq = [
  Eq<1, 1>,
  Eq<true, true>,
  Eq<'foo', 'foo'>
]

type _0 = 0

type Increment<N> = [N, '+1']

type ToInt<N, R extends any[] = []> = {
  zero: R['length'],
  next: ToInt<Decrement<N>, Prepend<'+', R>>
}[N extends _0 ? 'zero' : 'next']

type _1 = Increment<_0>
type _2 = Increment<_1>
type _3 = Increment<_2>
type _4 = Increment<_3>
type _5 = Increment<_4>
type _6 = Increment<_5>
type _7 = Increment<_6>
type _8 = Increment<_7>
type _9 = Increment<_8>
type _10 = Increment<_9>

type _11 = Increment<_10>
type _12 = Increment<_11>
type _13 = Increment<_12>
type _14 = Increment<_13>
type _15 = Increment<_14>
type _16 = Increment<_15>
type _17 = Increment<_16>
type _18 = Increment<_17>
type _19 = Increment<_18>
type _20 = Increment<_19>

type _21 = Increment<_20>
type _22 = Increment<_21>
type _23 = Increment<_22>
type _24 = Increment<_23>
type _25 = Increment<_24>
type _26 = Increment<_25>
type _27 = Increment<_26>
type _28 = Increment<_27>
type _29 = Increment<_28>
type _30 = Increment<_29>

type _31 = Increment<_30>
type _32 = Increment<_31>
type _33 = Increment<_32>
type _34 = Increment<_33>
type _35 = Increment<_34>
type _36 = Increment<_35>
type _37 = Increment<_36>
type _38 = Increment<_37>
type _39 = Increment<_38>
type _40 = Increment<_39>

type _41 = Increment<_40>
type _42 = Increment<_41>
type _43 = Increment<_42>
type _44 = Increment<_43>
type _45 = Increment<_44>
type _46 = Increment<_45>
type _47 = Increment<_46>
type _48 = Increment<_47>
type _49 = Increment<_48>
type _50 = Increment<_49>

type test_increment = [
  Eq<Increment<Increment<Increment<_0>>>, _3>,
  Eq<ToInt<_0>, 0>,
  Eq<ToInt<_1>, 1>,
  Eq<ToInt<_2>, 2>,
  Eq<ToInt<_3>, 3>,
  Eq<ToInt<_4>, 4>,
  Eq<ToInt<_5>, 5>
]

type NAN = 'nan'

type Decrement<N> = N extends Increment<infer U> ? U : NAN

type test_decrement = [
  Eq<Decrement<_0>, NAN>,
  Eq<Decrement<_1>, _0>,
  Eq<Decrement<_2>, _1>
]

type Subtract<N, V> = {
  zero: V,
  next: Subtract<Decrement<N>, Decrement<V>>
}[N extends _0 ? 'zero' : 'next']

type test_subtract = [
  Eq<Subtract<_0, _1>, _1>,
  Eq<Subtract<_1, _1>, _0>,
  Eq<Subtract<_1, _2>, _1>,
  Eq<Subtract<_2, _0>, NAN>
]

type Division<N, V> = {
  nan: NAN,
  zero: _0,
  next: Increment<Division<N, Subtract<N, V>>>,
}[N extends _0 ? 'nan' : V extends _0 ? 'zero' : 'next']

type test_division = [
  Eq<Division<_0, _1>, NAN>,
  Eq<Division<_1, _2>, _2>,
  Eq<Division<_2, _2>, _1>,
  Eq<Division<_2, _0>, _0>
]

type If<Cond extends boolean, Then, Else> = Cond extends true ? Then : Else
type And<Cond1 extends boolean, Cond2 extends boolean> = Cond1 extends true ? Cond2 extends true ? true : false : false
type Or<Cond1 extends boolean, Cond2 extends boolean> = Cond1 extends true ? true : Cond2 extends true ? true : false

type Modulo<N, V> = {
  nan: NAN,
  next: Modulo<N, Subtract<N, V>>,
  finish: V
}[N extends _0 ? 'nan' : V extends _0 ? 'finish' : Subtract<N, V> extends NAN ? 'finish' : 'next']

type test_modulo = [
  Eq<Modulo<_0, _1>, NAN>,
  Eq<Modulo<_1, _2>, _0>,
  Eq<Modulo<_2, _2>, _0>,
  Eq<Modulo<_2, _1>, _1>
]

type Divisible<N, V> = Modulo<N, V> extends _0 ? true : false

type DivisibleBy3<N> = Divisible<_3, N>
type DivisibleBy5<N> = Divisible<_5, N>
type DivisibleBy15<N> = And<DivisibleBy3<N>, DivisibleBy5<N>>

type test_divisible = [
  Eq<Divisible<_3, _0>, true>,
  Eq<Divisible<_3, _1>, false>,
  Eq<Divisible<_3, _2>, false>,
  Eq<Divisible<_3, _3>, true>,
  Eq<DivisibleBy3<_3>, true>,
  Eq<DivisibleBy3<_4>, false>,
  Eq<DivisibleBy5<_5>, true>,
  Eq<DivisibleBy5<_6>, false>,
  Eq<DivisibleBy15<_15>, true>,
  Eq<DivisibleBy15<_16>, false>
]

type FizBuzzNth<N> = If<
  DivisibleBy15<N>,
  'FizzBuzz',
  If<
    DivisibleBy3<N>,
    'Fizz',
    If<
      DivisibleBy5<N>,
      'Buzz',
      N
    >
  >
>

type test_fizzbuzznth = [
  Eq<FizBuzzNth<_1>, _1>,
  Eq<FizBuzzNth<_2>, _2>,
  Eq<FizBuzzNth<_3>, 'Fizz'>,
  Eq<FizBuzzNth<_4>, _4>,
  Eq<FizBuzzNth<_5>, 'Buzz'>,
  Eq<FizBuzzNth<_9>, 'Fizz'>,
  Eq<FizBuzzNth<_10>, 'Buzz'>,
  Eq<FizBuzzNth<_15>, 'FizzBuzz'>,
  Eq<FizBuzzNth<_30>, 'FizzBuzz'>,
]

type Prepend<U, T extends any[] = []> = Parameters<(a: U, ...b: T) => any>

type test_prepend = [
  Eq<Prepend<0>, [0]>,
  Eq<Prepend<1, []>, [1]>,
  Eq<Prepend<1, [2]>, [1, 2]>
]

type FizzBuzz<N, R extends any[] = []> = {
  zero: R,
  next: FizzBuzz<Decrement<N>, Prepend<FizBuzzNth<N>, R>>
}[N extends _0 ? 'zero' : 'next']

type test_fizzbuzz = [
  Eq<FizzBuzz<_0>, []>,
  Eq<FizzBuzz<_1>, [_1]>,
  Eq<FizzBuzz<_2>, [_1, _2]>,
  Eq<FizzBuzz<_3>, [_1, _2, 'Fizz']>,
  Eq<FizzBuzz<_4>, [_1, _2, 'Fizz', _4]>,
  Eq<FizzBuzz<_5>, [_1, _2, 'Fizz', _4, 'Buzz']>,
  Eq<FizzBuzz<_15, []>, [_1, _2, 'Fizz', _4, 'Buzz', 'Fizz', _7, _8, 'Fizz', 'Buzz', _11, 'Fizz', _13, _14, 'FizzBuzz']>,
  Eq<FizzBuzz<_16, []>, [_1, _2, 'Fizz', _4, 'Buzz', 'Fizz', _7, _8, 'Fizz', 'Buzz', _11, 'Fizz', _13, _14, 'FizzBuzz', _16]>
]

type Pretty<N extends Increment<any> | 'Fizz' | 'Buzz' | 'FizzBuzz'> = 
  N extends 'Fizz' | 'Buzz' | 'FizzBuzz' ? N : ToInt<N>


type test_pretty = [
  Eq<
    [Pretty<_1>, Pretty<_2>, 'Fizz', Pretty<_4>, 'Buzz', 'Fizz', Pretty<_7>, Pretty<_8>, 'Fizz', 'Buzz', Pretty<_11>, 'Fizz', Pretty<_13>, Pretty<_14>, 'FizzBuzz', Pretty<_16>],
    [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz', 16]
  >
]
