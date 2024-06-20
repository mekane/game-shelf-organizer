import { Test, TestingModule } from '@nestjs/testing';
import { BggService } from './bgg.service';

const acceptedXml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<message>
	Your request for this collection has been accepted and will be processed.  Please try again later for access.
</message>`;
const acceptedResponse: Response = {
  status: 202,
  statusText: 'Accepted',
  text: () => Promise.resolve(acceptedXml),
} as Response;

const invalidUserMessage = 'Invalid username specified';
const invalidUsernameXml = `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<errors>
    <error>
        <message>${invalidUserMessage}</message>
    </error>
</errors>`;
const invalidUsernameResponse: Response = {
  status: 200,
  statusText: 'OK',
  text: () => Promise.resolve(invalidUsernameXml),
} as Response;

const successfulXml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<items totalitems="2" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse" pubdate="Wed, 19 Jun 2024 22:00:24 0000">
    <item objecttype="thing" objectid="373167" subtype="boardgame" collid="119697058">
        <name sortindex="1">20 Strong</name>
        <yearpublished>2023</yearpublished>
        <image>https://images.com/original/img/pic7720772.png</image>
        <thumbnail>https://images.com/thumb/img/pic7720772.png</thumbnail>
        <stats minplayers="1"																	maxplayers="1"																	minplaytime="30"																	maxplaytime="40"																	playingtime="40"																	numowned="4823" >
            <rating value="N/A">
                <usersrated value="1378" />
                <average value="7.56821" />
                <bayesaverage value="6.2738" />
                <stddev value="1.47153" />
                <median value="0" />
                <ranks>
                    <rank type="subtype" id="1" name="boardgame" friendlyname="Board Game Rank" value="1776" bayesaverage="6.2738" />
                    <rank type="family" id="5497" name="strategygames" friendlyname="Strategy Game Rank" value="909" bayesaverage="6.41036" />
                </ranks>
            </rating>
        </stats>
        <status own="1" prevowned="0" fortrade="0" want="0" wanttoplay="0" wanttobuy="0" wishlist="0"  preordered="0" lastmodified="2024-05-28 17:01:33" />
        <numplays>7</numplays>
    </item>
    <item objecttype="thing" objectid="2094" subtype="boardgame" collid="18569655">
        <name sortindex="1">4 First Games</name>
        <image>https://images.com/original/img/pic2601726.jpg</image>
        <thumbnail>https://images.com/thumb/img/pic2601726.jpg</thumbnail>
        <stats minplayers="2"																	maxplayers="6"																	minplaytime="10"																	maxplaytime="15"																	playingtime="15"																	numowned="277" >
            <rating value="5">
                <usersrated value="127" />
                <average value="4.84882" />
                <bayesaverage value="5.45672" />
                <stddev value="1.80318" />
                <median value="0" />
                <ranks>
                    <rank type="subtype" id="1" name="boardgame" friendlyname="Board Game Rank" value="25792" bayesaverage="5.45672" />
                </ranks>
            </rating>
        </stats>
        <status own="0" prevowned="1" fortrade="0" want="0" wanttoplay="0" wanttobuy="0" wishlist="0"  preordered="0" lastmodified="2022-04-01 12:03:58" />
        <numplays>19</numplays>
        <comment>Comment 2</comment>
    </item>
</items>`;
const successfulResponse = {
  status: 200,
  statusText: 'OK',
  text: () => Promise.resolve(successfulXml),
} as unknown as Response;

describe('BggService', () => {
  let service: BggService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BggService],
    }).compile();

    service = module.get<BggService>(BggService);
  });

  describe('fetch bgg xml data', () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    it('calls the bgg api and a status if accepted', async () => {
      mockFetch.mockResolvedValueOnce(acceptedResponse);

      const result = await service.fetchCollectionData('testBggName');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('testBggName'),
      );
      expect(result).toEqual({
        status: 202,
        message: 'Accepted',
        data: '',
      });
    });

    it('calls the bgg api and returns the xml results as text', async () => {
      mockFetch.mockResolvedValueOnce(successfulResponse);

      const result = await service.fetchCollectionData('testBggName');

      expect(result).toEqual({
        status: 200,
        message: 'Success',
        data: successfulXml,
      });
    });

    it('returns error results if the request was invalid', async () => {
      mockFetch.mockResolvedValueOnce(invalidUsernameResponse);

      const result = await service.fetchCollectionData('invalid');

      expect(result).toEqual({
        status: 400,
        message: invalidUserMessage,
        data: '',
      });
    });
  });

  describe('parse bgg xml data', () => {
    it('returns an empty array for invalid xml', () => {
      expect(service.parseCollectionData('')).toEqual([]);
      expect(service.parseCollectionData('1')).toEqual([]);
      expect(service.parseCollectionData('foobar')).toEqual([]);
      expect(service.parseCollectionData('[<item></item>]')).toEqual([]);
      expect(service.parseCollectionData('{}')).toEqual([]);
      expect(service.parseCollectionData('<errors></errors>')).toEqual([]);
    });

    //it handles broken xml? missing end tags?

    it('parses the items in the results and returns object', () => {
      const result = service.parseCollectionData(successfulXml);

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
          yearPublished: undefined,
        },
      ]);
    });
  });
});
