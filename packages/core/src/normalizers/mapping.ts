import type { NormalizationResult } from "../domain/normalizer";

export function createIdentityBoundaryMap(length: number): number[] {
  return Array.from({ length: length + 1 }, (_, index) => index);
}

function appendMappedSegment(
  output: string,
  boundaryMap: number[],
  sourceSegment: string,
  normalizedSegment: string,
  sourceStart: number,
  sourceEnd: number,
): string {
  if (normalizedSegment.length === 0) {
    boundaryMap[boundaryMap.length - 1] = sourceEnd;
    return output;
  }

  const nextOutput = output + normalizedSegment;

  if (normalizedSegment.length === sourceSegment.length) {
    for (let offset = 1; offset <= normalizedSegment.length; offset += 1) {
      boundaryMap.push(sourceStart + offset);
    }

    return nextOutput;
  }

  for (let offset = 1; offset <= normalizedSegment.length; offset += 1) {
    boundaryMap.push(
      offset === normalizedSegment.length ? sourceEnd : sourceStart,
    );
  }

  return nextOutput;
}

export function normalizeCharactersWithMapping(
  text: string,
  transform: (character: string) => string,
): NormalizationResult {
  let output = "";
  const boundaryMap = [0];
  let sourceIndex = 0;

  for (const character of text) {
    const sourceStart = sourceIndex;
    const sourceEnd = sourceStart + character.length;
    const normalizedCharacter = transform(character);

    output = appendMappedSegment(
      output,
      boundaryMap,
      character,
      normalizedCharacter,
      sourceStart,
      sourceEnd,
    );

    sourceIndex = sourceEnd;
  }

  return {
    text: output,
    boundaryMap,
  };
}

const combiningMark = /\p{M}/u;

export function normalizeCanonicalClustersWithMapping(
  text: string,
  transform: (cluster: string) => string,
): NormalizationResult {
  let output = "";
  const boundaryMap = [0];
  let cluster = "";
  let clusterStart = 0;
  let sourceIndex = 0;

  const flush = () => {
    if (!cluster) return;

    const clusterEnd = clusterStart + cluster.length;
    const normalizedCluster = transform(cluster);

    output = appendMappedSegment(
      output,
      boundaryMap,
      cluster,
      normalizedCluster,
      clusterStart,
      clusterEnd,
    );

    cluster = "";
  };

  for (const character of text) {
    const characterStart = sourceIndex;
    sourceIndex += character.length;

    if (cluster && !combiningMark.test(character)) {
      flush();
      clusterStart = characterStart;
    } else if (!cluster) {
      clusterStart = characterStart;
    }

    cluster += character;
  }

  flush();

  return {
    text: output,
    boundaryMap,
  };
}
