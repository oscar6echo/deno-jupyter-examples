import { assert } from '@std/assert';

const must_be_in = (value: string, possible_values: string[]) => {
    const msg = `value ${value} must be in ${possible_values}`;
    assert(possible_values.includes(value), msg);
};

export { must_be_in };
