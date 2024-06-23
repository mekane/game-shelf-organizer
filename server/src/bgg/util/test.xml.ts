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
