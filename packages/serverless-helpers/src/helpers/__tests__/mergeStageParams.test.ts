import mergeStageParams from '../mergeStageParams';

/**
 * unit tests
 *
 * @group unit/helpers
 */
describe('mergeStageParams', () => {
  it('should merge single stage params', () => {
    expect(
      mergeStageParams({ dev: { coucou: 'blob' } }, { dev: { super: '123' } }),
    ).toEqual({ dev: { coucou: 'blob', super: '123' } });
  });

  it('should merge multiple stage params', () => {
    expect(
      mergeStageParams(
        { dev: { coucou: 'blob', blob: 'coucou' } },
        { dev: { super: '123' } },
      ),
    ).toEqual({ dev: { coucou: 'blob', blob: 'coucou', super: '123' } });
  });

  it('should merge params for multiple stages', () => {
    expect(
      mergeStageParams(
        {
          dev: { coucou: 'dev-blob', blob: 'dev-coucou' },
          staging: { coucou: 'staging-blob', blob: 'staging-coucou' },
          production: { coucou: 'production-blob', blob: 'production-coucou' },
        },
        {
          dev: { super: 'dev-123' },
          staging: { super: 'staging-123' },
          production: { super: 'production-123' },
        },
      ),
    ).toEqual({
      dev: { coucou: 'dev-blob', blob: 'dev-coucou', super: 'dev-123' },
      staging: {
        coucou: 'staging-blob',
        blob: 'staging-coucou',
        super: 'staging-123',
      },
      production: {
        coucou: 'production-blob',
        blob: 'production-coucou',
        super: 'production-123',
      },
    });
  });
});
