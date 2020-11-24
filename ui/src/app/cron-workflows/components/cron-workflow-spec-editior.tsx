import * as React from 'react';
import {CronWorkflowSpec} from '../../../models';

export const CronWorkflowSpecEditor = (props: {spec: CronWorkflowSpec}) => {
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {[
                    {title: 'Schedule', value: props.spec.schedule},
                    {title: 'Timezone', value: props.spec.timezone},
                    {
                        title: 'Concurrency Policy',
                        value: props.spec.concurrencyPolicy ? props.spec.concurrencyPolicy : 'Allow'
                    },
                    {title: 'Starting Deadline Seconds', value: props.spec.startingDeadlineSeconds},
                    {title: 'Successful Jobs History Limit', value: props.spec.successfulJobsHistoryLimit},
                    {title: 'Failed Jobs History Limit', value: props.spec.failedJobsHistoryLimit},
                    {title: 'Suspended', value: (!!props.spec.suspend).toString()}
                ].map(attr => (
                    <div className='row white-box__details-row' key={attr.title}>
                        <div className='columns small-3'>{attr.title}</div>
                        <div className='columns small-9'>{attr.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
