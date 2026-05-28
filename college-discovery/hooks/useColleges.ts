import { useQuery } from "@tanstack/react-query";
import { fetchColleges, fetchCollege, fetchReviews, fetchFeaturedColleges } from "@/services/api";
import { FilterState } from "@/types";

export function useColleges(filters: Partial<FilterState>, page: number) {
  return useQuery({
    queryKey: ["colleges", filters, page],
    queryFn: () => fetchColleges(filters, page),
    placeholderData: (prev) => prev,
  });
}

export function useCollege(id: string) {
  return useQuery({
    queryKey: ["college", id],
    queryFn: () => fetchCollege(id),
    enabled: !!id,
  });
}

export function useReviews(collegeId: string) {
  return useQuery({
    queryKey: ["reviews", collegeId],
    queryFn: () => fetchReviews(collegeId),
    enabled: !!collegeId,
  });
}

export function useFeaturedColleges() {
  return useQuery({
    queryKey: ["featured-colleges"],
    queryFn: fetchFeaturedColleges,
  });
}
