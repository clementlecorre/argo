import {Condition, Workflow} from '../../../../models';
import {EventSource, eventSourceTypes} from '../../../../models/event-source';
import {Sensor, triggerTypes} from '../../../../models/sensor';
import {Graph, Node} from '../../../shared/components/graph/types';
import {icons as phaseIcons} from '../../../workflows/components/workflow-dag/icons';
import {icons} from './icons';
import {ID} from './id';

const status = (r: {status?: {conditions?: Condition[]}}) => {
    if (!r.status || !r.status.conditions) {
        return '';
    }
    return !!r.status.conditions.find(c => c.status !== 'True') ? 'Pending' : 'Ready';
};

export const buildGraph = (eventSources: EventSource[], sensors: Sensor[], workflows: Workflow[], flow: {[p: string]: any}, expanded: boolean) => {
    const edgeClassNames = (id: Node) => (!!flow[id] ? 'flow' : '');
    const graph = new Graph();

    (eventSources || []).forEach(eventSource => {
        Object.entries(eventSource.spec)
            .filter(([typeKey]) => ['template', 'service'].indexOf(typeKey) < 0)
            .forEach(([typeKey, type]) => {
                Object.keys(type).forEach(key => {
                    const eventId = ID.join('EventSource', eventSource.metadata.namespace, eventSource.metadata.name, key);
                    graph.nodes.set(eventId, {type: typeKey, label: key, classNames: status(eventSource), icon: icons[eventSourceTypes[typeKey] + 'EventSource']});
                });
            });
    });

    (sensors || []).forEach(sensor => {
        const sensorId = ID.join('Sensor', sensor.metadata.namespace, sensor.metadata.name);
        graph.nodes.set(sensorId, {type: 'sensor', label: sensor.metadata.name, icon: icons.Sensor, classNames: status(sensor)});
        (sensor.spec.dependencies || []).forEach(d => {
            const eventId = ID.join('EventSource', sensor.metadata.namespace, d.eventSourceName, d.eventName);
            graph.edges.set({v: eventId, w: sensorId}, {label: d.name, classNames: edgeClassNames(eventId)});
        });
        (sensor.spec.triggers || [])
            .map(t => t.template)
            .filter(template => template)
            .forEach(template => {
                const triggerTypeKey = Object.keys(template).filter(t => ['name', 'conditions'].indexOf(t) === -1)[0];
                const triggerId = ID.join('Trigger', sensor.metadata.namespace, sensor.metadata.name, template.name);
                graph.nodes.set(triggerId, {
                    label: template.name,
                    type: triggerTypeKey,
                    classNames: status(sensor),
                    icon: icons[triggerTypes[triggerTypeKey] + 'Trigger']
                });
                if (template.conditions) {
                    const conditionsId = ID.join('Conditions', sensor.metadata.namespace, sensor.metadata.name, template.conditions);
                    graph.nodes.set(conditionsId, {
                        type: 'conditions',
                        label: template.conditions,
                        icon: icons.Conditions,
                        classNames: ''
                    });
                    graph.edges.set({v: sensorId, w: conditionsId}, {classNames: edgeClassNames(sensorId)});
                    graph.edges.set({v: conditionsId, w: triggerId}, {classNames: edgeClassNames(triggerId)});
                } else {
                    graph.edges.set({v: sensorId, w: triggerId}, {classNames: edgeClassNames(triggerId)});
                }
            });
    });

    const workflowGroups: {[triggerId: string]: Workflow[]} = {};

    (workflows || []).forEach(workflow => {
        const sensorName = workflow.metadata.labels['events.argoproj.io/sensor'];
        const triggerName = workflow.metadata.labels['events.argoproj.io/trigger'];
        if (sensorName && triggerName) {
            const triggerId = ID.join('Trigger', workflow.metadata.namespace, sensorName, triggerName);
            if (!workflowGroups[triggerId]) {
                workflowGroups[triggerId] = [];
            }
            workflowGroups[triggerId].push(workflow);
        }
    });

    Object.entries(workflowGroups).forEach(([triggerId, items]) => {
        items.forEach((workflow, i) => {
            if (expanded || items.length <= 5 || i < 2 || i >= items.length - 3) {
                const workflowId = ID.join('Workflow', workflow.metadata.namespace, workflow.metadata.name);
                const phase = workflow.metadata.labels['workflows.argoproj.io/phase'];
                graph.nodes.set(workflowId, {
                    label: workflow.metadata.name,
                    type: 'workflow',
                    icon: phaseIcons[phase] || phaseIcons.Pending,
                    classNames: phase
                });
                graph.edges.set({v: triggerId, w: workflowId}, {});
            } else {
                const workflowGroupId = ID.join('Collapsed', workflow.metadata.namespace, triggerId);
                graph.nodes.set(workflowGroupId, {
                    label: workflows.length - 5 + ' hidden workflow(s)',
                    type: 'collapsed',
                    icon: icons.Collapsed
                });
                graph.edges.set({v: triggerId, w: workflowGroupId}, {});
            }
        });
    });

    return graph;
};
