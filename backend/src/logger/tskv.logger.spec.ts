import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('formats log as TSKV', () => {
    const result = logger.formatMessage('log', 'hello', 'context');

    expect(result).toContain('level=log');
    expect(result).toContain('message=hello');
    expect(result).toContain('param0=context');
    expect(result).toContain('\t');
  });

  it('escapes tabs and new lines', () => {
    const result = logger.formatMessage('log', 'hello\tworld\nnext');

    expect(result).toContain('message=hello\\tworld\\nnext');
  });

  it('writes warning to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    logger.warn('careful');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toContain('level=warn');

    spy.mockRestore();
  });
});
