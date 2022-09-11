import { maybeNot, MaybeNot } from './maybeNot';

describe('maybeNot', () => {
	type Test = [
		title: string,
		info: {
			input: any;
			output: any;
		}
	];

	const tests: Test[] = [
		[
			'simple flat',
			{
				input: { foo: 'hi', bar: null, baz: undefined },
				output: { foo: 'hi', bar: undefined, baz: undefined },
			},
		],
		[
			'simple nested',
			{
				input: {
					nested: {
						foo: 'hi',
						bar: null,
						baz: undefined,
					},
				},
				output: { nested: { foo: 'hi', bar: undefined, baz: undefined } },
			},
		],
		[
			'arrays',
			{
				input: {
					arr: [1, 2, null, 3, 'foo', undefined, 'bar'],
				},
				output: {
					arr: [1, 2, 3, 'foo', 'bar'],
				},
			},
		],
		[
			'nested arrays',
			{
				input: {
					arr: [1, 2, null, 3, 'foo', undefined, 'bar'],
					nested: {
						foo: 'hi',
						bar: null,
						baz: undefined,
						arr: [1, 2, null, 3, 'foo', undefined, 'bar'],
					},
				},
				output: {
					arr: [1, 2, 3, 'foo', 'bar'],
					nested: {
						foo: 'hi',
						bar: undefined,
						baz: undefined,
						arr: [1, 2, 3, 'foo', 'bar'],
					},
				},
			},
		],
		[
			'mixed bag',
			{
				input: {
					arr: [1, 2, null, 3, 'foo', undefined, 'bar'],
					nested: {
						foo: 'hi',
						bar: null,
						baz: undefined,
						arr: [
							1,
							2,
							null,
							3,
							'foo',
							{
								foo: 'hi',
								bar: null,
								bing: [],
								baz: undefined,
							},
							undefined,
							'bar',
						],
					},
				},
				output: {
					arr: [1, 2, 3, 'foo', 'bar'],
					nested: {
						foo: 'hi',
						bar: undefined,
						baz: undefined,
						arr: [
							1,
							2,
							3,
							'foo',
							{
								foo: 'hi',
								bar: undefined,
								bing: [],
								baz: undefined,
							},
							'bar',
						],
					},
				},
			},
		],
	];

	test.each(tests)('removes nulls from shapes %s', (_, { input, output }) => {
		expect(maybeNot(input)).toStrictEqual(output);
	});
});
