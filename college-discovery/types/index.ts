export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  type: "Government" | "Private" | "Deemed";
  established: number;
  ranking: number;
  rating: number;
  reviewCount: number;
  fees: {
    btech: number;
    mtech: number;
    mba: number;
  };
  placements: {
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
    topRecruiters: string[];
  };
  courses: string[];
  facilities: string[];
  image: string;
  logo: string;
  description: string;
  accreditation: string[];
  website: string;
  phone: string;
  email: string;
  isSaved?: boolean;
}

export interface Review {
  id: string;
  collegeId: string;
  author: string;
  rating: number;
  course: string;
  year: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
  createdAt: string;
}

export interface FilterState {
  search: string;
  type: string[];
  state: string[];
  minFees: number;
  maxFees: number;
  minRating: number;
  courses: string[];
  sortBy: "ranking" | "rating" | "fees_asc" | "fees_desc" | "name";
}

export interface CompareStore {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

export interface SavedStore {
  savedColleges: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export interface FilterStore {
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}
