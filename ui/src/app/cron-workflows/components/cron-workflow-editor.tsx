import * as React from 'react';

import {Tabs} from 'argo-ui';
import {CronWorkflow} from '../../../models';
import {LabelsAndAnnotationsEditor} from '../../shared/components/editors/labels-and-annotations-editor';
import {MetadataEditor} from '../../shared/components/editors/metadata-editor';
import {WorkflowSpecEditor} from '../../shared/components/editors/workflow-spec-editor';
import {ObjectEditor} from '../../shared/components/object-editor/object-editor';
import {CronWorkflowSpecEditor} from './cron-workflow-spec-editior';
import {CronWorkflowStatusViewer} from './cron-workflow-status-viewer';

export const CronWorkflowEditor = (props: {
    cronWorkflow: CronWorkflow;
    onChange: (cronWorkflow: CronWorkflow) => void;
    onError: (error: Error) => void;
    onTabSelected?: (tab: string) => void;
    selectedTabKey?: string;
}) => {
    return (
        <Tabs
            key='tabs'
            navTransparent={true}
            selectedTabKey={props.selectedTabKey}
            onTabSelected={props.onTabSelected}
            tabs={[
                {
                    key: 'status',
                    title: 'Status',
                    content: <CronWorkflowStatusViewer spec={props.cronWorkflow.spec} status={props.cronWorkflow.status} />
                },
                {
                    key: 'cron',
                    title: 'Cron',
                    content: <CronWorkflowSpecEditor spec={props.cronWorkflow.spec} onChange={spec => props.onChange({...props.cronWorkflow, spec})} />
                },
                {
                    key: 'metadata',
                    title: 'MetaData',
                    content: <MetadataEditor value={props.cronWorkflow.metadata} onChange={metadata => props.onChange({...props.cronWorkflow, metadata})} />
                },
                {
                    key: 'workflow',
                    title: 'Workflow',
                    content: (
                        <WorkflowSpecEditor
                            value={props.cronWorkflow.spec.workflowSpec}
                            onChange={workflowSpec => props.onChange({...props.cronWorkflow, spec: {...props.cronWorkflow.spec, workflowSpec}})}
                            onError={props.onError}
                        />
                    )
                },
                {
                    key: 'workflow-metadata',
                    title: 'Workflow MetaData',
                    content: (
                        <LabelsAndAnnotationsEditor
                            value={props.cronWorkflow.spec.workflowMetadata}
                            onChange={workflowMetadata =>
                                props.onChange({
                                    ...props.cronWorkflow,
                                    spec: {...props.cronWorkflow.spec, workflowMetadata}
                                })
                            }
                        />
                    )
                },
                {
                    key: 'manifest',
                    title: 'Manifest',
                    content: (
                        <ObjectEditor
                            type='io.argoproj.workflow.v1alpha1.CronWorkflow'
                            value={props.cronWorkflow}
                            onChange={cronWorkflow => props.onChange({...cronWorkflow})}
                            onError={props.onError}
                        />
                    )
                }
            ]}
        />
    );
};
