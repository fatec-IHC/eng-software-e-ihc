export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
  role: 'Atendente' | 'Padeiro' | 'Gerente';
};

export type User = {
  id: string;
  email?: string;
  profile: Profile;
};
