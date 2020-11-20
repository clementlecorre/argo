import {Select} from 'argo-ui';
import * as React from 'react';
import {useState} from 'react';

export const DataLoaderDropdown = (props: {load: Promise<string[]>; onChange: (value: string) => void}) => {
    const [list, setList] = useState<string[]>();
    const [error, setError] = useState<Error>();
    const [selected, setSelected] = useState('');

    useState(() => {
        props.load.then(setList).catch(setError);
    });

    return (
        <Select
            options={list || (error ? [error.message] : [])}
            value={selected}
            onChange={x => {
                setSelected(x.value);
                props.onChange(x.value);
            }}
        />
    );
};
