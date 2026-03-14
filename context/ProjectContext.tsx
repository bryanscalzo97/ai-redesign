import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Project, RedesignEntry } from "@/types/project";
import * as ProjectStorage from "@/lib/project-storage";

export interface ProjectContextValue {
  projects: Project[];
  isLoading: boolean;
  refreshProjects: () => Promise<void>;
  createProject: (name: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  addRedesignToProject: (
    projectId: string,
    data: {
      roomType: string;
      style: string;
      guestType?: string;
      customInstructions?: string;
      beforeBase64: string;
      afterBase64: string;
      listingText?: string;
    }
  ) => Promise<RedesignEntry>;
  updateRedesignListingText: (
    projectId: string,
    redesignId: string,
    text: string
  ) => Promise<void>;
  deleteRedesign: (projectId: string, redesignId: string) => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextValue>({
  projects: [],
  isLoading: true,
  refreshProjects: async () => {},
  createProject: async () => ({} as Project),
  deleteProject: async () => {},
  addRedesignToProject: async () => ({} as RedesignEntry),
  updateRedesignListingText: async () => {},
  deleteRedesign: async () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProjects = useCallback(async () => {
    const all = await ProjectStorage.getAllProjects();
    setProjects(all);
  }, []);

  useEffect(() => {
    refreshProjects().finally(() => setIsLoading(false));
  }, [refreshProjects]);

  const createProject = useCallback(
    async (name: string) => {
      const project = await ProjectStorage.createProject(name);
      await refreshProjects();
      return project;
    },
    [refreshProjects]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await ProjectStorage.deleteProject(id);
      await refreshProjects();
    },
    [refreshProjects]
  );

  const addRedesignToProject = useCallback(
    async (
      projectId: string,
      data: {
        roomType: string;
        style: string;
        guestType?: string;
        customInstructions?: string;
        beforeBase64: string;
        afterBase64: string;
        listingText?: string;
      }
    ) => {
      const entry = await ProjectStorage.addRedesignToProject(projectId, data);
      await refreshProjects();
      return entry;
    },
    [refreshProjects]
  );

  const updateRedesignListingText = useCallback(
    async (projectId: string, redesignId: string, text: string) => {
      await ProjectStorage.updateRedesignListingText(
        projectId,
        redesignId,
        text
      );
      await refreshProjects();
    },
    [refreshProjects]
  );

  const deleteRedesign = useCallback(
    async (projectId: string, redesignId: string) => {
      await ProjectStorage.deleteRedesign(projectId, redesignId);
      await refreshProjects();
    },
    [refreshProjects]
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        refreshProjects,
        createProject,
        deleteProject,
        addRedesignToProject,
        updateRedesignListingText,
        deleteRedesign,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  return use(ProjectContext);
}
