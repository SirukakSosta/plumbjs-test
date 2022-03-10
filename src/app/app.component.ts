import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import * as PlumbUi from '@jsplumb/browser-ui';
import { EVENT_CONNECTION_CLICK } from '@jsplumb/browser-ui';
import { BezierConnector } from '@jsplumb/connector-bezier';
import { AnchorComputeParams, AnchorRecord } from '@jsplumb/core';
import { IInitialNodeData, IWorkSpaceData } from './interfaces';
import { SOURCE_END_POINT, STYLES, TARGET_END_POINT } from './plumb.data';
import { generateWorkspaceData, saveData } from './plumb.helper';
import { initialData } from './poc.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {
  private jsPlumbInstance!: PlumbUi.BrowserJsPlumbInstance;
  private styles = STYLES;
  private targetEndpoint = TARGET_END_POINT;
  private sourceEndpoint = SOURCE_END_POINT;

  public initalNodes = initialData;

  public get storageIsEmpty(): boolean {
    return !localStorage.getItem('workspace');
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.init();
  }
  public save(): void {
    const exsistingNodes = this.jsPlumbInstance.getManagedElements();
    const exsistingConnections = this.jsPlumbInstance.connections;
    const workspacedata = generateWorkspaceData(
      exsistingConnections,
      exsistingNodes
    );
    saveData(workspacedata);
  }

  public load(): void {
    let savedData!: IWorkSpaceData;
    try {
      savedData = JSON.parse(localStorage.getItem('workspace') as string);
      if (!savedData) return;
    } catch (error) {
      alert(JSON.stringify(error));
    }

    const { nodes, connections } = savedData;
    nodes.forEach((node) => {
      const {
        id,
        position: { x, y },
      } = node;
      // based on inital data populate by id. This is going to change later
      // and fetch nodes from rest api
      const populatedNode = this.initalNodes.find(
        (initalNode) => initalNode.id === id
      );
      this.insertItem(populatedNode!, x, y);
    });
    connections.forEach((connection) => {
      const source = document.getElementById(connection.sourceId) as Element;
      const target = document.getElementById(connection.targetId) as Element;
      this.createConnection(source, target);
    });
  }

  public dropItem(event: any) {
    console.log('event', event);
    event.preventDefault();
    const d = JSON.parse(event.dataTransfer.getData('node-data'));
    console.log('Dropeed', d);
    this.insertItem(d, event.clientX, event.clientY);
  }
  public allowDrop(event: any) {
    event.preventDefault();
    // console.log('allowDrop', data);
  }
  public drag(event: any, node: any): void {
    event.dataTransfer.setData('node-data', JSON.stringify(node));
    // if (ev.type === 'touchstart') {
    //   this.editor.mobile_item_selec = ev.target
    //     .closest('.drag-drawflow')
    //     .getAttribute('data-node');
    // } else {
    //   ev.dataTransfer.setData('node', ev.target.getAttribute('data-node'));
    // }
  }
  // public addDynamicNode(node: any) {
  // <app-node [nodes]="nodes"></app-node>
  // https://medium.com/@priyeshayadav9192/creating-a-dynamic-flow-diagram-using-jsplumb-with-angular-ec1f317f892a
  //   const factory =
  //     this.factoryResolver.resolveComponentFactory(DynamicNodeComponent);
  //   const component = factory.create(this.rootViewContainer.parentInjector);
  //   (<any>component.instance).node = node;
  //   (<any>component.instance).jsPlumbInstance = this.jsPlumbInstance;
  //   this.rootViewContainer.insert(component.hostView);
  // }
  public generateNode(
    node: IInitialNodeData,
    x: number,
    y: number
  ): HTMLDivElement {
    const newNode = document.createElement('div');
    newNode.id = node.id;
    newNode.classList.add('node');
    newNode.style.left = `${x}px`;
    newNode.style.top = `${y}px`;

    const innerNodeContainer = document.createElement('div');
    innerNodeContainer.classList.add('node-container');

    const spanTitle = document.createElement('span');
    spanTitle.innerText = node.name;

    const closeDiv = document.createElement('div');
    closeDiv.classList.add('close');
    closeDiv.innerText = 'x';
    closeDiv.addEventListener('click', () => {
      this.removeNode(node.id);
    });
    // click = "removeNode('ts-2')";
    innerNodeContainer.appendChild(spanTitle);
    innerNodeContainer.appendChild(closeDiv);
    newNode.appendChild(innerNodeContainer);
    return newNode;
  }
  public insertItem(node: IInitialNodeData, x: number = 202, y: number = 200) {
    this.generateNode(node, x, y);
    const item = this.generateNode(node, x, y);
    const container = this.jsPlumbInstance.getContainer();
    container.appendChild(item);
    this.createEndPoints(item);
  }

  // For every new node create only two endpoints (left and right)
  private createEndPoints(element: HTMLElement) {
    const endpoints: any[] = [
      {
        anchor: 'Right',
        meta: this.sourceEndpoint,
        cssClass: 'right-anchor',
      },
      {
        anchor: 'Left',
        meta: this.targetEndpoint,
        cssClass: 'left-anchor',
      },
    ];

    endpoints.forEach((endpoint) => {
      this.jsPlumbInstance.addEndpoint(element, {
        ...endpoint.meta,
        cssClass: endpoint.cssClass,
        anchor: endpoint.anchor,
      });
    });
  }
  public removeNode(elemId: string): void {
    // TODO: After Remove element still exsists in plumb instance
    const element = document.getElementById(elemId) as HTMLElement;
    this.jsPlumbInstance.deleteConnectionsForElement(element);
    this.jsPlumbInstance.getManagedElement(elemId).remove();
    this.jsPlumbInstance.removeAllEndpoints(element);
    this.jsPlumbInstance._removeElement(element);
  }
  private async init() {
    const container = document.getElementById('diagram') as HTMLElement;
    this.jsPlumbInstance = PlumbUi.newInstance({
      container,
      connector: {
        type: BezierConnector.type,
        options: {
          stub: 150,
          gap: 100,
          curviness: 50,
          cornerRadius: 50,
          alwaysRespectStubs: true,
        },
      },
      connectionOverlays: [
        {
          type: 'Arrow',
          options: {
            location: 1,
            visible: true,
            width: 8,
            length: 8,
            id: 'ARROW',
          },
        },
      ],
      dragOptions: {
        containment: PlumbUi.ContainmentType.parent,
        drag: (a: any) => {
          // TODO: Add Throttle || DEbounce - Autosave Option
          // console.log('dtag', a);
        },
      },
    });
    this.jsPlumbInstance.bind('connection', (info) => {
      console.log('new CONNECTION', info);
    });
    this.jsPlumbInstance.bind(EVENT_CONNECTION_CLICK, (p: any) => {
      console.log('Connection Clicked', p);
    });

    // Generate a list of nodes
    // Generate target and source endpoints for each node
    // Attach Connections Based on load data.
  }

  private createConnection(sourceElement: Element, targetElement: Element) {
    this.jsPlumbInstance.connect({
      source: sourceElement,
      target: targetElement,
      anchors: ['Right', 'Left'],

      endpoint: 'Blank',
      paintStyle: this.styles.connectorPaintStyle,
      hoverPaintStyle: this.styles.connectorHoverStyle,

      connector: {
        type: BezierConnector.type,
        options: {
          stub: 150,
          gap: 100,
          curviness: 25,
          cornerRadius: 50,
          alwaysRespectStubs: true,
        },
      },
      overlays: [
        {
          type: 'Arrow',
          options: {
            location: 1,
            visible: true,
            width: 8,
            length: 8,
            id: 'ARROW',
          },
        },
      ],
    });
    // const con = this.jsPlumbInstance.connect({
    //   data: {},
    //   source: sourceNode,
    //   target: ep2,
    //   // connector: {
    //   //   type: BezierConnector.type,
    //   //   options: {
    //   //     curviness: 25,
    //   //     gap: 8,
    //   //     cornerRadius: 50,
    //   //     alwaysRespectStubs: true,
    //   //   },
    //   // },
    //   paintStyle: { stroke: '#10D8A1', strokeWidth: 1 },
    //   // overlays: [
    //   //   // { type: 'Label', options: { label: 'Connection 2', location: 0.5 } },
    //   //   {
    //   //     type: 'Arrow',
    //   //     options: {
    //   //       location: 0.9,
    //   //       id: 'ARROW',
    //   //       width: 8,
    //   //       length: 8,
    //   //     },
    //   //   },
    //   // ],
    // });
    // con.bind('mouseenter', (conn) => {
    //   conn.addOverlay([
    //     'Label',
    //     { label: 'label', location: 0.5, id: 'connLabel' },
    //   ]);
    // });
    // con.bind('mouseenter', (conn) => {
    //   conn.addOverlay([
    //     'Label',
    //     { label: 'label', location: 0.5, id: 'connLabel' },
    //   ]);
    // });
  }
}
