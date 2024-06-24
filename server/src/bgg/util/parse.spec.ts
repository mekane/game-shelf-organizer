import { parseCollectionData } from './parse';
import { duplicateXml, parsedDuplicateData, successfulXml } from './test.xml';

describe('parsing bgg xml data', () => {
  it('returns an empty array for invalid xml', () => {
    expect(parseCollectionData('')).toEqual([]);
    expect(parseCollectionData('1')).toEqual([]);
    expect(parseCollectionData('foobar')).toEqual([]);
    expect(parseCollectionData('[<item></item>]')).toEqual([]);
    expect(parseCollectionData('{}')).toEqual([]);
    expect(parseCollectionData('<errors></errors>')).toEqual([]);
  });

  //it handles broken xml? missing end tags?

  it('parses the items in the results and returns object', () => {
    const result = parseCollectionData(successfulXml);

    expect(result).toEqual([
      {
        bggId: '373167',
        bggRank: '1776',
        bggRating: '6.2738',
        imageUrl: 'https://images.com/original/img/pic7720772.png',
        name: '20 Strong',
        owned: true,
        plays: '7',
        previouslyOwned: false,
        rating: 'N/A',
        thumbnailUrl: 'https://images.com/thumb/img/pic7720772.png',
        yearPublished: '2023',
        versionId: '',
        versionName: '',
        length: 'unknown',
        width: 'unknown',
        depth: 'unknown',
      },
      {
        bggId: '2094',
        bggRank: '25792',
        bggRating: '5.45672',
        imageUrl: 'https://images.com/original/img/pic2601726.jpg',
        name: '4 First Games',
        owned: false,
        plays: '19',
        previouslyOwned: true,
        rating: '5',
        thumbnailUrl: 'https://images.com/thumb/img/pic2601726.jpg',
        yearPublished: '2000',
        versionId: '179671',
        versionName: 'English-only edition',
        length: '13.25',
        width: '9',
        depth: '2.25',
      },
    ]);
  });

  it('removes duplicate items, keeping the most recent by default', () => {
    const result = parseCollectionData(duplicateXml);
    expect(result).toEqual(parsedDuplicateData);
  });
});
