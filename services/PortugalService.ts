
import { ReiChannel } from '../types';

/**
 * LISTA DE TESTE PORTUGAL + EXTRAS - 6 CANAIS PARA VALIDAÇÃO
 * Adicionado canal Globo Bahia conforme solicitação.
 */
const PT_CHANNELS: ReiChannel[] = [
  {
    name: '1. RTP Internacional (Global)',
    folder: 'Portugal Teste',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/RTP_Internacional_Logo_2016.svg/250px-RTP_Internacional_Logo_2016.svg.png',
    stream: 'https://rtp-pull-live.m7.rtp.pt/liverepeater/rtpi_5_8.smil/playlist.m3u8'
  },
  {
    name: '2. Euronews em Português',
    folder: 'Portugal Teste',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Euronews_logo_2016.svg/1200px-Euronews_logo_2016.svg.png',
    stream: 'https://euronews-portuguese.m7.pt/liverepeater/euronews_portuguese_5_8.smil/playlist.m3u8'
  },
  {
    name: '3. Globo Bahia (Novo)',
    folder: 'Destaques Teste',
    cover: 'https://logodownload.org/wp-content/uploads/2014/05/globo-logo-0.png',
    stream: 'https://rdcanais.top/globoba'
  },
  {
    name: '4. AR TV (Parlamento)',
    folder: 'Portugal Teste',
    cover: 'https://upload.wikimedia.org/wikipedia/pt/4/4b/Logo_ARTV.png',
    stream: 'https://artv-live.m7.rtp.pt/liverepeater/artv.smil/playlist.m3u8'
  },
  {
    name: '5. Kuriakos TV HD',
    folder: 'Portugal Teste',
    cover: 'https://kuriakos-tv.com/wp-content/uploads/2021/05/logo_ktv_site.png',
    stream: 'https://live.kuriakos.com/live/stream/playlist.m3u8'
  },
  {
    name: '6. Canal Alentejo',
    folder: 'Portugal Teste',
    cover: 'https://rtmp.canalalentejo.pt/logo.png',
    stream: 'https://rtmp.canalalentejo.pt/live/canalalentejo/playlist.m3u8'
  },
  {
    name: 'RTP 1 HD (Bloqueio Regional)',
    folder: 'Portugal',
    cover: 'https://logos-world.net/wp-content/uploads/2021/10/RTP-1-Logo.png',
    stream: 'https://rtp-pull-live.m7.rtp.pt/liverepeater/rtp1_5_8.smil/playlist.m3u8'
  },
  {
    name: 'RTP 2 HD (Bloqueio Regional)',
    folder: 'Portugal',
    cover: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/RTP2_Logo_2016.svg/250px-RTP2_Logo_2016.svg.png',
    stream: 'https://rtp-pull-live.m7.rtp.pt/liverepeater/rtp2_5_8.smil/playlist.m3u8'
  }
];

export class PortugalService {
  async getChannels(): Promise<ReiChannel[]> {
    return PT_CHANNELS;
  }
}

export const portugalService = new PortugalService();
