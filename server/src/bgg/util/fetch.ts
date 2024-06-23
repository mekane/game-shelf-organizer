import { ElementCompact, xml2js } from 'xml-js';
import { BggDataFetchResult } from '../types';

/**
 * Makes initial API call, which can queue up and return a 202
 * In this case the system needs to pause and try again in a little while
 * at which point the status should be a 200 and data will be available.
 * Note that the BGG api returns status 200 with an error message in case
 * something went wrong, so we have to check for that and parse it specially.
 * @param bggUsername required
 */
export async function fetchCollectionData(
  bggUsername: string,
): Promise<BggDataFetchResult> {
  const response = await fetch(getBggCollectionUrl(bggUsername));

  if (response.status === 200) {
    const xml = await response.text();

    if (xml.match('<errors>')) {
      const error = parseError(xml);
      return {
        status: 400,
        message: error,
        data: '',
      };
    }

    return {
      status: 200,
      message: 'Success',
      data: xml,
    };
  } else {
    return {
      status: response.status,
      message: response.statusText,
      data: '',
    };
  }
}

function getBggCollectionUrl(user: string): string {
  return `https://boardgamegeek.com/xmlapi2/collection?excludesubtype=boardgameexpansion&played=1&stats=1&version=1&username=${user}`;
}

function parseError(xml: string): string {
  const json: ElementCompact = xml2js(xml, { compact: true, trim: true });
  return json['errors']?.error?.message?._text;
}
