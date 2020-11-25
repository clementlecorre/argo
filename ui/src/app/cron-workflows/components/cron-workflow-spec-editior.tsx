import {Checkbox, Select} from 'argo-ui';
import * as React from 'react';
import {ConcurrencyPolicy, CronWorkflowSpec} from '../../../models';
import {NumberInput} from '../../shared/components/number-input';
import {TextInput} from '../../shared/components/text-input';

export const CronWorkflowSpecEditor = (props: {spec: CronWorkflowSpec; onChange: (spec: CronWorkflowSpec) => void}) => {
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Schedule</div>
                    <div className='columns small-9'>
                        <TextInput value={props.spec.schedule} onChange={schedule => props.onChange({...props.spec, schedule})} />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Timezone</div>
                    <div className='columns small-9'>
                        <TextInput value={props.spec.timezone} onChange={timezone => props.onChange({...props.spec, timezone})} />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Concurrency Policy</div>
                    <div className='columns small-9'>
                        <Select
                            options={['Allow', 'Forbid', 'Replace']}
                            value={props.spec.concurrencyPolicy}
                            onChange={x =>
                                props.onChange({
                                    ...props.spec,
                                    concurrencyPolicy: x.value as ConcurrencyPolicy
                                })
                            }
                        />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Starting Deadline Seconds</div>
                    <div className='columns small-9'>
                        <NumberInput
                            value={props.spec.startingDeadlineSeconds}
                            onChange={startingDeadlineSeconds =>
                                props.onChange({
                                    ...props.spec,
                                    startingDeadlineSeconds
                                })
                            }
                        />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Successful Jobs History Limit</div>
                    <div className='columns small-9'>
                        <NumberInput
                            value={props.spec.successfulJobsHistoryLimit}
                            onChange={successfulJobsHistoryLimit =>
                                props.onChange({
                                    ...props.spec,
                                    successfulJobsHistoryLimit
                                })
                            }
                        />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Failed Jobs History Limit</div>
                    <div className='columns small-9'>
                        <NumberInput
                            value={props.spec.failedJobsHistoryLimit}
                            onChange={failedJobsHistoryLimit =>
                                props.onChange({
                                    ...props.spec,
                                    failedJobsHistoryLimit
                                })
                            }
                        />
                    </div>
                </div>
                <div className='row white-box__details-row'>
                    <div className='columns small-3'>Suspended</div>
                    <div className='columns small-9'>
                        <Checkbox checked={props.spec.suspend} onChange={suspend => props.onChange({...props.spec, suspend})} />
                    </div>
                </div>
            </div>
        </div>
    );
};
