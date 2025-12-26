
import { AuthData, XtreamCategory, XtreamStream, XtreamSeries } from '../types';

const BASE_URL = 'https://xui.djuntemon.com';

export class XtreamService {
  private username = '';
  private password = '';

  setCredentials(u: string, p: string) {
    this.username = u;
    this.password = p;
  }

  private async request(action: string, extraParams: string = ''): Promise<any> {
    const url = `${BASE_URL}/player_api.php?username=${this.username}&password=${this.password}&action=${action}${extraParams}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`API Error (${action}):`, error);
      throw error;
    }
  }

  async login(): Promise<AuthData> {
    const url = `${BASE_URL}/player_api.php?username=${this.username}&password=${this.password}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.user_info?.status !== 'Active') {
      throw new Error(data.user_info?.status || 'Invalid credentials');
    }
    return data;
  }

  async getLiveCategories(): Promise<XtreamCategory[]> {
    return this.request('get_live_categories');
  }

  async getVodCategories(): Promise<XtreamCategory[]> {
    return this.request('get_vod_categories');
  }

  async getSeriesCategories(): Promise<XtreamCategory[]> {
    return this.request('get_series_categories');
  }

  async getLiveStreams(catId?: string): Promise<XtreamStream[]> {
    return this.request('get_live_streams', catId ? `&category_id=${catId}` : '');
  }

  async getVodStreams(catId?: string): Promise<XtreamStream[]> {
    return this.request('get_vod_streams', catId ? `&category_id=${catId}` : '');
  }

  async getVodInfo(vodId: string | number): Promise<any> {
    return this.request('get_vod_info', `&vod_id=${vodId}`);
  }

  async getSeries(catId?: string): Promise<XtreamSeries[]> {
    return this.request('get_series', catId ? `&category_id=${catId}` : '');
  }

  async getSeriesInfo(seriesId: string | number): Promise<any> {
    return this.request('get_series_info', `&series_id=${seriesId}`);
  }

  /**
   * Constrói a URL do stream.
   * Para LIVE, o formato .ts costuma ser mais resiliente em players web Xtream.
   */
  buildStreamUrl(id: string | number, type: 'live' | 'movie' | 'series'): string {
    if (type === 'live') {
      // Muitos servidores Xtream performam melhor com .ts direto no web player
      return `${BASE_URL}/live/${this.username}/${this.password}/${id}.ts`;
    }
    
    if (type === 'series') {
      return `${BASE_URL}/series/${this.username}/${this.password}/${id}.mp4`;
    }

    return `${BASE_URL}/movie/${this.username}/${this.password}/${id}.mp4`;
  }
}

export const xtream = new XtreamService();
