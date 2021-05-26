import { githubRepository } from '@electron/repositories/github/github';
import { err, ok } from '@shared/Result';
import _got from 'got';
import { mocked } from 'ts-jest/utils';

const got = mocked(_got);
jest.mock('got');

describe('github repo', () => {
  describe('#getTokenScopes', () => {
    describe('when the request fails', () => {
      it('should return an error message', async () => {
        got.mockRejectedValue({});

        const scopes = await githubRepository().getTokenScopes('123uio');

        expect(scopes).toMatchResult(err('no scopes for token'));
      });
    });

    const h = 'x-oauth-scopes';

    test.each`
      testName                          | response                                  | result
      ${'empty'}                        | ${{}}                                     | ${err('no scopes for token')}
      ${'empty headers'}                | ${{ headers: {} }}                        | ${err('no scopes for token')}
      ${'empty scope header'}           | ${{ headers: { [h]: '' } }}               | ${err('no scopes for token')}
      ${'empty scope header array'}     | ${{ headers: { [h]: [] } }}               | ${err('no scopes for token')}
      ${'single scope header'}          | ${{ headers: { [h]: 'foo' } }}            | ${ok(['foo'])}
      ${'single scope header array'}    | ${{ headers: { [h]: ['foo'] } }}          | ${ok(['foo'])}
      ${'multiple scopes header'}       | ${{ headers: { [h]: 'foo, bar' } }}       | ${ok(['foo', 'bar'])}
      ${'multiple scopes header array'} | ${{ headers: { [h]: ['foo ', ' bar'] } }} | ${ok(['foo', 'bar'])}
    `('when response is $testName, it returns expected result', async ({ response, result }) => {
      got.mockResolvedValue(response);
      expect(await githubRepository().getTokenScopes('123uio')).toMatchResult(result);
    });
  });
});
