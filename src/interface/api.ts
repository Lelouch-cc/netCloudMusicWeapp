interface ApiHeader {
  'content-type': string;
  'token': string;
}

export interface ApiParams {
  url: string;
  data: any;
  contentType?: string;
}

export interface ApiOption {
  isShowLoading: boolean;
  loadingText: string;
  url: string;
  data: any;
  method: string;
  header: ApiHeader;
  success: Function;
  error: Function;
}
