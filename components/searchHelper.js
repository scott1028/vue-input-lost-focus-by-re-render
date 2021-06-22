import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

DEBUG = console.debug

// NOTE: https://stackoverflow.com/questions/23827691/combining-memoize-and-throttle-to-limit-function-calls-and-cache-a-result-wi
export const simpleStringComparer = ({ target, value }) => {
  const formatedTarget = isEmpty(target) ? '' : target;
  let formatedValue = isEmpty(value) ? '' : value;
  formatedValue = formatedValue.replace(/\\/g, '\\\\');
  formatedValue = formatedValue.replace(/\+/g, '\\+');
  formatedValue = formatedValue.replace(/-/g, '\\-');
  DEBUG(
    'simpleStringComparer/target,value,formatedTarget,formatedValue:',
    target, value, formatedTarget, formatedValue);
  return !!formatedTarget.match(new RegExp(formatedValue, 'i'));
};

export const arrayStringComparer = ({ target, value }) => {
  const output = target.map(item =>
    simpleStringComparer({ target: item, value }));
  return reduce(output, (prev, curr) => prev || curr);
};

export const searchHelper = ({
  data = [],
  columns = [],
  compare = simpleStringComparer,
  value = null,
}) => data.filter(item => {
  const { length } = columns.filter(column =>
    compare({ target: get(item, column), value }));
  return length > 0;
});

export default searchHelper;
