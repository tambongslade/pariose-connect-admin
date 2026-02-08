export interface User {
  code: number;
  username: string;
  noms: string;
  prenoms: string;
  date_naissance: Date;
  contact_1: string;
  contact_2: string;
  addresse: string;
  date_creation: Date;
  date_modification: Date;
  roles: Role[];
}

export interface Role {
  code: number;
  nom: string;
  description: string;
}

export interface Activity {
  code: number;
  libelle: string;
  date_activite: Date;
  description: string;
  frequence: string;
  date_debut: Date;
  date_fin: Date;
  statut: number;
  lieu: string;
  code_unite_ecclesiale: number;
  code_type_activite: number;
  date_creation: Date;
  date_modification: Date;
}

export interface Celebration {
  code: number;
  libelle: string;
  granularite: string;
  code_horaire: string;
  code_type: string;
  code_unite_ecclesiale: number;
  date_creation: Date;
  date_modification: Date;
}

export interface Announcement {
  code: number;
  titre: string;
  contenu: string;
  code_type: number;
  code_unite_ecclesiale: number;
  date_publication: Date;
  date_expiration: Date;
  statut: number;
  date_creation: Date;
  date_modification: Date;
}

export interface DashboardStats {
  totalDonations: number;
  totalDonationsChange: number;
  activeMembers: number;
  activeMembersChange: number;
  upcomingEvents: number;
  upcomingEventsChange: number;
  newMembers: number;
  newMembersChange: number;
}
