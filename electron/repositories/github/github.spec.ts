import { githubRepository, GQL } from '@electron/repositories/github/github';
import { err, ok, Result } from '@shared/Result';
import _got from 'got';
import { mocked } from 'ts-jest/utils';
import { _User } from '@shared/graphql';
import { exampleUser } from '@test/fixtures/github';

const got = mocked(_got, true);
jest.mock('got', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('github repo', () => {
  describe('#getTokenScopes', () => {
    describe('when the request fails', () => {
      it('should return an error message', async () => {
        got.get.mockRejectedValue({});

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
      got.get.mockResolvedValue(response);
      expect(await githubRepository().getTokenScopes('123uio')).toMatchResult(result);
    });
  });

  describe('#getCurrentUser', () => {
    describe('when the request fails', () => {
      it('should return an error message', async () => {
        got.post.mockRejectedValue({});

        const scopes = await githubRepository().getCurrentUser('123uio');

        expect(scopes).toMatchResult(err('could not communicate with github server'));
      });
    });

    interface Test {
      body: GQL<never>;
      result: Result<_User>;
    }

    test.each`
      testName         | body                                     | result
      ${'some errors'} | ${{ errors: [{ x: 'boop' }], data: '' }} | ${err('could not get user')}
      ${'a user'}      | ${{ data: exampleUser }}                 | ${ok(exampleUser)}
    `('when response is $testName, it returns expected result', async ({ body, result }: Test) => {
      got.post.mockResolvedValue({ body });
      expect(await githubRepository().getCurrentUser('123uio')).toMatchResult(result);
    });
  });
});
