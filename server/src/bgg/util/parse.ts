import { ElementCompact, xml2js } from 'xml-js';
import { BggGameData, BggRank, BggXmlItem } from '../types';

export function parseCollectionData(xml: string): BggGameData[] {
  try {
    const root: ElementCompact = xml2js(xml, { compact: true, trim: true });
    //   const totalItems = root.items._attributes?.totalitems;
    //   console.log(`Root list says ${totalItems} total items`);

    return root.items?.item.map(xmlItemToBggGameData) ?? [];
  } catch (e) {
    console.error('Error parsing collection XML', e);
    return [];
  }
}

function xmlItemToBggGameData(obj: BggXmlItem): BggGameData {
  const rankData = obj.stats?.rating?.ranks?.rank;

  let rank: BggRank | undefined;
  if (Array.isArray(rankData)) {
    rank = rankData.find((r) => r._attributes.name === 'boardgame');
  } else {
    rank = rankData;
  }

  const version = obj.version?.item ?? {};

  let yearPublished = obj.yearpublished?._text;
  if (!yearPublished) {
    yearPublished = version.yearpublished?._attributes?.value ?? 'unknown';
  }

  return {
    name: obj.name?._text,
    rating: obj.stats?.rating?._attributes?.value,
    plays: obj.numplays?._text,
    bggId: obj._attributes?.objectid,
    bggRank: rank?._attributes?.value ?? 'unknown',
    bggRating: rank?._attributes?.bayesaverage ?? 'unknown',
    imageUrl: obj.image?._text,
    thumbnailUrl: obj.thumbnail?._text,
    yearPublished,
    owned: obj.status._attributes.own === '1',
    previouslyOwned: obj.status._attributes.prevowned === '1',
    versionId: version._attributes?.id ?? '',
    versionName: version.name?._attributes?.value ?? '',
    width: version.width?._attributes?.value ?? 'unknown',
    length: version.length?._attributes?.value ?? 'unknown',
    depth: version.depth?._attributes?.value ?? 'unknown',
  };
}
