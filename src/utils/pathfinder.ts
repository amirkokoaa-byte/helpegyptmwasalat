import { Station, TransitLine, FareBracket, RouteResult, RouteStep } from '../types/transit';
import { calculateDynamicPrice } from './pricing';

interface GraphEdge {
  toStationId: string;
  weight: number;
  isTransfer: boolean;
}

export function buildTransitGraph(stations: Station[]) {
  const adjacencyList = new Map<string, GraphEdge[]>();
  const stationMap = new Map<string, Station>();

  stations.forEach((st) => {
    stationMap.set(st.id, st);
    adjacencyList.set(st.id, []);
  });

  // Group stations by line
  const lineMap = new Map<string, Station[]>();
  stations.forEach((st) => {
    if (!lineMap.has(st.lineId)) {
      lineMap.set(st.lineId, []);
    }
    lineMap.get(st.lineId)!.push(st);
  });

  // Connect adjacent stations in the same line
  lineMap.forEach((lineStations, lineId) => {
    // Sort by order
    const sorted = [...lineStations].sort((a, b) => a.order - b.order);

    if (lineId === 'metro_line_3') {
      // Line 3 has branches after Kit Kat (order 23)
      // Main trunk: 1 to 23
      for (let i = 0; i < sorted.length; i++) {
        const cur = sorted[i];
        if (cur.order < 23) {
          const next = sorted.find((s) => s.order === cur.order + 1);
          if (next) {
            addEdge(adjacencyList, cur.id, next.id, 1, false);
            addEdge(adjacencyList, next.id, cur.id, 1, false);
          }
        } else if (cur.order === 23) {
          // Kit Kat connects to North branch start (order 24: Sudan)
          // and South branch start (order 30: Tawfikiya)
          const northStart = sorted.find((s) => s.order === 24);
          const southStart = sorted.find((s) => s.order === 30);
          if (northStart) {
            addEdge(adjacencyList, cur.id, northStart.id, 1, false);
            addEdge(adjacencyList, northStart.id, cur.id, 1, false);
          }
          if (southStart) {
            addEdge(adjacencyList, cur.id, southStart.id, 1, false);
            addEdge(adjacencyList, southStart.id, cur.id, 1, false);
          }
        } else if (cur.order >= 24 && cur.order < 29) {
          // North branch: 24 to 29
          const next = sorted.find((s) => s.order === cur.order + 1);
          if (next) {
            addEdge(adjacencyList, cur.id, next.id, 1, false);
            addEdge(adjacencyList, next.id, cur.id, 1, false);
          }
        } else if (cur.order >= 30 && cur.order < 34) {
          // South branch: 30 to 34
          const next = sorted.find((s) => s.order === cur.order + 1);
          if (next) {
            addEdge(adjacencyList, cur.id, next.id, 1, false);
            addEdge(adjacencyList, next.id, cur.id, 1, false);
          }
        }
      }
    } else {
      // Standard linear line
      for (let i = 0; i < sorted.length - 1; i++) {
        const a = sorted[i];
        const b = sorted[i + 1];
        addEdge(adjacencyList, a.id, b.id, 1, false);
        addEdge(adjacencyList, b.id, a.id, 1, false);
      }
    }
  });

  // Cross-line interchange connections (stations with identical names or marked interchanges in the same transport mode)
  // Group stations by name within the same mode (e.g. Shohadaa on Line 1 and Line 2)
  const normalize = (s: string) => s.replace(/[إأآا]/g, 'ا').trim();
  const nameMap = new Map<string, Station[]>();
  stations.forEach((st) => {
    const key = `${st.modeId}:${normalize(st.name)}`;
    if (!nameMap.has(key)) {
      nameMap.set(key, []);
    }
    nameMap.get(key)!.push(st);
  });

  nameMap.forEach((sameNameStations) => {
    if (sameNameStations.length > 1) {
      for (let i = 0; i < sameNameStations.length; i++) {
        for (let j = i + 1; j < sameNameStations.length; j++) {
          const a = sameNameStations[i];
          const b = sameNameStations[j];
          // Transfer edge weight is slightly higher than 0 to reflect interchange walking time (e.g., 1.5)
          addEdge(adjacencyList, a.id, b.id, 1.5, true);
          addEdge(adjacencyList, b.id, a.id, 1.5, true);
        }
      }
    }
  });

  return { adjacencyList, stationMap };
}

