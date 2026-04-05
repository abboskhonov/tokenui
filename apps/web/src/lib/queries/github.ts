import { useQuery } from "@tanstack/react-query"

interface GitHubRepoInfo {
  stargazers_count: number
}

export function useGitHubStars(repo: string) {
  return useQuery({
    queryKey: ["github-stars", repo],
    queryFn: async () => {
      const response = await fetch(`https://api.github.com/repos/${repo}`)
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub stars")
      }
      const data = await response.json() as GitHubRepoInfo
      return data.stargazers_count
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })
}
