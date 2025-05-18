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
  versionName: string | null;
  collection: Collection;
  yearPublished: number | null;
  bggRank: number | null;
  bggRating: number | null;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  length: number | null;
  width: number | null;
  depth: number | null;
  owned: boolean;
  previouslyOwned: boolean;
  plays: number;
  rating: number;
}

export interface Collection {
  id: number;
  user: User;
  name: string;
  games: Game[];
}

export interface List {
  id: number;
  user: User;
  name: string;
  games: Game[];
}

export interface Shelf {
  id: number;
  user: User;
  name: string;
}

export interface AnylistOptions {
  hide: object;
  ratingMax: number;
}

export interface AnylistColumns {
  id: string;
  name: string;
  rating: number;
  notes: string;
  thumbnail: string;
}

export interface Anylist {
  id: number;
  user: User;
  name: string;
  optionsSerialized: string;
  options: AnylistOptions;
  dataSerialized: string;
  data: AnylistColumns[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bggUserName: string;
  password: string;
  isAdmin: boolean;
  collections: Collection[];
  lists: List[];
  shelves: Shelf[];
  anylists: Anylist[];
}

export interface CreateListDto {
  name: string;
  games: object[];
}

export type UpdateListDto = object;

export interface CreateShelfDto {
  name: string;
  width?: number;
  height?: number;
  rows?: number;
  columns?: number;
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

export interface CreateAnylistDto {
  id: number;
  name: string;
  options: AnylistOptions;
  data: AnylistColumns[];
}

export interface AnylistDto {
  id: number;
  name: string;
  options: AnylistOptions;
  data: AnylistColumns[];
}

export interface UpdateAnylistDto {
  id: number;
  name: string;
  options: AnylistOptions;
  data: AnylistColumns[];
}

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
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
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
      }, new FormData()),
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
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
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
     */
    collectionControllerGet: (params: RequestParams = {}) =>
      this.request<Collection, any>({
        path: `/collection`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Collection
     * @name CollectionControllerSync
     * @request POST:/collection/sync
     */
    collectionControllerSync: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/collection/sync`,
        method: "POST",
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
     */
    listControllerCreate: (data: CreateListDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/list`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerFindAll
     * @request GET:/list
     */
    listControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/list`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerFindOne
     * @request GET:/list/{id}
     */
    listControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<List, any>({
        path: `/list/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags List
     * @name ListControllerUpdate
     * @request PATCH:/list/{id}
     */
    listControllerUpdate: (
      id: string,
      data: UpdateListDto,
      params: RequestParams = {},
    ) =>
      this.request<List, any>({
        path: `/list/${id}`,
        method: "PATCH",
        body: data,
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
     */
    listControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/list/${id}`,
        method: "DELETE",
        format: "json",
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
     */
    shelfControllerCreate: (data: CreateShelfDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shelf`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerFindAll
     * @request GET:/shelf
     */
    shelfControllerFindAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shelf`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerFindOne
     * @request GET:/shelf/{id}
     */
    shelfControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shelf/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerUpdate
     * @request PATCH:/shelf/{id}
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
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Shelf
     * @name ShelfControllerRemove
     * @request DELETE:/shelf/{id}
     */
    shelfControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/shelf/${id}`,
        method: "DELETE",
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
  anylist = {
    /**
     * No description
     *
     * @tags Anylist
     * @name AnylistControllerCreate
     * @request POST:/anylist
     * @secure
     */
    anylistControllerCreate: (
      data: CreateAnylistDto,
      params: RequestParams = {},
    ) =>
      this.request<AnylistDto, any>({
        path: `/anylist`,
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
     * @tags Anylist
     * @name AnylistControllerFindAll
     * @request GET:/anylist
     * @secure
     */
    anylistControllerFindAll: (params: RequestParams = {}) =>
      this.request<AnylistDto[], any>({
        path: `/anylist`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Anylist
     * @name AnylistControllerFindOne
     * @request GET:/anylist/{id}
     * @secure
     */
    anylistControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<AnylistDto, any>({
        path: `/anylist/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Anylist
     * @name AnylistControllerUpdate
     * @request PATCH:/anylist/{id}
     * @secure
     */
    anylistControllerUpdate: (
      id: string,
      data: UpdateAnylistDto,
      params: RequestParams = {},
    ) =>
      this.request<AnylistDto, any>({
        path: `/anylist/${id}`,
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
     * @tags Anylist
     * @name AnylistControllerRemove
     * @request DELETE:/anylist/{id}
     * @secure
     */
    anylistControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/anylist/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
