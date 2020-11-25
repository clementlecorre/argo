import * as React from 'react';
import {kubernetes} from '../../../../models';
import {TextInput} from '../text-input';
import {LabelsAndAnnotationsEditor} from './labels-and-annotations-editor';

export const MetadataEditor = (props: {value: kubernetes.ObjectMeta; onChange: (value: kubernetes.ObjectMeta) => void}) => {
    return (
        <>
            <div className='white-box'>
                <div className='row white-box__details-row'>
                    <div className='columns small-4'>Name</div>
                    <div className='columns small-4'>
                        <TextInput onChange={name => props.onChange({...props.value, name})} value={props.value.name} readOnly={!!props.value.creationTimestamp} />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-4'>Namespace</div>
                    <div className='columns small-4'>
                        <TextInput onChange={namespace => props.onChange({...props.value, namespace})} value={props.value.namespace} readOnly={!!props.value.creationTimestamp} />
                    </div>
                </div>
            </div>
            <LabelsAndAnnotationsEditor value={props.value} onChange={props.onChange} />
        </>
    );
};
