import * as React from 'react';

export const TextInput = (props: {value: string; ref?: React.Ref<any>; onChange: (value: string) => void; readOnly?: boolean; placeholder?: string}) =>
    props.readOnly ? (
        <>{props.value}</>
    ) : (
        <input ref={props.ref} className='argo-field' value={props.value} onChange={e => props.onChange(e.target.value)} placeholder={props.placeholder} />
    );
