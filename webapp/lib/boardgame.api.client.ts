/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Game {
  userId: number;
  bggId: number;
  versionId: number;
  name: string;
  /** @default null */
  versionName: string | null;
  collection: Collection;
  /** @default null */
  yearPublished: number | null;
  /** @default null */
  bggRank: number | null;
  /** @default null */
  bggRating: number | null;
  /** @default null */
  imageUrl: string | null;
  /** @default null */
  thumbnailUrl: string | null;
  /** @default null */
  length: number | null;
  /** @default null */
  width: number | null;
  /** @default null */
  depth: number | null;
  /** @default null */
  customLength: number | null;
  /** @default null */
  customWidth: number | null;
  /** @default null */
  customDepth: number | null;
  /** @default true */
  showInCollection?: boolean;
  /** @default false */
  owned: boolean;
  /** @default false */
  previouslyOwned: boolean;
  /** @default 0 */
  plays: number;
  /** @default 0 */
  rating: number;
}

export interface Collection {
  id: number;
  user: User;
  name: string;
  lastSyncDate?: string;
  games: Game[];
}

export interface ListColumnConfig {
  id: string;
  type: string;
  field: string;
  header: string;
  width?: number;
}

export interface List {
  id: number;
  user: User;
  /** @default "" */
  name: string;
  games: Game[];
  configSerialized?: string;
  config: ListColumnConfig[];
}

export interface SizeDto {
  width: number;
  height: number;
}

export interface RoomDto {
  size: SizeDto;
}

export interface PositionDto {
  x: number;
  y: number;
}

export interface GridDto {
  rows: number;
  columns: number;
}

export interface BorderSizeDto {
  outer: number;
  inner: number;
}

export interface ShelfDto {
  id: number;
  label?: string;
  position: PositionDto;
  grid: GridDto;
  cellSize: SizeDto;
  borders?: BorderSizeDto;
}

export interface Shelf {
  id: number;
  user: User;
  /** @default "" */
  name: string;
  roomSerialized?: string;
  room: RoomDto;
  shelvesSerialized?: string;
  shelves: ShelfDto[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  /** @default "" */
  bggUserName: string;
  password: string;
  /** @default false */
  isAdmin: boolean;
  collections: Collection[];
  lists: List[];
  shelves: Shelf[];
}

export interface GameId {
  bggId: number;
  versionId: number;
}

export interface CreateListDto {
  /**
   * Ids of games to link for inclusion in the list
   * @default []
   */
  games: GameId[];
  /** @default "" */
  name: string;
}

export type UpdateListDto = object;

export interface UpdateGameDto {
  /**
   * @min 1
   * @max 99
   */
  customLength?: number;
  /**
   * @min 1
   * @max 99
   */
  customWidth?: number;
  /**
   * @min 1
   * @max 99
   */
  customDepth?: number;
  showInCollection?: boolean;
}

export interface CreateShelfDto {
  name: string;
  room: RoomDto;
  shelves: ShelfDto[];
}

export type UpdateShelfDto = object;

export type UserLoginDto = object;

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  bggUserName: string;
  password: string;
  isAdmin?: boolean;
}

export type UpdateUserDto = object;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Board Game API
 * @version 1.0.0
 * @contact
 *
 * API Docs
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags App
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/`,
      method: "GET",
      format: "json",
      ...params,
    });

  collection = {
    /**
     * No description
     *
     * @tags Collection
     * @name CollectionControllerGet
     * @request GET:/collection
     * @secure
     */
    collectionControllerGet: (params: RequestParams = {}) =>
      this.request<Collection, any>({
        path: `/collection`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Collection
     * @name CollectionControllerSync
     * @request POST:/collection/sync
     * @secure
     */
    collectionControllerSync: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collection/sync`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  list = {
    /**
     * No description
     *
     * @tags List
     * @name ListControllerCreate
     * @request POST:/list
     * @secure
     */
    listControllerCreate: (data: CreateListDto, params: RequestParams = {}) =>
      this.request<List, any>({
        path: `/list`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerFindAll
     * @request GET:/list
     * @secure
     */
    listControllerFindAll: (params: RequestParams = {}) =>
      this.request<List[], any>({
        path: `/list`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerFindOne
     * @request GET:/list/{id}
     * @secure
     */
    listControllerFindOne: (id: number, params: RequestParams = {}) =>
      this.request<List, any>({
        path: `/list/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerUpdate
     * @request PATCH:/list/{id}
     * @secure
     */
    listControllerUpdate: (
      id: number,
      data: UpdateListDto,
      params: RequestParams = {},
    ) =>
      this.request<List, any>({
        path: `/list/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerRemove
     * @request DELETE:/list/{id}
     * @secure
     */
    listControllerRemove: (id: number, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/list/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  games = {
    /**
     * No description
     *
     * @tags Games
     * @name GamesControllerFindOne
     * @request GET:/games/{bggId}/{versionId}
     * @secure
     */
    gamesControllerFindOne: (
      bggId: number,
      versionId: number,
      params: RequestParams = {},
    ) =>
      this.request<Game, any>({
        path: `/games/${bggId}/${versionId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Games
     * @name GamesControllerUpdate
     * @request PATCH:/games/{bggId}/{versionId}
     * @secure
     */
    gamesControllerUpdate: (
      bggId: number,
      versionId: number,
      data: UpdateGameDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/games/${bggId}/${versionId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  shelf = {
    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerCreate
     * @request POST:/shelf
     * @secure
     */
    shelfControllerCreate: (data: CreateShelfDto, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/shelf`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerFindAll
     * @request GET:/shelf
     * @secure
     */
    shelfControllerFindAll: (params: RequestParams = {}) =>
      this.request<Shelf[], any>({
        path: `/shelf`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerFindOne
     * @request GET:/shelf/{id}
     * @secure
     */
    shelfControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<Shelf, any>({
        path: `/shelf/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerUpdate
     * @request PATCH:/shelf/{id}
     * @secure
     */
    shelfControllerUpdate: (
      id: string,
      data: UpdateShelfDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/shelf/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerRemove
     * @request DELETE:/shelf/{id}
     * @secure
     */
    shelfControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shelf/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerLogin
     * @request POST:/users/login
     */
    usersControllerLogin: (data: UserLoginDto, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerCreate
     * @request POST:/users
     */
    usersControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindAll
     * @request GET:/users
     */
    usersControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerFindOne
     * @request GET:/users/{id}
     */
    usersControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerUpdate
     * @request PATCH:/users/{id}
     */
    usersControllerUpdate: (
      id: string,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/users/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersControllerRemove
     * @request DELETE:/users/{id}
     */
    usersControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
}
