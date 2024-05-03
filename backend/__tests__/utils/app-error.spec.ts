import AppError from '../../src/utils/AppError';

describe('App Error class', () => {
  it('returns "fail" as status for code 400+', () => {
    const err = new AppError('Custom error message', 400);

    expect(err.status).toBe('fail');
    expect(new AppError('Another error', 500).status).not.toBe('fail');
  });

  it('returns "error" as status for code 500+', () => {
    const err = new AppError('Custom error message', 500);

    expect(err.status).toBe('error');
    expect(new AppError('Another error', 400).status).not.toBe('error');
  });
});
