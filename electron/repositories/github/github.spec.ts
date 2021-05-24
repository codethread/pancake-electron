import { githubRepository } from '@electron/repositories/github/github';
import { err, ok } from '@shared/Result';
import _got from 'got';
import { mocked } from 'ts-jest/utils';

const got = mocked(_got);
jest.mock('got');

describe('github repo', () => {
  describe('#getTokenScopes', () => {
    describe('when headers are returned', () => {
      it('should return a list of scopes', async () => {
        got.mockResolvedValue({
          headers: {
            'x-oauth-scopes': 'foo,bar',
          },
        });

        const scopes = await githubRepository().getTokenScopes('123uio');

        expect(got).toHaveBeenCalledWith(
          'https://api.github.com',
          expect.objectContaining({
            headers: {
              Authorization: `token 123uio`,
            },
          })
        );
        expect(scopes).toMatchResult(ok(['foo', 'bar']));
      });
    });

    describe('when no headers are returned', () => {
      it('should return an error message', async () => {
        got.mockResolvedValue({});

        const scopes = await githubRepository().getTokenScopes('123uio');

        expect(scopes).toMatchResult(err('no scopes for token'));
      });
    });

    describe('when the request fails', () => {
      it('should return an error message', async () => {
        got.mockRejectedValue({});

        const scopes = await githubRepository().getTokenScopes('123uio');

        expect(scopes).toMatchResult(err('no scopes for token'));
      });
    });
  });
});
