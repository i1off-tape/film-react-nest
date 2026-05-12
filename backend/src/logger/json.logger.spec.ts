import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('formats log as JSON', () => {
    const result = logger.formatMessage('log', 'hello', 'context');
    const parsed = JSON.parse(result);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('hello');
    expect(parsed.optionalParams).toEqual(['context']);
    expect(parsed.time).toEqual(expect.any(String));
  });

  it('writes log to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('hello');

    expect(spy).toHaveBeenCalledTimes(1);
    const [message] = spy.mock.calls[0];
    expect(JSON.parse(message).level).toBe('log');

    spy.mockRestore();
  });

  it('writes error to console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();

    logger.error('boom');

    expect(spy).toHaveBeenCalledTimes(1);
    const [message] = spy.mock.calls[0];
    expect(JSON.parse(message).level).toBe('error');

    spy.mockRestore();
  });
});
