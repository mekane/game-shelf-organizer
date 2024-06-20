export interface BggDataFetchResult {
  status: number;
  message: string;
  data: string;
}

export interface BggGameData {
  bggId: string;
  bggRank: string;
  bggRating: string;
  imageUrl: string;
  name: string;
  plays: string;
  rating: string;
  thumbnailUrl: string;
  yearPublished: string;
  owned: boolean;
  previouslyOwned: boolean;
}

export type BggXmlBoolean = '0' | '1';

export interface BggRank {
  _attributes: {
    type: string;
    id: string;
    name: string;
    friendlyname: string;
    value: string;
    bayesaverage: string;
  };
}

export interface BggXmlItem {
  _attributes: {
    collid: string;
    objectid: string;
    objecttype: string;
    subtype: string;
  };
  image: {
    _text: string;
  };
  name: {
    _attributes: {
      sortindex: string;
    };
    _text: string;
  };
  numplays: {
    _text: string;
  };
  stats: {
    _attributes: {
      minplayers: string;
      maxplayers: string;
      minplaytime: string;
      maxplaytime: string;
      playingtime: string;
      numowned: string;
    };
    rating: {
      _attributes: {
        value: string;
      };
      usersrated: {
        _attributes: {
          value: string;
        };
      };
      average: {
        _attributes: {
          value: string;
        };
      };
      bayesaverage: {
        _attributes: {
          value: string;
        };
      };
      stddev: {
        _attributes: {
          value: string;
        };
      };
      median: {
        _attributes: {
          value: string;
        };
      };
      ranks: {
        rank: BggRank | BggRank[];
      };
    };
  };
  status: {
    _attributes: {
      lastmodified: string;
      fortrade: BggXmlBoolean;
      own: BggXmlBoolean;
      preordered: BggXmlBoolean;
      prevowned: BggXmlBoolean;
      want: BggXmlBoolean;
      wanttobuy: BggXmlBoolean;
      wanttoplay: BggXmlBoolean;
      wishlist: BggXmlBoolean;
    };
  };
  thumbnail: {
    _text: string;
  };
  yearpublished: {
    _text: string;
  };
}
