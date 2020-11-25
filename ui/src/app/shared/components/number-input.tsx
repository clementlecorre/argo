import * as React from 'react';
import {TextInput} from './text-input';

export const NumberInput = (props: {value: number; onChange: (value: number) => void; readOnly?: boolean; placeholder?: string}) =>
    props.readOnly ? (
        <>{props.value}</>
    ) : (
        <TextInput value={props.value != null ? '' + props.value : ''} onChange={value => props.onChange(parseInt(value, 10))} placeholder={props.placeholder} />
    );
