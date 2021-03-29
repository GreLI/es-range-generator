const N = Number,
	{isNaN: i, MAX_SAFE_INTEGER: M} = N,
	{abs, sign} = Math,
	E = Error

export default function *range(n, m, s = 1) {
	if (arguments.length < 2)
		m = n, n = 0, s = sign(m)
	else if (arguments.length < 3 && m < n)
		s = -1
	if (typeof n == "bigint" || typeof m == "bigint" || abs(n) > M || abs(m) > M)
		n = BigInt(n), m = BigInt(m), s = BigInt(s)
	else
		n = N(n), m = N(m), s = N(s)
	if (i(n) || i(m) || i(s)) throw new E("range() arguments must be numbers")
	if (s == 0) throw new E("range() argument 3 must be not zero")
	if (s > 0)
		for (; n < m; n += s) yield n
	else
		for (; n > m; n += s) yield n
}
