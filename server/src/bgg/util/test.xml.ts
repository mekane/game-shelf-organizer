const acceptedXml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<message>
	Your request for this collection has been accepted and will be processed.  Please try again later for access.
</message>`;
export const acceptedResponse: Response = {
  status: 202,
  statusText: 'Accepted',
  text: () => Promise.resolve(acceptedXml),
} as Response;

export const invalidUserMessage = 'Invalid username specified';
const invalidUsernameXml = `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<errors>
    <error>
        <message>${invalidUserMessage}</message>
    </error>
</errors>`;
export const invalidUsernameResponse: Response = {
  status: 200,
  statusText: 'OK',
  text: () => Promise.resolve(invalidUsernameXml),
} as Response;

export const successfulXml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
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
        <version>
            <item type="boardgameversion" id="179671">
                <link type="boardgameversion" id="2094" value="4 First Games" inbound="true"/>
                <name type="primary" sortindex="1" value="English-only edition" />
                <link type="boardgamepublisher" id="34" value="Ravensburger" />
                <yearpublished value="2000" />
                <productcode value="22185" />
                <width value="9" />
                <length value="13.25" />
                <depth value="2.25" />
                <weight value="0" />
                <link type="language" id="2184" value="English" />
            </item>
        </version>
        <comment>Comment 2</comment>
    </item>
</items>`;
export const successfulResponse = {
  status: 200,
  statusText: 'OK',
  text: () => Promise.resolve(successfulXml),
} as unknown as Response;

export const duplicateXml = `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<items totalitems="2" termsofuse="https://boardgamegeek.com/xmlapi/termsofuse" pubdate="Wed, 19 Jun 2024 22:00:24 0000">
    <item objecttype="thing" objectid="699" subtype="boardgame" collid="18468888">
        <name sortindex="1">HeroQuest</name>
        <yearpublished>1990</yearpublished>
        <image>https://cf.geekdo-images.com/VsHvMURvwTvn-Es3BHkTrg__original/img/8D9GJc2iTnB727RVfTDNM0_sm2c=/0x0/filters:format(jpeg)/pic432523.jpg</image>
        <thumbnail>https://cf.geekdo-images.com/VsHvMURvwTvn-Es3BHkTrg__thumb/img/H77OR77G9tb4R074O3G1C8BKz3w=/fit-in/200x150/filters:strip_icc()/pic432523.jpg</thumbnail>
        <stats minplayers="2"																	maxplayers="5"																	minplaytime="90"																	maxplaytime="90"																	playingtime="90"																	numowned="24494" >
            <rating value="7.5">
                <usersrated value="13787" />
                <average value="7.2023" />
                <bayesaverage value="6.83178" />
                <stddev value="1.59934" />
                <median value="0" />
                <ranks>
                    <rank type="subtype" id="1" name="boardgame" friendlyname="Board Game Rank" value="660" bayesaverage="6.83178" />
                    <rank type="family" id="5496" name="thematic" friendlyname="Thematic Rank" value="196" bayesaverage="6.84118" />
                </ranks>
            </rating>
        </stats>
        <status own="1" prevowned="0" fortrade="0" want="0" wanttoplay="0" wanttobuy="0" wishlist="0"  preordered="0" lastmodified="2024-06-20 21:46:07" />
        <numplays>31</numplays>
        <version>
            <item type="boardgameversion" id="28137">
                <thumbnail>https://cf.geekdo-images.com/VsHvMURvwTvn-Es3BHkTrg__thumb/img/H77OR77G9tb4R074O3G1C8BKz3w=/fit-in/200x150/filters:strip_icc()/pic432523.jpg</thumbnail>
                <image>https://cf.geekdo-images.com/VsHvMURvwTvn-Es3BHkTrg__original/img/8D9GJc2iTnB727RVfTDNM0_sm2c=/0x0/filters:format(jpeg)/pic432523.jpg</image>
                <link type="boardgameversion" id="699" value="HeroQuest" inbound="true"/>
                <name type="primary" sortindex="1" value="English (US) edition 1990" />
                <link type="boardgamepublisher" id="20" value="Milton Bradley" />
                <link type="boardgameartist" id="979" value="Gary Chalk" />
                <link type="boardgameartist" id="12498" value="Les Edwards" />
                <yearpublished value="1990" />
                <productcode value="4271" />
                <width value="12.5" />
                <length value="20" />
                <depth value="2" />
                <weight value="3.5274" />
                <link type="language" id="2184" value="English" />
            </item>
        </version>
        <comment>Provided hours of fun as a kid. Made my brother and cousin play through so many levels. Had endless fun making up new items, character classes, and levels. Made up my own character sheets and map templates on the computer too.</comment>
    </item>
    <item objecttype="thing" objectid="699" subtype="boardgame" collid="87344357">
        <name sortindex="1">HeroQuest</name>
        <yearpublished>2022</yearpublished>
        <image>https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__original/img/FvYaNQJLXa_xnW6Pz4bM4QhMQvM=/0x0/filters:format(jpeg)/pic5676212.jpg</image>
        <thumbnail>https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__thumb/img/aX66kuy84pnBa8Sxlwn8Hcqq2yo=/fit-in/200x150/filters:strip_icc()/pic5676212.jpg</thumbnail>
        <stats minplayers="2"																	maxplayers="5"																	minplaytime="90"																	maxplaytime="90"																	playingtime="90"																	numowned="24494" >
            <rating value="7">
                <usersrated value="13787" />
                <average value="7.2023" />
                <bayesaverage value="6.83178" />
                <stddev value="1.59934" />
                <median value="0" />
                <ranks>
                    <rank type="subtype" id="1" name="boardgame" friendlyname="Board Game Rank" value="660" bayesaverage="6.83178" />
                    <rank type="family" id="5496" name="thematic" friendlyname="Thematic Rank" value="196" bayesaverage="6.84118" />
                </ranks>
            </rating>
        </stats>
        <status own="1" prevowned="0" fortrade="0" want="0" wanttoplay="1" wanttobuy="0" wishlist="0"  preordered="0" lastmodified="2022-02-09 08:01:18" />
        <numplays>31</numplays>
        <version>
            <item type="boardgameversion" id="528304">
                <thumbnail>https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__thumb/img/aX66kuy84pnBa8Sxlwn8Hcqq2yo=/fit-in/200x150/filters:strip_icc()/pic5676212.jpg</thumbnail>
                <image>https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__original/img/FvYaNQJLXa_xnW6Pz4bM4QhMQvM=/0x0/filters:format(jpeg)/pic5676212.jpg</image>
                <link type="boardgameversion" id="699" value="HeroQuest" inbound="true"/>
                <name type="primary" sortindex="1" value="English edition" />
                <link type="boardgamepublisher" id="4871" value="Avalon Hill" />
                <link type="boardgamepublisher" id="51" value="Hasbro" />
                <link type="boardgameartist" id="92163" value="Max Dunbar" />
                <yearpublished value="2022" />
                <productcode value="F2847" />
                <width value="12" />
                <length value="16" />
                <depth value="5.25" />
                <weight value="6.7241" />
                <link type="language" id="2184" value="English" />
            </item>
        </version>
        <comment>Backed it on Haslab. New HQ.</comment>
    </item>
</items>`;

