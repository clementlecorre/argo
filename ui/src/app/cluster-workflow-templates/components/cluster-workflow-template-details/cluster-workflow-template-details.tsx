import {NotificationType, Page} from 'argo-ui';
import {SlidingPanel} from 'argo-ui/src/index';
import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import {ClusterWorkflowTemplate} from '../../../../models';
import {uiUrl} from '../../../shared/base';
import {ErrorNotice} from '../../../shared/components/error-notice';
import {Loading} from '../../../shared/components/loading';
import {Context} from '../../../shared/context';
import {historyUrl} from '../../../shared/history';
import {services} from '../../../shared/services';
import {Utils} from '../../../shared/utils';
import {SubmitWorkflowPanel} from '../../../workflows/components/submit-workflow-panel';
import {ClusterWorkflowTemplateEditor} from '../cluster-workflow-template-editor';

require('../../../workflows/components/workflow-details/workflow-details.scss');

export const ClusterWorkflowTemplateDetails = (props: RouteComponentProps<any>) => {
    // boiler-plate
    const {navigation, notifications} = useContext(Context);
    const {match, location, history} = props;
    const queryParams = new URLSearchParams(location.search);

    const name = match.params.name;
    const [namespace, setNamespace] = useState<string>();
    const [error, setError] = useState<Error>();
    const [sidePanel, setSidePanel] = useState(queryParams.get('sidePanel'));

    const [template, setTemplate] = useState<ClusterWorkflowTemplate>();

    useEffect(() => {
        history.push(historyUrl('cluster-workflow-templates/{name}', {name, sidePanel}));
    }, [sidePanel]);

    useEffect(() => {
        services.clusterWorkflowTemplate
            .get(name)
            .then(setTemplate)
            .catch(setError);
    }, []);

    useEffect(() => {
        services.info
            .getInfo()
            .then(info => setNamespace(info.managedNamespace || Utils.getCurrentNamespace() || 'default'))
            .catch(setError);
    }, []);

    const deleteClusterWorkflowTemplate = () => {
        if (!confirm('Are you sure you want to delete this cluster workflow template?\nThere is no undo.')) {
            return;
        }
        services.clusterWorkflowTemplate
            .delete(name)
            .then(() => navigation.goto(uiUrl('cluster-workflow-templates')))
            .catch(setError);
    };

    return (
        <Page
            title='Cluster Workflow Template Details'
            toolbar={{
                actionMenu: {
                    items: [
                        {
                            title: 'Submit',
                            iconClassName: 'fa fa-plus',
                            action: () => setSidePanel('new')
                        },
                        {
                            title: 'Update',
                            iconClassName: 'fa fa-save',
                            action: () => {
                                services.clusterWorkflowTemplate
                                    .update(template, name)
                                    .then(setTemplate)
                                    .then(() => setError(null))
                                    .then(() => {
                                        notifications.show({
                                            content: 'Updated',
                                            type: NotificationType.Success
                                        });
                                    })
                                    .catch(setError);
                            }
                        },
                        {
                            title: 'Delete',
                            iconClassName: 'fa fa-trash',
                            action: () => deleteClusterWorkflowTemplate()
                        }
                    ]
                },
                breadcrumbs: [
                    {
                        title: 'Cluster Workflow Template',
                        path: uiUrl('cluster-workflow-templates')
                    },
                    {title: name}
                ]
            }}>
            <>
                <ErrorNotice error={error} />
                {!template ? <Loading /> : <ClusterWorkflowTemplateEditor template={template} onChange={setTemplate} onError={setError} />}
            </>
            {template && (
                <SlidingPanel isShown={sidePanel !== null} onClose={() => setSidePanel(null)}>
                    <SubmitWorkflowPanel
                        kind='ClusterWorkflowTemplate'
                        namespace={namespace}
                        name={template.metadata.name}
                        entrypoint={template.spec.entrypoint}
                        entrypoints={(template.spec.templates || []).map(t => t.name)}
                        parameters={template.spec.arguments.parameters || []}
                    />
                </SlidingPanel>
            )}
        </Page>
    );
};
