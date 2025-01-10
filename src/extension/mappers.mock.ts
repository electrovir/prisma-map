import {check} from '@augment-vir/assert';
import type {MappedPrismaValue} from './map-values.js';

export function mapDates(value: unknown): MappedPrismaValue {
    if (!check.instanceOf(value, Date)) {
        return undefined;
    }

    return {replacement: value.toISOString()};
}

export function mapToFakeDate(value: unknown): MappedPrismaValue {
    if (!check.instanceOf(value, Date)) {
        return undefined;
    }

    return {
        replacement: 'fake date',
    };
}
