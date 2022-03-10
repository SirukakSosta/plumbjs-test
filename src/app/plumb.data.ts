import { BezierConnector } from '@jsplumb/connector-bezier';

export const STYLES = {
  connectorPaintStyle: {
    strokeWidth: 2,
    stroke: '#b4bdc5',
    joinstyle: 'round',
    outlineStroke: 'transparent',
    outlineWidth: 2,
  },
  connectorHoverStyle: {
    // strokeWidth: 2,
    stroke: '#90989f',
  },
  endpointStyle: {
    stroke: '#9e9e9e',
    fill: '#ffffff',
    strokeWidth: 1,
  },

  endpointHoverStyle: {
    stroke: '#00cdea',
    fill: '#00cdea',
  },
};

export const TARGET_END_POINT = {
  cssClass: 'targetPoint',
  target: true,
  endpoint: 'Dot',
  paintStyle: {
    stroke: '#00cdea',
    fill: '#FFF',
    radius: 4,
    strokeWidth: 2,
  },
  // hoverPaintStyle: endpointHoverStyle,
  maxConnections: 1,
  dropOptions: { hoverClass: 'hover', activeClass: 'active' },
};

export const SOURCE_END_POINT = {
  cssClass: 'sourcePoint',
  source: true,
  endpoint: 'Dot',
  maxConnections: -1,
  paintStyle: {
    stroke: '#00cdea',
    fill: '#FFF',
    radius: 4,
    strokeWidth: 2,
  },
  connector: {
    type: BezierConnector.type,
    options: {
      curviness: 25,
      gap: 8,
      cornerRadius: 50,
      alwaysRespectStubs: true,
    },
  },
  connectorStyle: STYLES.connectorPaintStyle,
  hoverPaintStyle: STYLES.endpointHoverStyle,
  connectorHoverStyle: STYLES.connectorPaintStyle,
  dragOptions: {},
};
