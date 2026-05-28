import { College, FilterState, Review } from "@/types";
import { MOCK_COLLEGES, MOCK_REVIEWS } from "@/lib/data";

// Simulates network delay for realistic UX
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchColleges(
  filters: Partial<FilterState>,
  page = 1,
  pageSize = 6
): Promise<CollegesResponse> {
  await delay(400);

  let colleges = [...MOCK_COLLEGES];

  // Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase();
    colleges = colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }

  // Type filter
  if (filters.type && filters.type.length > 0) {
    colleges = colleges.filter((c) => filters.type!.includes(c.type));
  }

  // State filter
  if (filters.state && filters.state.length > 0) {
    colleges = colleges.filter((c) => filters.state!.includes(c.state));
  }

  // Rating filter
  if (filters.minRating && filters.minRating > 0) {
    colleges = colleges.filter((c) => c.rating >= filters.minRating!);
  }

  // Fees filter
  if (filters.maxFees && filters.maxFees < 1000000) {
    colleges = colleges.filter((c) => c.fees.btech <= filters.maxFees!);
  }

  // Courses filter
  if (filters.courses && filters.courses.length > 0) {
    colleges = colleges.filter((c) =>
      filters.courses!.some((course) => c.courses.includes(course))
    );
  }

  // Sorting
  switch (filters.sortBy) {
    case "ranking":
      colleges.sort((a, b) => a.ranking - b.ranking);
      break;
    case "rating":
      colleges.sort((a, b) => b.rating - a.rating);
      break;
    case "fees_asc":
      colleges.sort((a, b) => a.fees.btech - b.fees.btech);
      break;
    case "fees_desc":
      colleges.sort((a, b) => b.fees.btech - a.fees.btech);
      break;
    case "name":
      colleges.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const total = colleges.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedColleges = colleges.slice(start, start + pageSize);

  return { colleges: paginatedColleges, total, page, totalPages };
}

export async function fetchCollege(id: string): Promise<College | null> {
  await delay(300);
  return MOCK_COLLEGES.find((c) => c.id === id) || null;
}

export async function fetchReviews(collegeId: string): Promise<Review[]> {
  await delay(300);
  return MOCK_REVIEWS.filter((r) => r.collegeId === collegeId);
}

export async function fetchFeaturedColleges(): Promise<College[]> {
  await delay(300);
  return MOCK_COLLEGES.slice(0, 4);
}
