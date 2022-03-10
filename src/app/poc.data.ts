import { IInitialNodeData } from './interfaces';

export const NodeDimensions = {
  width: '120px',
  height: '30px',
};

export const initialData: IInitialNodeData[] = [
  {
    id: 'dd51e6398fc3f957a6c13105d6735ce3',
    name: 'Node a',
    metadata: { example: 'Node a metadata' },
    type: 'TypeA',
  },
  {
    id: '2ae45203fc5f4321e02709616a4b4a66',
    name: 'Node B',
    metadata: { example: 'Node a metadata' },
    type: 'TypeA',
  },
  {
    id: 'b8c3079d38c28431a5e4ccb939ea3018',
    name: 'Node C',
    metadata: { example: 'Node a metadata' },
    type: 'TypeA',
  },
  {
    id: 'b8c3079d38c28431a5e4ccb939ea3333',
    name: 'Node D',
    metadata: { example: 'Node a metadata' },
    type: 'TypeB',
  },
];
