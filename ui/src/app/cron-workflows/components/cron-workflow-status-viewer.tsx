import * as kubernetes from 'argo-ui/src/models/kubernetes';
import * as React from 'react';
import {CronWorkflowSpec, CronWorkflowStatus} from '../../../models';
import {Timestamp} from '../../shared/components/timestamp';
import {ConditionsPanel} from '../../shared/conditions-panel';
import {WorkflowLink} from '../../workflows/components/workflow-link';

const parser = require('cron-parser');
export const CronWorkflowStatusViewer = (props: {spec: CronWorkflowSpec; status: CronWorkflowStatus}) => {
    if (props.status === null) {
        return null;
    }
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                {[
                    {title: 'Active', value: props.status.active ? getCronWorkflowActiveWorkflowList(props.status.active) : <i>No Workflows Active</i>},
                    {title: 'Last Scheduled Time', value: <Timestamp date={props.status.lastScheduledTime} />},
                    {
                        title: 'Next Scheduled Time',
                        value: (
                            <>
                                <Timestamp date={getNextScheduledTime(props.spec.schedule, props.spec.timezone)} /> (assumes workflow-controller is in UTC)
                            </>
                        )
                    },
                    {title: 'Conditions', value: <ConditionsPanel conditions={props.status.conditions} />}
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

function getCronWorkflowActiveWorkflowList(active: kubernetes.ObjectReference[]) {
    return active.reverse().map(activeWf => <WorkflowLink key={activeWf.uid} namespace={activeWf.namespace} name={activeWf.name} />);
}

function getNextScheduledTime(schedule: string, tz: string): string {
    let out = '';
    try {
        out = parser
            .parseExpression(schedule, {utc: !tz, tz})
            .next()
            .toISOString();
    } catch (e) {
        // Do nothing
    }
    return out;
}