function addEdge(
  adjacencyList: Map<string, GraphEdge[]>,
  fromId: string,
  toId: string,
  weight: number,
  isTransfer: boolean
) {
  const edges = adjacencyList.get(fromId) || [];
  if (!edges.some((e) => e.toStationId === toId)) {
    edges.push({ toStationId: toId, weight, isTransfer });
    adjacencyList.set(fromId, edges);
  }
}

// Find shortest path using Dijkstra
export function findShortestPath(
  startStationId: string,
  endStationId: string,
  allStations: Station[],
  allLines: TransitLine[],
  fareBrackets: FareBracket[]
): RouteResult | null {
  const startStation = allStations.find((s) => s.id === startStationId);
  const endStation = allStations.find((s) => s.id === endStationId);

  if (!startStation || !endStation) return null;

  // Filter stations by the mode of startStation
  const modeStations = allStations.filter((s) => s.modeId === startStation.modeId);
  const { adjacencyList, stationMap } = buildTransitGraph(modeStations);

  // If start is end
  if (startStation.id === endStation.id || (startStation.name === endStation.name && startStation.lineId === endStation.lineId)) {
    return {
      startStation,
      endStation,
      totalStations: 0,
      estimatedMinutes: 0,
      fare: 0,
      path: [
        {
          station: startStation,
          lineId: startStation.lineId,
          isStart: true,
          isEnd: true,
        },
      ],
      transfers: [],
      appliedBracket: null,
    };
  }

  // Dijkstra data structures
  const distances = new Map<string, number>();
  const previous = new Map<string, { stationId: string; isTransfer: boolean } | null>();
  const visited = new Set<string>();

  modeStations.forEach((s) => {
    distances.set(s.id, Infinity);
    previous.set(s.id, null);
  });

  distances.set(startStation.id, 0);

  // Priority queue (simple min-distance array for small graph)
  const queue: string[] = modeStations.map((s) => s.id);

  while (queue.length > 0) {
    // Pick unvisited node with lowest distance
    queue.sort((a, b) => (distances.get(a) ?? Infinity) - (distances.get(b) ?? Infinity));
    const currentId = queue.shift()!;

    if ((distances.get(currentId) ?? Infinity) === Infinity) break;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    // If reached end
    const currentStation = stationMap.get(currentId);
    if (currentId === endStation.id || (currentStation && currentStation.name === endStation.name && currentStation.lineId === endStation.lineId)) {
      break;
    }

    const neighbors = adjacencyList.get(currentId) || [];
    for (const edge of neighbors) {
      if (visited.has(edge.toStationId)) continue;

      const alt = (distances.get(currentId) ?? Infinity) + edge.weight;
      if (alt < (distances.get(edge.toStationId) ?? Infinity)) {
        distances.set(edge.toStationId, alt);
        previous.set(edge.toStationId, { stationId: currentId, isTransfer: edge.isTransfer });
      }
    }
  }

  // Reconstruct path to endStation.id or any station with the same name if on that line
  let targetId = endStation.id;
  if (!previous.get(targetId) && endStation.name) {
    // Check if another station with the same name was reached
    const alternative = modeStations.find(
      (s) => s.name === endStation.name && (distances.get(s.id) ?? Infinity) < Infinity
    );
    if (alternative) {
      targetId = alternative.id;
    }
  }

  if ((distances.get(targetId) ?? Infinity) === Infinity) {
    return null; // No path found
  }

  const rawPath: { station: Station; isTransferFromPrev: boolean }[] = [];
  let curr: string | null = targetId;

  while (curr) {
    const st = stationMap.get(curr);
    if (!st) break;
    const prevInfo = previous.get(curr);
    rawPath.unshift({
      station: st,
      isTransferFromPrev: prevInfo?.isTransfer ?? false,
    });
    curr = prevInfo ? prevInfo.stationId : null;
  }

  if (rawPath.length === 0) return null;

  // Build RouteSteps and detect transfers
  const path: RouteStep[] = [];
  const transfers: RouteResult['transfers'] = [];
  let physicalStationHops = 0;

  for (let i = 0; i < rawPath.length; i++) {
    const currentItem = rawPath[i];
    const prevItem = i > 0 ? rawPath[i - 1] : null;
    const nextItem = i < rawPath.length - 1 ? rawPath[i + 1] : null;

    const isStart = i === 0;
    const isEnd = i === rawPath.length - 1;

    // A transfer occurs if current item is a transfer edge or lineId changes
    const isTransferNode =
      (nextItem && nextItem.station.name === currentItem.station.name && nextItem.station.lineId !== currentItem.station.lineId) ||
      (prevItem && prevItem.station.name === currentItem.station.name && prevItem.station.lineId !== currentItem.station.lineId);

    // If it's not a pure interchange edge with 0 physical movement, count as station hop
    if (prevItem && prevItem.station.name !== currentItem.station.name) {
      physicalStationHops++;
    }

    // Direction calculation for the current line
    let direction = '';
    const line = allLines.find((l) => l.id === currentItem.station.lineId);
    if (line) {
      // Determine direction by seeing if the next station on the same line has a higher or lower order
      if (nextItem && nextItem.station.lineId === currentItem.station.lineId) {
        direction = nextItem.station.order > currentItem.station.order ? `باتجاه ${line.terminalB}` : `باتجاه ${line.terminalA}`;
      } else if (prevItem && prevItem.station.lineId === currentItem.station.lineId) {
        direction = currentItem.station.order > prevItem.station.order ? `باتجاه ${line.terminalB}` : `باتجاه ${line.terminalA}`;
      } else {
        direction = `باتجاه ${line.terminalB}`;
      }
    }

    if (
      nextItem &&
      nextItem.station.name === currentItem.station.name &&
      nextItem.station.lineId !== currentItem.station.lineId
    ) {
      const toLine = allLines.find((l) => l.id === nextItem.station.lineId);
      transfers.push({
        stationName: currentItem.station.name,
        fromLineId: currentItem.station.lineId,
        toLineId: nextItem.station.lineId,
        direction: toLine ? `التبديل إلى ${toLine.name}` : 'تبديل الخط',
      });
    }

    // Deduplicate consecutive identical station names in visual timeline to keep it clean
    if (prevItem && prevItem.station.name === currentItem.station.name) {
      // Mark previous item as transfer
      if (path.length > 0) {
        path[path.length - 1].isTransfer = true;
        path[path.length - 1].transferToLineId = currentItem.station.lineId;
      }
      continue;
    }

    path.push({
      station: currentItem.station,
      lineId: currentItem.station.lineId,
      isStart,
      isEnd,
      direction,
      isTransfer: Boolean(isTransferNode),
      transferToLineId: isTransferNode && nextItem ? nextItem.station.lineId : undefined,
    });
  }

  // Count total stations visited: minimum 1
  const totalStations = Math.max(1, physicalStationHops);

  // Time estimate: ~2.2 minutes per station + 5 minutes per transfer
  const estimatedMinutes = Math.round(totalStations * 2.2 + transfers.length * 5);

  // Fare calculation based on dynamic price calculation function
  const modeBrackets = fareBrackets.filter((b) => b.modeId === startStation.modeId);
  const dynamicPrice = calculateDynamicPrice(startStation.modeId, totalStations, modeBrackets);
  const fare = dynamicPrice.price;

  let appliedBracket: FareBracket | null = null;
  const foundBracket = modeBrackets.find(
    (b) => totalStations >= b.minStations && totalStations <= b.maxStations
  );

  if (foundBracket) {
    appliedBracket = foundBracket;
  } else {
    appliedBracket = {
      id: `dynamic_tier_${dynamicPrice.tierIndex}`,
      modeId: startStation.modeId,
      minStations: 1,
      maxStations: totalStations,
      price: dynamicPrice.price,
      label: dynamicPrice.label,
    };
  }

  return {
    startStation,
    endStation,
    totalStations,
    estimatedMinutes,
    fare,
    path,
    transfers,
    appliedBracket,
  };
}