export const parsedDuplicateData = [
  {
    name: 'HeroQuest',
    rating: '7.5',
    plays: '31',
    bggId: '699',
    bggRank: '660',
    bggRating: '6.83178',
    imageUrl:
      'https://cf.geekdo-images.com/VsHvMURvwTvn-Es3BHkTrg__original/img/8D9GJc2iTnB727RVfTDNM0_sm2c=/0x0/filters:format(jpeg)/pic432523.jpg',
    thumbnailUrl:
      'https://cf.geekdo-images.com/VsHvMURvwTvn-Es3BHkTrg__thumb/img/H77OR77G9tb4R074O3G1C8BKz3w=/fit-in/200x150/filters:strip_icc()/pic432523.jpg',
    yearPublished: '1990',
    owned: true,
    previouslyOwned: false,
    versionId: '28137',
    versionName: 'English (US) edition 1990',
    width: '12.5',
    length: '20',
    depth: '2',
  },
  {
    name: 'HeroQuest',
    rating: '7',
    plays: '31',
    bggId: '699',
    bggRank: '660',
    bggRating: '6.83178',
    imageUrl:
      'https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__original/img/FvYaNQJLXa_xnW6Pz4bM4QhMQvM=/0x0/filters:format(jpeg)/pic5676212.jpg',
    thumbnailUrl:
      'https://cf.geekdo-images.com/v695lqCTLA_PU6fBHmfXCA__thumb/img/aX66kuy84pnBa8Sxlwn8Hcqq2yo=/fit-in/200x150/filters:strip_icc()/pic5676212.jpg',
    yearPublished: '2022',
    owned: true,
    previouslyOwned: false,
    versionId: '528304',
    versionName: 'English edition',
    width: '12',
    length: '16',
    depth: '5.25',
  },
];
