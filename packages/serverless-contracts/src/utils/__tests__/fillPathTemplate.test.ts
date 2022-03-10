import { fillPathTemplate } from '../fillPathTemplate';

describe('fillPathTemplate', () => {
  it('should not fail if no values are passed', () => {
    expect(fillPathTemplate('/hello')).toBe('/hello');
  });

  it('should fill one value in the template', () => {
    expect(fillPathTemplate('/i/tell/{id}/hello', { id: 'you' })).toBe(
      '/i/tell/you/hello',
    );
  });

  it('should fill several values in the template', () => {
    expect(
      fillPathTemplate('/i/tell/{id}/{greet}', {
        id: 'you',
        greet: 'hello',
      }),
    ).toBe('/i/tell/you/hello');
  });

  it('should fill several times the same value in the template', () => {
    expect(
      fillPathTemplate('/i/tell/{id}/{id}/{greet}', {
        id: 'you',
        greet: 'hello',
      }),
    ).toBe('/i/tell/you/you/hello');
  });

  it('should not replace unknown values in the template', () => {
    expect(
      fillPathTemplate('/i/tell/{id}/{greet}', {
        greet: 'hello',
      }),
    ).toBe('/i/tell/{id}/hello');
  });

  it('should not replace extra values in the template', () => {
    expect(
      fillPathTemplate('/i/tell/{id}/{greet}', {
        id: 'you',
        greet: 'hello',
        foo: 'bar',
      }),
    ).toBe('/i/tell/you/hello');
  });
});
