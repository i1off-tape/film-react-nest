import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { createLogger } from './logger.factory';
import { TskvLogger } from './tskv.logger';

describe('createLogger', () => {
  it('creates DevLogger by default', () => {
    expect(createLogger(undefined)).toBeInstanceOf(DevLogger);
  });

  it('creates JsonLogger', () => {
    expect(createLogger('json')).toBeInstanceOf(JsonLogger);
  });

  it('creates TskvLogger', () => {
    expect(createLogger('tskv')).toBeInstanceOf(TskvLogger);
  });
});
