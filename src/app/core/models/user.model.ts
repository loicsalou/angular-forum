// TODO à voir avec Manu: on a pas toutes les données utilisées par le forum de base (username et image)
export interface User {
  id: string;
  lang: string;
  login: string;
  username?: string;
  image?: string;
}
