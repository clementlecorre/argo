import {Page} from 'argo-ui';
import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {CronWorkflow} from '../../../../models';
import {uiUrl} from '../../../shared/base';
import {ErrorNotice} from '../../../shared/components/error-notice';
import {Loading} from '../../../shared/components/loading';
import {Context} from '../../../shared/context';
import {historyUrl} from '../../../shared/history';
import {services} from '../../../shared/services';
import {CronWorkflowSummaryPanel} from '../cron-workflow-summary-panel';

require('../../../workflows/components/workflow-details/workflow-details.scss');

export const CronWorkflowDetails = (props: RouteComponentProps<any>) => {
    // boiler-plate
    const {navigation} = useContext(Context);
    const {match, history} = props;
    const [namespace] = useState(match.params.namespace);
    const [name] = useState(match.params.name);

    const [cronWorkflow, setCronWorkflow] = useState<CronWorkflow>();
    const [error, setError] = useState<Error>();

    useEffect(() => history.push(historyUrl('cron-workflows/{namespace}/{name}', {namespace, name})), [namespace, name]);

    useEffect(() => {
        services.cronWorkflows
            .get(name, namespace)
            .then(setCronWorkflow)
            .then(() => setError(null))
            .catch(setError);
    }, [namespace, name]);

    const suspendButton =
        cronWorkflow && !cronWorkflow.spec.suspend
            ? {
                  title: 'Suspend',
                  iconClassName: 'fa fa-pause',
                  action: () =>
                      services.cronWorkflows
                          .suspend(name, namespace)
                          .then(setCronWorkflow)
                          .catch(setError),
                  disabled: !cronWorkflow
              }
            : {
                  title: 'Resume',
                  iconClassName: 'fa fa-play',
                  action: () =>
                      services.cronWorkflows
                          .resume(name, namespace)
                          .then(setCronWorkflow)
                          .catch(setError),
                  disabled: !cronWorkflow || !cronWorkflow.spec.suspend
              };
    return (
        <Page
            title='Cron Workflow Details'
            toolbar={{
                actionMenu: {
                    items: [
                        {
                            title: 'Submit',
                            iconClassName: 'fa fa-plus',
                            action: () =>
                                services.workflows
                                    .submit('cronwf', name, namespace)
                                    .then(wf => navigation.goto(uiUrl(`workflows/${wf.metadata.namespace}/${wf.metadata.name}`)))
                                    .catch(setError)
                        },
                        {
                            title: 'Delete',
                            iconClassName: 'fa fa-trash',
                            action: () => {
                                if (!confirm('Are you sure you want to delete this cron workflow?\nThere is no undo.')) {
                                    return;
                                }
                                services.cronWorkflows
                                    .delete(name, namespace)
                                    .then(() => navigation.goto(uiUrl('cron-workflows')))
                                    .catch(setError);
                            }
                        },
                        suspendButton
                    ]
                },
                breadcrumbs: [
                    {
                        title: 'Cron Workflows',
                        path: uiUrl('cron-workflows')
                    },
                    {title: namespace + '/' + name}
                ]
            }}>
            <div className='argo-container'>
                <div className='workflow-details__content'>
                    <ErrorNotice error={error} />
                    {!cronWorkflow ? <Loading /> : <CronWorkflowSummaryPanel cronWorkflow={cronWorkflow} onChange={setCronWorkflow} />}
                </div>
            </div>
        </Page>
    );
};
