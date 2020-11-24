import * as React from 'react';
import {kubernetes} from '../../../../models';
import {KeyValueEditor} from './key-value-editor';

export const LabelsAndAnnotationsEditor = (props: { value: kubernetes.ObjectMeta; onChange: (value: kubernetes.ObjectMeta) => void }) => {
    return (
        <>
            <div className='white-box'>
                <h5>Labels</h5>
                <KeyValueEditor value={props.value.labels}
                                onChange={labels => props.onChange({...props.value, labels})}/>
            </div>
            <div className='white-box'>
                <h5>Annotations</h5>
                <KeyValueEditor
                    value={props.value.annotations}
                    onChange={annotations => props.onChange({...props.value, annotations})}
                    hide={key => key === 'kubectl.kubernetes.io/last-applied-configuration'}
                />
            </div>
        </>
    );
};
