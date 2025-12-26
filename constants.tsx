
import { ContentType, VODContent, Channel, UserProfile } from './types';

export const MOCK_USER: UserProfile = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  avatar: 'https://picsum.photos/id/64/200/200',
  isVip: true,
  expiryDate: '23/06/2024'
};

export const MOCK_CHANNELS: Channel[] = [
  { id: '1', name: 'HBO HD', logo: 'https://picsum.photos/id/1/100/100', category: 'Filmes', now_playing: 'House of the Dragon' },
  { id: '2', name: 'ESPN Brasil', logo: 'https://picsum.photos/id/2/100/100', category: 'Esportes', now_playing: 'NBA: Lakers vs Warriors' },
  { id: '3', name: 'CNN Brasil', logo: 'https://picsum.photos/id/3/100/100', category: 'Notícias', now_playing: 'Jornal da Noite' },
  { id: '4', name: 'Disney Channel', logo: 'https://picsum.photos/id/4/100/100', category: 'Infantil', now_playing: 'Mickey Mouse' },
];

export const MOCK_MOVIES: VODContent[] = [
  {
    id: 'm1',
    title: 'Duna: Parte Dois',
    poster: 'https://picsum.photos/id/10/300/450',
    backdrop: 'https://picsum.photos/id/10/1200/600',
    rating: 8.9,
    year: 2024,
    description: 'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
    type: ContentType.MOVIE,
    category: 'Ficção'
  },
  {
    id: 'm2',
    title: 'Oppenheimer',
    poster: 'https://picsum.photos/id/11/300/450',
    backdrop: 'https://picsum.photos/id/11/1200/600',
    rating: 8.8,
    year: 2023,
    description: 'A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica.',
    type: ContentType.MOVIE,
    category: 'Biografia'
  }
];

export const MOCK_SERIES: VODContent[] = [
  {
    id: 's1',
    title: 'Stranger Things',
    poster: 'https://picsum.photos/id/20/300/450',
    backdrop: 'https://picsum.photos/id/20/1200/600',
    rating: 9.2,
    year: 2022,
    description: 'Um grupo de amigos descobre mistérios sobrenaturais e forças governamentais secretas em sua pequena cidade.',
    type: ContentType.SERIES,
    category: 'Terror'
  }
];
