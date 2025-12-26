
export enum ContentType {
  LIVE = 'LIVE',
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
  KIDS = 'KIDS'
}

export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number | string;
  stream_icon: string;
  category_id: string;
  added: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  thumbnail?: string;
  rating?: string;
  year?: string;
  plot?: string;
}

export interface ReiChannel {
  name: string;
  folder: string;
  cover: string;
  stream: string;
}

export interface XtreamSeries {
  num: number;
  name: string;
  series_id: number | string;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  last_modified: string;
  rating: string;
  category_id: string;
}

export interface XtreamEpisode {
  id: string;
  episode_num: number;
  title: string;
  container_extension: string;
  info: {
    movie_image?: string;
    plot?: string;
    duration?: string;
    rating?: string;
  };
}

export interface XtreamSeriesInfo {
  info: XtreamSeries;
  episodes: {
    [seasonNum: string]: XtreamEpisode[];
  };
}

export interface AuthData {
  user_info: {
    username: string;
    status: string;
    exp_date: string;
  };
  server_info: any;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  isVip?: boolean;
  expiryDate?: string;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  now_playing: string;
}

export interface VODContent {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  description: string;
  type: ContentType;
  category: string;
}
