
import { ReiChannel } from '../types';

const REI_API_URL = 'https://api.reidoscanais.io/channels';

export class ReiService {
  private cache: ReiChannel[] | null = null;
  private lastFetch: number = 0;
  private TTL = 1000 * 60 * 30; // 30 minutos

  async getChannels(): Promise<ReiChannel[]> {
    if (this.cache && (Date.now() - this.lastFetch < this.TTL)) {
      return this.cache;
    }

    try {
      const response = await fetch(REI_API_URL);
      if (!response.ok) throw new Error('Falha ao conectar com Rei dos Canais');
      const data = await response.json();
      
      // A API retorna um array de canais diretamente
      this.cache = Array.isArray(data) ? data : [];
      this.lastFetch = Date.now();
      return this.cache;
    } catch (error) {
      console.error("Erro ReiService:", error);
      return this.cache || []; // Retorna cache mesmo expirado se a rede falhar
    }
  }
}

export const reiService = new ReiService();
