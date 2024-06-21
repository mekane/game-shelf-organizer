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
  versionName: string;
  length: string;
  width: string;
  depth: string;
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

export interface BggVersionLink {
  _attributes: {
    type: string;
    id: string;
    value: string;
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
  version: {
    item: {
      _attributes: {
        type: string;
        id: string;
      };
      link: BggVersionLink | BggVersionLink[];
      name: {
        _attributes: {
          type: string;
          sortindex: string;
          value: string;
        };
      };
      yearpublished: {
        _attributes: {
          value: string;
        };
      };
      productcode: {
        _attributes: {
          value: string;
        };
      };
      width: {
        _attributes: {
          value: string;
        };
      };
      length: {
        _attributes: {
          value: string;
        };
      };
      depth: {
        _attributes: {
          value: string;
        };
      };
      weight: {
        _attributes: {
          value: string;
        };
      };
    };
  };
  yearpublished: {
    _text: string;
  };
}
