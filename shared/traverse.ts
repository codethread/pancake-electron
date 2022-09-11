// takes a function and applies it to any leaf inside an object or array combination
// if called without a withFunction, will return a deep copy of the obj/array/value
export function traverse<A = any>(obj: object, func: Fn): A {
	return transform(obj, func);
}

/* ******************************************************************* */
/* PRIVATES                                                            */
/* ******************************************************************* */
type Fn<A = any, B = any> = (arg: A) => B;

function isObject(value: unknown) {
	return value && typeof value === 'object' && value.constructor === Object;
}

function transformArr<A, B>(arr: A[], evaluate: Fn<A, B>): B[] {
	const newArr: B[] = [];
	var i = 0,
		len = arr.length;
	while (i < len) {
		const v = arr[i] as A;
		if (v !== undefined && v !== null) {
			newArr.push(evaluate(v));
		}
		i++;
	}
	return newArr;
}

function transformObj<A, B>(obj: A, evaluate: Fn<A, any>) {
	const newO = {} as B;
	const entries = Object.entries(obj);

	var i = 0,
		len = entries.length;
	while (i < len) {
		const [key, value] = entries[i] as [keyof B, any];
		newO[key] = evaluate(value);
		i++;
	}
	return newO;
}

function transform(value: any, func: Fn): any {
	if (isObject(value)) {
		return transformObj(value, (v) => transform(v, func));
	} else if (Array.isArray(value)) {
		return transformArr(value, (v) => transform(v, func));
	}

	return func(value);
}
