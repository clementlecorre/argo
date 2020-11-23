import * as React from 'react';
import {WorkflowSpec} from '../../../../models';
import {GraphPanel} from '../graph/graph-panel';
import {genres} from './genres';
import {workflowSpecGraph} from './workflow-spec-graph';

export const WorkflowSpecPanel = (props: {spec: WorkflowSpec; selectedId?: string; onSelect?: (id: string) => void}) => {
    return (
        <GraphPanel
            storageScope='workflow-spec'
            graph={workflowSpecGraph(props.spec)}
            selectedNode={props.selectedId}
            onNodeSelect={id => props.onSelect && props.onSelect(id)}
            horizontal={true}
            nodeGenres={genres}
            iconShapes={{
                when: 'circle',
                withItems: 'circle',
                withParam: 'circle',
                withSequence: 'circle',
                container: 'circle',
                script: 'circle',
                resource: 'circle'
            }}
        />
    );
};
